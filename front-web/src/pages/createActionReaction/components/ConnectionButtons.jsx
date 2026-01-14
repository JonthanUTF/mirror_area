import { Button } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SERVICE_STYLES = {
    twitch: { bg: '#9146FF', hover: '#7c3aed' },
    google: { bg: '#4285F4', hover: '#3367D6' },
    microsoft: { bg: '#00A4EF', hover: '#0078D4' },
    github: { bg: '#24292e', hover: '#1b1f23' },
    dropbox: { bg: '#0061FF', hover: '#004FC5' },
};

const SERVICE_LABELS = {
    twitch: 'Twitch',
    google: 'Google',
    microsoft: 'Microsoft',
    github: 'GitHub',
    dropbox: 'Dropbox',
};

export const ConnectionButton = ({ serviceName, connected, onConnect }) => {
    const styles = SERVICE_STYLES[serviceName];
    const label = SERVICE_LABELS[serviceName];

    if (!styles || !label) return null;

    return (
        <Button
            variant={connected ? "outlined" : "contained"}
            onClick={onConnect}
            disabled={connected}
            startIcon={connected ? <CheckCircleIcon /> : <LinkIcon />}
            sx={{
                backgroundColor: connected ? 'transparent' : styles.bg,
                borderColor: connected ? '#4ade80' : undefined,
                color: connected ? '#4ade80' : 'white',
                '&:hover': {
                    backgroundColor: connected ? 'transparent' : styles.hover,
                }
            }}
        >
            {connected ? `${label} Connected` : `Connect ${label}`}
        </Button>
    );
};

export const ConnectionButtonsGroup = ({ handlers, isServiceConnected }) => {
    const services = ['twitch', 'google', 'microsoft', 'github', 'dropbox'];

    const handlerMap = {
        twitch: handlers.handleTwitchConnect,
        google: handlers.handleGoogleConnect,
        microsoft: handlers.handleMicrosoftConnect,
        github: handlers.handleGitHubConnect,
        dropbox: handlers.handleDropboxConnect,
    };

    return (
        <>
            {services.map(service => (
                <ConnectionButton
                    key={service}
                    serviceName={service}
                    connected={isServiceConnected(service)}
                    onConnect={handlerMap[service]}
                />
            ))}
        </>
    );
};
