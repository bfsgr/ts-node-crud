import { Student } from '../entity/student.entity';
import * as express from 'express';
import { Request, Response } from 'express';
import IControllerBase from 'interfaces/IControllerBase.interface';
import { getManager } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

class StudentController implements IControllerBase {
	public path = '/';
	public router = express.Router();

	constructor() {
		this.initRoutes();
	}

	public initRoutes() {
		this.router.get('/student', this.index);
		this.router.post('/student', this.create);
	}

	index = async (req: Request, res: Response) => {
		res.status(StatusCodes.OK).json({ status: 200 });
	};

	show = async () => {};

	create = async (req: Request, res: Response) => {
		// const manager = await getManager();

		const data: Student = plainToClass(Student, req.body, { excludeExtraneousValues: true });

		const erros = await validate(data);

		res.status(StatusCodes.OK).json({ status: StatusCodes.OK, errors: erros });
	};

	update = async () => {};

	delete = async () => {};
}

export default StudentController;
