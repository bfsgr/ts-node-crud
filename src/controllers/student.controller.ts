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
		const data: Student = plainToClass(Student, req.body, { excludeExtraneousValues: true });

		const errors = await validate(data);

		if (errors.length > 0) {
			//TODO = filter validation errors
			res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, errors: errors });
		} else {
			const manager = await getManager();

			await manager
				.save(data)
				.then(() => {
					res.status(StatusCodes.CREATED).json({ status: StatusCodes.CREATED });
				})
				.catch((e) => {
					// todo = log error
					throw Error('Internal Server Error, contact developer');
				});
		}
	};

	update = async () => {};

	delete = async () => {};
}

export default StudentController;
