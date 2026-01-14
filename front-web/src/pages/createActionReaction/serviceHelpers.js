import { OAUTH_SERVICES } from './paramsHints';

export const serviceRequiresOAuth = (serviceName) => {
    return OAUTH_SERVICES.includes(serviceName);
};

export const getActionsForService = (services, serviceName) => {
    const service = services.find(s => s.name === serviceName);
    return service?.actions || [];
};

export const getReactionsForService = (services, serviceName) => {
    const service = services.find(s => s.name === serviceName);
    return service?.reactions || [];
};

export const getServicesWithActions = (services) => {
    return services.filter(s => s.actions && s.actions.length > 0);
};

export const getServicesWithReactions = (services) => {
    return services.filter(s => s.reactions && s.reactions.length > 0);
};
