class ServiceBase {
    constructor(name, label, icon) {
        this.name = name;
        this.label = label;
        this.icon = icon;
        this.actions = [];
        this.reactions = [];
    }

    registerAction(name, description, options = {}) {
        this.actions.push({
            name,
            description,
            options
        });
    }

    registerReaction(name, description, options = {}) {
        this.reactions.push({
            name,
            description,
            options
        });
    }

    async checkTrigger(action, area, params) {
        throw new Error('Method checkTrigger must be implemented');
    }

    async executeReaction(reaction, area, params) {
        throw new Error('Method executeReaction must be implemented');
    }
}

module.exports = ServiceBase;
