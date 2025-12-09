class ServiceRegistry {
    constructor() {
        this.services = new Map();
    }

    register(service) {
        this.services.set(service.name, service);
        console.log(`[REGISTRY] Registered service: ${service.name}`);
    }

    getService(name) {
        return this.services.get(name);
    }

    getAllServices() {
        return Array.from(this.services.values());
    }

    getAboutJson(clientIp) {
        const currentTime = Math.floor(Date.now() / 1000);

        return {
            client: {
                host: clientIp
            },
            server: {
                current_time: currentTime,
                services: this.getAllServices().map(service => ({
                    name: service.name,
                    actions: service.actions,
                    reactions: service.reactions
                }))
            }
        };
    }
}

// Singleton instance
const registry = new ServiceRegistry();
module.exports = registry;
