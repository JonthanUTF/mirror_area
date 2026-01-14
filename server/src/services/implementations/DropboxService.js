const ServiceBase = require('../ServiceBase');
const { Service, UserService } = require('../../models');
const axios = require('axios');

class DropboxService extends ServiceBase {
    constructor() {
        super('dropbox', 'Dropbox', 'https://www.dropbox.com/static/images/logo.svg');

        this.baseURL = 'https://api.dropboxapi.com/2';
        this.contentURL = 'https://content.dropboxapi.com/2';

        // Actions (Triggers)
        this.registerAction('file_added', 'Triggers when a new file is added to a folder', {
            folderPath: 'string'
        });

        this.registerAction('file_modified', 'Triggers when a specific file is modified', {
            filePath: 'string'
        });

        this.registerAction('file_deleted_anywhere', 'Triggers when a file is deleted in any directory', {
        });

        // Reactions
        this.registerReaction('upload_file', 'Upload a file to Dropbox', {
            filePath: 'string',
            content: 'string'
        });

        this.registerReaction('create_folder', 'Create a folder in Dropbox', {
            folderPath: 'string'
        });

        this.registerReaction('delete_file', 'Delete a file or folder', {
            filePath: 'string'
        });
    }

    /**
     * Normalize folder path for Dropbox API
     */
    normalizeFolderPath(path) {
        if (!path || path.trim() === '' || path === '/') {
            return '';
        }
        let normalized = path.trim().replace(/\/+$/, '');
        if (!normalized.startsWith('/')) {
            normalized = '/' + normalized;
        }
        return normalized;
    }

    /**
     * Normalize file path for Dropbox API
     */
    normalizeFilePath(path) {
        if (!path || path.trim() === '') {
            throw new Error('File path is required');
        }
        let normalized = path.trim();
        if (!normalized.startsWith('/')) {
            normalized = '/' + normalized;
        }
        return normalized;
    }

    async getFreshAccessToken(userId) {
        const service = await Service.findOne({ where: { name: 'dropbox' } });
        if (!service) throw new Error('Dropbox service not found in database');

        const userService = await UserService.findOne({
            where: { userId, serviceId: service.id }
        });

        if (!userService || !userService.accessToken) {
            throw new Error('User is not connected to Dropbox');
        }

        if (userService.expiresAt && new Date(userService.expiresAt) < new Date(Date.now() + 5 * 60 * 1000)) {
            if (userService.refreshToken) {
                try {
                    const response = await axios.post('https://api.dropboxapi.com/oauth2/token', null, {
                        params: {
                            grant_type: 'refresh_token',
                            refresh_token: userService.refreshToken,
                            client_id: process.env.DROPBOX_CLIENT_ID,
                            client_secret: process.env.DROPBOX_CLIENT_SECRET
                        }
                    });

                    const { access_token, expires_in } = response.data;
                    const expiresAt = new Date(Date.now() + expires_in * 1000);

                    await userService.update({
                        accessToken: access_token,
                        expiresAt
                    });

                    return access_token;
                } catch (error) {
                    console.error('[DropboxService] Token refresh failed:', error.message);
                    throw new Error('Failed to refresh Dropbox token');
                }
            }
        }

        return userService.accessToken;
    }

