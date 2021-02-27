import { Student } from '../entity/student.entity';
import * as express from 'express';
import { Request, Response } from 'express';
import IControllerBase from 'interfaces/IControllerBase.interface';
import { EntityNotFoundError, getManager } from 'typeorm';
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
		this.router.get('/student/:id', this.show);
	}

	index = async (req: Request, res: Response) => {
		const PAGE_SIZE = 4;
		const pageNum = +req.query.p ? +req.query.p : 0;

		const manager = await getManager().getRepository('Student');

		manager
			.find({ skip: pageNum * PAGE_SIZE, take: PAGE_SIZE })
			.then((students) => {
				if (students.length > 0) {
					res.status(StatusCodes.OK).json({ students });
				} else {
					res.status(StatusCodes.NOT_FOUND).json();
				}
			})
			.catch((e) => {
				throw Error('Internal Server Error, contact developer');
			});
	};

	show = async (req: Request, res: Response) => {
		const studentId = +req.params.id ? +req.params.id : null;

		if (!studentId) {
			res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				errors: {
					parameters: ['invalid id'],
				},
			});
		} else {
			const manager = await getManager().getRepository('Student');
			manager
				.findOne({ where: { id: studentId } })
				.then((student) => {
					if (student) {
						res.status(StatusCodes.OK).json({ student });
					} else {
						res.status(StatusCodes.NOT_FOUND).json({
							status: StatusCodes.NOT_FOUND,
							errors: { student: ['entity not found'] },
						});
					}
				})
				.catch((e) => {
					throw Error('Internal Server Error, contact developer');
				});
		}
	};

	create = async (req: Request, res: Response) => {
		const data: Student = plainToClass(Student, req.body, { excludeExtraneousValues: true });

		const errors = await validate(data);

		if (errors.length > 0) {
			let formated: Record<string, any> = {};

			errors.forEach((el) => {
				formated[el.property] = Object.values(el.constraints).map((x) => {
					return x.slice(el.property.length + 1);
				});
			});
			res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, errors: formated });
		} else {
			const manager = await getManager();

			manager
				.save(data)
				.then(() => {
					res.status(StatusCodes.CREATED).json({ status: StatusCodes.CREATED });
				})
				.catch((e) => {
					// TODO = log error to file
					throw Error('Internal Server Error, contact developer');
				});
		}
	};

	update = async () => {};

	delete = async () => {};
}

export default StudentController;
