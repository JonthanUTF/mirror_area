const { Service, sequelize } = require('./src/models');

const services = [
    {
        name: 'email',
        label: 'Gmail',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
        active: true
    },
    {
        name: 'weather',
        label: 'Météo',
        icon: 'https://cdn-icons-png.flaticon.com/512/4052/4052984.png',
        active: true
    },
    {
        name: 'timer',
        label: 'Timer',
        icon: 'https://cdn-icons-png.flaticon.com/512/992/992700.png',
        active: true
    },
    {
        name: 'console',
        label: 'Debug Console',
        icon: 'https://cdn-icons-png.flaticon.com/512/120/120093.png',
        active: true
    }
];

async function seed() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Connected.');

        // Sync models if not already done (normally app.js does this, but for standalone seed it's safer)
        await sequelize.sync();

        console.log('Seeding services...');
        for (const service of services) {
            const [instance, created] = await Service.findOrCreate({
                where: { name: service.name },
                defaults: service
            });
            console.log(`Service "${service.label}" ${created ? 'created' : 'already exists'}.`);
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