    async makeRequest(userId, endpoint, method = 'POST', data = null, isContent = false) {
        const accessToken = await this.getFreshAccessToken(userId);
        const baseUrl = isContent ? this.contentURL : this.baseURL;

        const config = {
            method,
            url: `${baseUrl}${endpoint}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            if (isContent) {
                config.headers['Dropbox-API-Arg'] = JSON.stringify(data.args);
                config.headers['Content-Type'] = 'application/octet-stream';
                config.data = data.content;
            } else {
                config.data = data;
            }
        }

        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error(`[DropboxService] API error:`, error.response?.data || error.message);
            throw error;
        }
    }

    async isConnected(userId) {
        try {
            const service = await Service.findOne({ where: { name: 'dropbox' } });
            if (!service) return false;

            const userService = await UserService.findOne({
                where: { userId, serviceId: service.id }
            });

            return !!(userService && userService.accessToken);
        } catch {
            return false;
        }
    }

    async checkTrigger(action, area, params) {
        try {
            if (!await this.isConnected(area.userId)) {
                console.log(`[DropboxService] User ${area.userId} not connected to Dropbox`);
                return false;
            }

            switch (action) {
                case 'file_added': {
                    const folderPath = this.normalizeFolderPath(params.folderPath || '');
                    console.log(`[DropboxService] Checking for new files in folder: "${folderPath || '(root)'}"`);
                    return await this.checkFilesInFolder(area.userId, folderPath, area.lastTriggered);
                }

                case 'file_modified': {
                    const filePath = this.normalizeFilePath(params.filePath);
                    console.log(`[DropboxService] Checking if file was modified: "${filePath}"`);
                    return await this.checkFileModified(area.userId, filePath, area.lastTriggered);
                }

                case 'file_deleted_anywhere': {
                    console.log(`[DropboxService] Checking for deleted files anywhere in Dropbox (recursive)`);
                    return await this.checkFileDeletedAnywhere(area.userId, area.lastTriggered);
                }

                default:
                    console.log(`[DropboxService] Unknown action: ${action}`);
                    return false;
            }
        } catch (error) {
            console.error(`[DropboxService] Error checking trigger ${action}:`, error.message);
            return false;
        }
    }

    async executeReaction(reaction, area, params) {
        try {
            if (!await this.isConnected(area.userId)) {
                throw new Error('User is not connected to Dropbox');
            }

            switch (reaction) {
                case 'upload_file':
                    return await this.uploadFile(area.userId, params.filePath, params.content || '');

                case 'create_folder':
                    return await this.createFolder(area.userId, params.folderPath);

                case 'delete_file':
                    return await this.deleteFile(area.userId, params.filePath);

                default:
                    throw new Error(`Unknown reaction: ${reaction}`);
            }
        } catch (error) {
            console.error(`[DropboxService] Error executing reaction ${reaction}:`, error.message);
            throw error;
        }
    }

    // ===== TRIGGER IMPLEMENTATIONS =====

    async checkFilesInFolder(userId, folderPath, lastTriggered) {
        try {
            const response = await this.makeRequest(userId, '/files/list_folder', 'POST', {
                path: folderPath,
                recursive: false,
                include_deleted: false
            });

            if (!response.entries || response.entries.length === 0) {
                console.log(`[DropboxService] Folder "${folderPath || 'root'}" is empty`);
                return false;
            }

            const lastCheck = lastTriggered ? new Date(lastTriggered) : new Date(0);

            for (const entry of response.entries) {
                if (entry['.tag'] === 'file' && entry.server_modified) {
                    const modifiedDate = new Date(entry.server_modified);
                    if (modifiedDate > lastCheck) {
                        console.log(`[DropboxService] New file detected: ${entry.path_display}`);
                        return {
                            triggered: true,
                            data: {
                                fileName: entry.name,
                                filePath: entry.path_display,
                                size: entry.size,
                                modifiedAt: entry.server_modified
                            }
                        };
                    }
                }
            }

            return false;
        } catch (error) {
            if (error.response?.status === 409 || error.response?.data?.error?.['.tag'] === 'path') {
                console.log(`[DropboxService] Folder "${folderPath || 'root'}" not found or empty`);
                return false;
            }
            throw error;
        }
    }

    async checkFileModified(userId, filePath, lastTriggered) {
        try {
            const response = await this.makeRequest(userId, '/files/get_metadata', 'POST', {
                path: filePath,
                include_deleted: false
            });

            if (response['.tag'] !== 'file') {
                console.log(`[DropboxService] Path "${filePath}" is not a file`);
                return false;
            }

            const lastCheck = lastTriggered ? new Date(lastTriggered) : new Date(0);
            const modifiedDate = new Date(response.server_modified);

            if (modifiedDate > lastCheck) {
                console.log(`[DropboxService] File "${filePath}" was modified at ${response.server_modified}`);
                return {
                    triggered: true,
                    data: {
                        fileName: response.name,
                        filePath: response.path_display,
                        size: response.size,
                        modifiedAt: response.server_modified
                    }
                };
            }

            console.log(`[DropboxService] File "${filePath}" not modified since last check`);
            return false;
        } catch (error) {
            if (error.response?.status === 409 || error.response?.data?.error?.['.tag'] === 'path') {
                console.log(`[DropboxService] File "${filePath}" not found`);
                return false;
            }
            throw error;
        }
    }

    async checkFileDeletedAnywhere(userId, lastTriggered) {
        try {
            const response = await this.makeRequest(userId, '/files/list_folder', 'POST', {
                path: '',
                recursive: true,
                include_deleted: true
            });

            if (!response.entries) return false;

            // Collect all deleted entries
            let deletedEntries = response.entries.filter(entry => entry['.tag'] === 'deleted');

            // Handle pagination for recursive searches
            let hasMore = response.has_more;
            let cursor = response.cursor;

            while (hasMore) {
                const continueResponse = await this.makeRequest(userId, '/files/list_folder/continue', 'POST', {
                    cursor: cursor
                });

                const moreDeleted = continueResponse.entries.filter(entry => entry['.tag'] === 'deleted');
                deletedEntries = deletedEntries.concat(moreDeleted);

                hasMore = continueResponse.has_more;
                cursor = continueResponse.cursor;

                // Safety limit to avoid infinite loops
                if (deletedEntries.length > 100) break;
            }

            if (deletedEntries.length > 0) {
                const entry = deletedEntries[0];
                console.log(`[DropboxService] Deleted file detected: ${entry.path_display} (recursive search)`);
                return {
                    triggered: true,
                    data: {
                        fileName: entry.name,
                        filePath: entry.path_display,
                        deletedCount: deletedEntries.length
                    }
                };
            }

            return false;
        } catch (error) {
            if (error.response?.status === 409 || error.response?.data?.error?.['.tag'] === 'path') {
                console.log(`[DropboxService] Error checking deleted files`);
                return false;
            }
            throw error;
        }
    }

    // ===== REACTION IMPLEMENTATIONS =====

    async uploadFile(userId, filePath, content) {
        const normalizedPath = this.normalizeFilePath(filePath);

        const response = await this.makeRequest(userId, '/files/upload', 'POST', {
            args: {
                path: normalizedPath,
                mode: 'overwrite',
                autorename: true,
                mute: false
            },
            content: content
        }, true);

        console.log(`[DropboxService] File uploaded: ${normalizedPath}`);
        return {
            success: true,
            path: response.path_display,
            size: response.size
        };
    }

    async createFolder(userId, folderPath) {
        const normalizedPath = this.normalizeFilePath(folderPath);

        try {
            const response = await this.makeRequest(userId, '/files/create_folder_v2', 'POST', {
                path: normalizedPath,
                autorename: false
            });

            console.log(`[DropboxService] Folder created: ${normalizedPath}`);
            return {
                success: true,
                path: response.metadata.path_display
            };
        } catch (error) {
            if (error.response?.data?.error?.['.tag'] === 'path' &&
                error.response?.data?.error?.path?.['.tag'] === 'conflict') {
                return { success: true, path: normalizedPath, message: 'Folder already exists' };
            }
            throw error;
        }
    }

    async deleteFile(userId, filePath) {
        const normalizedPath = this.normalizeFilePath(filePath);

        const response = await this.makeRequest(userId, '/files/delete_v2', 'POST', {
            path: normalizedPath
        });

        console.log(`[DropboxService] File/folder deleted: ${normalizedPath}`);
        return {
            success: true,
            path: response.metadata.path_display
        };
    }
}

module.exports = new DropboxService();