export const API_BASE = import.meta.env.CLIENT_URL || "http://localhost:8080";

export const PARAM_HINTS = {
    // Dropbox - Folder watching
    folderPath: {
        placeholder: 'Leave empty for root, or /Documents',
        helperText: 'Folder to watch'
    },
    // Dropbox - File specific
    filePath: {
        placeholder: '/path/to/file.txt',
        helperText: 'Full file path including filename (must start with /)'
    },
    content: {
        placeholder: 'Text content to write',
        helperText: 'Content to upload'
    },
    // Weather
    latitude: {
        placeholder: 'e.g., 48.8566',
        helperText: 'Latitude coordinate'
    },
    longitude: {
        placeholder: 'e.g., 2.3522',
        helperText: 'Longitude coordinate'
    },
    tempThreshold: {
        placeholder: 'e.g., 20',
        helperText: 'Temperature threshold in °C'
    },
    // Timer
    interval: {
        placeholder: 'e.g., 60',
        helperText: 'Interval in seconds'
    },
    // Email
    to: {
        placeholder: 'e.g., user@example.com',
        helperText: 'Recipient email address'
    },
    subject: {
        placeholder: 'e.g., Notification',
        helperText: 'Email subject line'
    },
    body: {
        placeholder: 'Email content...',
        helperText: 'Email body content'
    },
    // GitHub
    owner: {
        placeholder: 'e.g., microsoft',
        helperText: 'Repository owner/organization'
    },
    repo: {
        placeholder: 'e.g., vscode',
        helperText: 'Repository name'
    },
    title: {
        placeholder: 'Issue title',
        helperText: 'Title for the issue'
    },
    // Generic
    message: {
        placeholder: 'Enter message',
        helperText: 'Message content'
    },
    path: {
        placeholder: 'e.g., /folder/file.txt',
        helperText: 'File or folder path'
    }
};

export const OAUTH_SERVICES = ['twitch', 'google', 'microsoft', 'github', 'dropbox'];
