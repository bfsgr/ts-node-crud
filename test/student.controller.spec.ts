import { doesNotMatch } from 'assert';
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

	it('should not create student without first name', async (done) => {
		request(server)
			.post('/student')
			.send({ last_name: 'Gold', year_of_admission: 2018 })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.BAD_REQUEST)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).toMatchObject({
					status: StatusCodes.BAD_REQUEST,
				});
				done();
			});
	});

	it('should not create student without last name', async (done) => {
		request(server)
			.post('/student')
			.send({ first_name: 'Abby', year_of_admission: 2018 })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.BAD_REQUEST)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).toMatchObject({
					status: StatusCodes.BAD_REQUEST,
				});
				done();
			});
	});

	it('should not create student without year of admission', async (done) => {
		request(server)
			.post('/student')
			.send({ first_name: 'Abby', last_name: 'Gold' })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.BAD_REQUEST)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).toMatchObject({
					status: StatusCodes.BAD_REQUEST,
				});
				done();
			});
	});

	it('should not create student with first name less than 3 characters', async (done) => {
		request(server)
			.post('/student')
			.send({ first_name: 'Ab', last_name: 'Gold', year_of_admission: 2018 })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.BAD_REQUEST)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).toMatchObject({
					status: StatusCodes.BAD_REQUEST,
				});
				done();
			});
	});

	it('should not create student with first name more than 50 characters', async (done) => {
		request(server)
			.post('/student')
			.send({
				first_name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				last_name: 'Gold',
				year_of_admission: 2018,
			})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.BAD_REQUEST)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).toMatchObject({
					status: StatusCodes.BAD_REQUEST,
				});
				done();
			});
	});

	it('should not create student with last name more than 255 characters', async (done) => {
		request(server)
			.post('/student')
			.send({
				first_name: 'Abby',
				last_name: `aaaaaaaaaaaaaaaaaaaaaaaaaaaa
					aaaaaaaaaaaaaaaaaaaaaaaaaaaaa
					aaaaaaaaaaaaaaaaaaaaaaaaaaaaa
					aaaaaaaaaaaaaaaaaaaaaaaaaaaaa
					aaaaaaaaaaaaaaaaaaaaaaaaaaaaa
					aaaaaaaaaaaaaaaaaaaaaaaaaaaaa
					aaaaaaaaaaaaaaaaaaaaaaaaaaaaa
					aaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
				year_of_admission: 2018,
			})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.BAD_REQUEST)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).toMatchObject({
					status: StatusCodes.BAD_REQUEST,
				});
				done();
			});
	});

	it('should not create student with last name less than 3 characters', async (done) => {
		request(server)
			.post('/student')
			.send({ first_name: 'Abby', last_name: 'Tr', year_of_admission: 2018 })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.BAD_REQUEST)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).toMatchObject({
					status: StatusCodes.BAD_REQUEST,
				});
				done();
			});
	});

	it('should not create student with year of admission before 1900', async (done) => {
		request(server)
			.post('/student')
			.send({ first_name: 'Josh', last_name: 'Trayson', year_of_admission: 1899 })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.BAD_REQUEST)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).toMatchObject({
					status: StatusCodes.BAD_REQUEST,
				});
				done();
			});
	});

	it('should not create student with year of admission in the future', async (done) => {
		request(server)
			.post('/student')
			.send({ first_name: 'Josh', last_name: 'Trayson', year_of_admission: 2022 })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.BAD_REQUEST)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).toMatchObject({
					status: StatusCodes.BAD_REQUEST,
				});
				done();
			});
	});
});

describe('index', () => {
	it('should return first 4 students', async (done) => {
		request(server)
			.get('/student')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.OK)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).toMatchObject({
					students: [
						{
							id: 1,
							first_name: 'John',
							last_name: 'Smith',
							year_of_admission: 2011,
						},
						{
							id: 2,
							first_name: 'Luke',
							last_name: 'Gold',
							year_of_admission: 2021,
						},
						{
							id: 3,
							first_name: 'Tayler',
							last_name: 'McSaint',
							year_of_admission: 2017,
						},
						{
							id: 4,
							first_name: 'Adam',
							last_name: 'Smith',
							year_of_admission: 2015,
						},
					],
				});
				expect(res.body.students.length).toBe(4);
				done();
			});
	});
	it('should return NOT FOUND', async (done) => {
		request(server)
			.get('/student?p=15')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.NOT_FOUND)
			.end((err, res) => {
				if (err) return done(err);
				done();
			});
	});
});

describe('show', () => {
	it('should return the first student', async (done) => {
		request(server)
			.get('/student/1')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.OK)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).toMatchObject({
					student: {
						first_name: 'John',
						last_name: 'Smith',
						year_of_admission: 2011,
					},
				});
				done();
			});
	});

	it('should return NOT FOUND', async (done) => {
		request(server)
			.get('/student/200')
			.expect('Content-Type', /json/)
			.expect(StatusCodes.NOT_FOUND)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).toMatchObject({
					status: StatusCodes.NOT_FOUND,
				});
				done();
			});
	});
});
