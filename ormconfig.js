module.exports = {
	type: 'sqlite',
	database: 'src/data/students.sqlite',
	synchronize: false,
	logging: true,
	entities: ['src/entity/*.ts'],
	migrations: ['src/migration/*.ts'],
	cli: {
		entitiesDir: 'src/entity',
		migrationsDir: 'src/migration',
	},
};
