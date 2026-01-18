const ServiceBase = require('../ServiceBase');
const axios = require('axios');
const { UserService, Service } = require('../../models');

class MicrosoftService extends ServiceBase {
    constructor() {
        super('microsoft', 'Microsoft (OneDrive / Outlook)', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/960px-Microsoft_logo_%282012%29.svg.png');

        // OneDrive actions
        this.registerAction('onedrive_new_file', 'OneDrive: A new file is present in the specified directory', {
            watchPath: 'string'
        });

        this.registerAction('onedrive_file_shared', 'OneDrive: A file was shared with the user (sharedWithMe)', {
            watchPath: 'string'
        });

        // Outlook actions
        this.registerAction('outlook_new_from', 'Outlook: Receipt of a message from a given sender', {
            sender: 'string'
        });

        this.registerAction('outlook_subject_contains', 'Outlook: Receipt of a message whose subject contains a keyword', {
            keyword: 'string'
        });

        // Reactions
        this.registerReaction('onedrive_upload_file', 'OneDrive: Upload a file to OneDrive', {
            uploadPath: 'string', 
            content: 'string'
            // contentType is optional, defaults to 'text/plain'
        });

        this.registerReaction('onedrive_create_share', 'OneDrive: Create a share link for a OneDrive item and send it by email', {
            sharePath: 'string',
            type: 'select:view,edit',
            emailTo: 'string'
        });

        this.registerReaction('outlook_send_email', 'Outlook: Send an email via Outlook 365', {
            to: 'string',
            subject: 'string',
            body: 'string'
        });
    }

    async getGraphClient(userId) {
        const service = await Service.findOne({ where: { name: 'microsoft' } });
        if (!service) {
            throw new Error('Microsoft service not found');
        }

        const userService = await UserService.findOne({
            where: { userId, serviceId: service.id }
        });

        if (!userService || !userService.accessToken) {
            throw new Error('Microsoft not connected for this user');
        }

        const instance = axios.create({
            baseURL: 'https://graph.microsoft.com/v1.0',
            headers: {
                Authorization: `Bearer ${userService.accessToken}`
            },
            timeout: 10000
        });

        return instance;
    }

    async checkTrigger(action, area, params) {
        try {
            const client = await this.getGraphClient(area.userId);
            const lastTriggered = area.lastTriggered ? new Date(area.lastTriggered) : null;

            switch (action) {
                case 'onedrive_new_file':
                    return await this._checkOneDriveNewFile(client, params.watchPath, lastTriggered);

                case 'onedrive_file_shared':
                    return await this._checkOneDriveFileShared(client, params.watchPath, lastTriggered);

                case 'outlook_new_from':
                    return await this._checkOutlookNewFrom(client, params.sender, lastTriggered);

                case 'outlook_subject_contains':
                    return await this._checkOutlookSubjectContains(client, params.keyword, lastTriggered);

                default:
                    console.log(`[MicrosoftService] Unknown action: ${action}`);
                    return false;
            }
        } catch (err) {
            console.error(`[MicrosoftService] Error checking trigger ${action}:`, err.message);
            return false;
        }
    }

    async executeReaction(reaction, area, params) {
        try {
            const client = await this.getGraphClient(area.userId);

            switch (reaction) {
                case 'onedrive_upload_file':
                    return await this._onedriveUploadFile(client, params.uploadPath, params.content, params.contentType);

                case 'onedrive_create_share':
                    return await this._onedriveCreateShare(client, params.sharePath, params.type, params.emailTo);

                case 'outlook_send_email':
                    const recipient = params.to || params.recipient;
                    return await this._outlookSendEmail(client, recipient, params.subject, params.body);

                default:
                    throw new Error(`Unknown reaction: ${reaction}`);
            }
        } catch (err) {
            console.error(`[MicrosoftService] Error executing reaction ${reaction}:`, err.message);
            throw err;
        }
    }

    // ===== OneDrive: check implementations =====

    async _checkOneDriveNewFile(client, watchPath = '', lastTriggered) {
        try {
            let items = [];

            console.log(`[MicrosoftService] Checking for new files in: "${watchPath || 'root'}"`);

            if (watchPath) {
                const cleanPath = watchPath.replace(/^\/+|\/+$/g, '');
                
                try {
                    // Get the folder item to retrieve its ID
                    const folderRes = await client.get(`/me/drive/root:/${cleanPath}`);
                    const folderId = folderRes.data.id;
                    
                    if (!folderId) {
                        console.error('[MicrosoftService] Folder not found:', cleanPath);
                        return false;
                    }

                    // List children
                    const childrenRes = await client.get(`/me/drive/items/${folderId}/children?$top=50`);
                    items = childrenRes.data.value || [];
                } catch (folderErr) {
                    if (folderErr.response?.status === 404) {
                        console.log(`[MicrosoftService] Folder "${cleanPath}" does not exist yet`);
                        return false;
                    }
                    throw folderErr;
                }
            } else {
                const res = await client.get('/me/drive/root/children?$top=50');
                items = res.data.value || [];
            }

            // Sort client-side
            items.sort((a, b) => {
                const dateA = new Date(a.createdDateTime || a.lastModifiedDateTime || 0);
                const dateB = new Date(b.createdDateTime || b.lastModifiedDateTime || 0);
                return dateB - dateA;
            });

            const newItems = items.filter(item => {
                const created = new Date(item.createdDateTime || item.lastModifiedDateTime);
                return !lastTriggered || created > lastTriggered;
            });

            if (newItems.length > 0) {
                console.log(`[MicrosoftService] Found ${newItems.length} new OneDrive file(s) in "${watchPath || '/'}"`);
                return true;
            }
            return false;
        } catch (err) {
            console.error('[MicrosoftService] _checkOneDriveNewFile error:', err.response?.data || err.message);
            return false;
        }
    }

    async _checkOneDriveFileShared(client, watchPath = '', lastTriggered) {
        try {
            const res = await client.get('/me/drive/sharedWithMe?$top=50');
            let items = res.data.value || [];

            // Sort client-side
            items.sort((a, b) => {
                const dateA = new Date(a.remoteItem?.shared?.sharedDateTime || a.createdDateTime || 0);
                const dateB = new Date(b.remoteItem?.shared?.sharedDateTime || b.createdDateTime || 0);
                return dateB - dateA;
            });

            // Filter by path if specified
            if (watchPath) {
                const cleanPath = watchPath.toLowerCase().replace(/^\/+|\/+$/g, '');
                items = items.filter(item => {
                    const itemPath = (item.parentReference?.path || '').toLowerCase();
                    const itemName = (item.name || '').toLowerCase();
                    return itemPath.includes(cleanPath) || itemName.includes(cleanPath);
                });
            }

            const newItems = items.filter(item => {
                const sharedDate = new Date(item.remoteItem?.shared?.sharedDateTime || item.createdDateTime);
                return !lastTriggered || sharedDate > lastTriggered;
            });

            if (newItems.length > 0) {
                console.log(`[MicrosoftService] Found ${newItems.length} new shared OneDrive file(s)`);
                return true;
            }
            return false;
        } catch (err) {
            console.error('[MicrosoftService] _checkOneDriveFileShared error:', err.response?.data || err.message);
            return false;
        }
    }

    // ===== Outlook: check implementations =====

    async _checkOutlookNewFrom(client, sender, lastTriggered) {
        try {
            if (!sender) {
                console.log('[MicrosoftService] No sender specified for outlook_new_from');
                return false;
            }

            const res = await client.get('/me/messages?$top=50&$select=id,subject,from,receivedDateTime');
            let messages = res.data.value || [];

            // Sort client-side by receivedDateTime descending
            messages.sort((a, b) => {
                const dateA = new Date(a.receivedDateTime || 0);
                const dateB = new Date(b.receivedDateTime || 0);
                return dateB - dateA;
            });

            // Filter by sender client-side
            const senderLower = sender.toLowerCase();
            messages = messages.filter(msg => {
                const fromAddress = (msg.from?.emailAddress?.address || '').toLowerCase();
                const fromName = (msg.from?.emailAddress?.name || '').toLowerCase();
                return fromAddress.includes(senderLower) || fromName.includes(senderLower);
            });

            const newMessages = messages.filter(msg => {
                const received = new Date(msg.receivedDateTime);
                return !lastTriggered || received > lastTriggered;
            });

            if (newMessages.length > 0) {
                console.log(`[MicrosoftService] Found ${newMessages.length} new email(s) from "${sender}"`);
                return true;
            }
            return false;
        } catch (err) {
            console.error('[MicrosoftService] _checkOutlookNewFrom error:', err.response?.data || err.message);
            return false;
        }
    }

    async _checkOutlookSubjectContains(client, keyword, lastTriggered) {
        try {
            if (!keyword) {
                console.log('[MicrosoftService] No keyword specified for outlook_subject_contains');
                return false;
            }

            const res = await client.get('/me/messages?$top=50&$select=id,subject,receivedDateTime');
            let messages = res.data.value || [];

            // Sort client-side by receivedDateTime descending
            messages.sort((a, b) => {
                const dateA = new Date(a.receivedDateTime || 0);
                const dateB = new Date(b.receivedDateTime || 0);
                return dateB - dateA;
            });

            // Filter by keyword in subject client-side
            const keywordLower = keyword.toLowerCase();
            messages = messages.filter(msg => {
                const subject = (msg.subject || '').toLowerCase();
                return subject.includes(keywordLower);
            });

            const newMessages = messages.filter(msg => {
                const received = new Date(msg.receivedDateTime);
                return !lastTriggered || received > lastTriggered;
            });

            if (newMessages.length > 0) {
                console.log(`[MicrosoftService] Found ${newMessages.length} new email(s) with subject containing "${keyword}"`);
                return true;
            }
            return false;
        } catch (err) {
            console.error('[MicrosoftService] _checkOutlookSubjectContains error:', err.response?.data || err.message);
            return false;
        }
    }

    // ===== Reactions implementations =====

    async _onedriveUploadFile(client, uploadPath, content = '', contentType = 'text/plain') {
        try {
            if (!uploadPath) throw new Error('Upload path is required for file upload');
            
            const cleanPath = uploadPath.replace(/^\/+/, '');
            
            // Use PUT to upload file content
            const endpointPath = `/me/drive/root:/${cleanPath}:/content`;
            
            console.log(`[MicrosoftService] Uploading file to: ${endpointPath}`);
            
            const res = await client.put(endpointPath, content, {
                headers: { 'Content-Type': contentType }
            });
            
            const info = res.data || {};
            console.log(`[MicrosoftService] Uploaded file to ${uploadPath}, id: ${info.id}`);
            return { success: true, id: info.id, webUrl: info.webUrl };
        } catch (err) {
            console.error('[MicrosoftService] _onedriveUploadFile error:', err.response?.data || err.message);
            throw err;
        }
    }

    async _onedriveCreateShare(client, sharePath, type = 'view', emailTo) {
        try {
            if (!sharePath) throw new Error('Share path is required for creating share link');

            const cleanPath = sharePath.replace(/^\/+/, '');
            
            let itemId;
            try {
                const itemRes = await client.get(`/me/drive/root:/${cleanPath}`);
                itemId = itemRes.data.id;
            } catch (itemErr) {
                if (itemErr.response?.status === 404) {
                    throw new Error(`File not found: ${cleanPath}`);
                }
                throw itemErr;
            }

            if (!itemId) {
                throw new Error(`Could not get item ID for: ${cleanPath}`);
            }

            // Create share link using item ID
            const shareRes = await client.post(`/me/drive/items/${itemId}/createLink`, {
                type: type === 'edit' ? 'edit' : 'view',
                scope: 'anonymous'
            });

            const link = shareRes.data?.link?.webUrl || shareRes.data?.link?.webHtml;
            console.log(`[MicrosoftService] Created share link for ${sharePath}: ${link}`);

            // Send email with the share link
            if (emailTo) {
                const fileName = cleanPath.split('/').pop();
                const subject = `Share link for: ${fileName}`;
                const body = `Here is your share link for "${fileName}":<br><br><a href="${link}">${link}</a><br><br>Access type: ${type === 'edit' ? 'Edit' : 'View only'}`;

                await this._outlookSendEmail(client, emailTo, subject, body);
                console.log(`[MicrosoftService] Share link sent to ${emailTo}`);
            }

            return { success: true, link, emailSent: !!emailTo };
        } catch (err) {
            console.error('[MicrosoftService] _onedriveCreateShare error:', err.response?.data || err.message);
            throw err;
        }
    }

    async _outlookSendEmail(client, to, subject = '', body = '') {
        try {
            const recipient = to;
            if (!recipient) throw new Error('Recipient required');

            const message = {
                message: {
                    subject: subject || '(No subject)',
                    body: {
                        contentType: 'HTML',
                        content: `<html><body><p>${body || ''}</p></body></html>`
                    },
                    toRecipients: [
                        {
                            emailAddress: {
                                address: recipient
                            }
                        }
                    ],
                    importance: 'normal'
                },
                saveToSentItems: true
            };

            console.log(`[MicrosoftService] Sending email to: ${recipient}`);
            console.log(`[MicrosoftService] Subject: ${subject}`);
            
            await client.post('/me/sendMail', message);
            
            console.log(`[MicrosoftService] Email sent successfully to ${recipient}`);
            return { success: true };
        } catch (err) {
            console.error('[MicrosoftService] _outlookSendEmail error:', err.response?.data || err.message);
            throw err;
        }
    }
}

module.exports = new MicrosoftService();