import App from './app';

import * as bodyParser from 'body-parser';

import StudentController from './controllers/student.controller';

import eventHandler from './utils/event.handler';

class Server {
	private app: App;
	constructor() {
		this.app = new App({
			host: 'localhost',
			port: 5000,
			controllers: [new StudentController()],
			middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })],
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
