import { Application } from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { Connection, ConnectionOptionsReader, createConnection, getConnection } from 'typeorm';

import Server from '../src/server';

let server: Application;

beforeAll(async () => {
	server = new Server().express();
	await createConnection(require('../testdb'));
});

afterAll(async () => {
	await getConnection().close();
});

beforeEach(async () => {
	const connection = getConnection();
	const entities = connection.entityMetadatas;
	const entityDeletionPromises = entities.map((entity) => async () => {
		const repository = connection.getRepository(entity.name);
		await repository.query(`DELETE FROM ${entity.tableName}`);
	});
	await Promise.all(entityDeletionPromises);
});

describe('index', () => {
	it('should return 200', async (done) => {
		request(server)
			.get('/student')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.OK)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).toMatchObject({ status: StatusCodes.OK });
				done();
			});
	});
});
