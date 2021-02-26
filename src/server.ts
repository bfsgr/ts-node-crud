import App from './app';

import * as bodyParser from 'body-parser';

import StudentController from './controllers/student.controller';

import EventHandler from './utils/event.handler';

const app = new App({
	host: 'localhost',
	port: 5000,
	controllers: [new StudentController()],
	middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })],
	handlers: new EventHandler().init(),
});

app.listen();
