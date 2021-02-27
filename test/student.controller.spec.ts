import { Application } from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';

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

describe('create', () => {
	it('should create student and return CREATED', async (done) => {
		request(server)
			.post('/student')
			.send({ first_name: 'Josh', last_name: 'Gold', year_of_admission: 2018 })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.CREATED)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).toMatchObject({ status: StatusCodes.CREATED });
				done();
			});
	});
});
