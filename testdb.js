module.exports = {
	type: 'sqlite',
	database: 'src/data/students-test.sqlite',
	synchronize: false,
	logging: false,
	entities: ['src/entity/*.ts'],
	migrations: ['src/migration/*.ts'],
	dropSchema: true,
	migrationsRun: true,
	cli: {
		entitiesDir: 'src/entity',
		migrationsDir: 'src/migration',
	},
};
