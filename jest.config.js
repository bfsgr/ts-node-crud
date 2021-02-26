module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleNameMapper: {
		'@nodets-crud/(.*)': '<rootDir>/src/$1',
	},
};
