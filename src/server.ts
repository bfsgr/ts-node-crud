import App from './app';

import * as express from 'express';

import StudentController from './controllers/student.controller';

import eventHandler from './utils/event.handler';

class Server {
	private app: App;
	constructor() {
		this.app = new App({
			host: 'localhost',
			port: 5000,
			controllers: [new StudentController()],
			middleWares: [express.json()],
			handlers: eventHandler.init(),
		});
	}
	listen() {
		this.app.listen();
	}
	express() {
		return this.app.app;
	}
}

export default Server;
