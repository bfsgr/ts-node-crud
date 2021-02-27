import { Student } from '../entity/student.entity';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
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
		this.router.patch('/student/:id', this.update);
		this.router.delete('/student/:id', this.delete);
	}

	index = async (req: Request, res: Response, next: NextFunction) => {
		const PAGE_SIZE = 4;
		const pageNum = +req.query.p ? +req.query.p : 0;

		const manager = getManager().getRepository('Student');

		manager
			.find({ skip: pageNum * PAGE_SIZE, take: PAGE_SIZE })
			.then((students) => {
				if (students.length > 0) {
					res.status(StatusCodes.OK).json({ students });
				} else {
					res.status(StatusCodes.NOT_FOUND).json();
				}
			})
			.catch(() => {
				next('Internal Server Error, contact developer');
			});
	};

	show = async (req: Request, res: Response, next: NextFunction) => {
		const studentId = +req.params.id ? +req.params.id : null;

		if (!studentId) {
			res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				errors: {
					parameters: ['invalid id'],
				},
			});
			next();
		}
		const manager = getManager().getRepository('Student');

		try {
			const student = await manager.findOne({ where: { id: studentId } });

			if (student) {
				res.status(StatusCodes.OK).json({ student });
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					status: StatusCodes.NOT_FOUND,
					errors: { student: ['entity not found'] },
				});
			}
		} catch (e) {
			next('Internal Server Error, contact developer');
		}
	};

	create = async (req: Request, res: Response, next: NextFunction) => {
		const data: Student = plainToClass(Student, req.body, { excludeExtraneousValues: true });

		try {
			const errors = await this.student_validator(data);

			if (Object.entries(errors).length > 0) {
				res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, errors: errors });
			} else {
				const manager = getManager();
				await manager.save(data);
				res.status(StatusCodes.CREATED).json({ status: StatusCodes.CREATED });
			}
		} catch (e) {
			next('Internal Server Error, contact developer');
		}
	};

	update = async (req: Request, res: Response, next: NextFunction) => {
		const studentId = +req.params.id ? +req.params.id : null;

		if (!studentId) {
			res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				errors: {
					parameters: ['invalid id'],
				},
			});
			next();
		}

		const manager = getManager().getRepository('Student');

		try {
			let entity = (await manager.findOne({ where: { id: studentId } })) as Student;

			if (!entity) {
				res.status(StatusCodes.NOT_FOUND).json({
					status: StatusCodes.NOT_FOUND,
					errors: { student: ['entity not found'] },
				});
				next();
			}

			const data: Student = plainToClass(Student, req.body, { excludeExtraneousValues: true });

			Object.entries(data).forEach((entry) => {
				let [key, value] = entry;
				entity[key] = value != undefined ? value : entity[key];
			});

			const errors = (await this.student_validator(entity)) as Record<string, any>;

			if (Object.entries(errors).length > 0) {
				res.status(StatusCodes.BAD_REQUEST).json({
					status: StatusCodes.BAD_REQUEST,
					errors: errors,
				});
			} else {
				await manager.save(entity);
				res.status(StatusCodes.OK).json({ status: StatusCodes.OK });
			}
		} catch (e) {
			next('Internal Server Error, contact developer');
		}
	};

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const studentId = +req.params.id ? +req.params.id : null;

		if (!studentId) {
			res.status(StatusCodes.BAD_REQUEST).json({
				status: StatusCodes.BAD_REQUEST,
				errors: {
					parameters: ['invalid id'],
				},
			});
			next();
		}

		const manager = getManager().getRepository('Student');

		try {
			let entity = (await manager.findOne({ where: { id: studentId } })) as Student;

			if (!entity) {
				res.status(StatusCodes.NOT_FOUND).json({
					status: StatusCodes.NOT_FOUND,
					errors: { student: ['entity not found'] },
				});
				next();
			}

			await manager.delete(entity);
			res.status(StatusCodes.OK).json({ status: StatusCodes.OK });
		} catch (e) {
			next('Internal Server Error, contact developer');
		}
	};

	private async student_validator(student: Student): Promise<Record<string, any>> {
		const errors = await validate(student);
		let formated: Record<string, any> = {};

		if (errors.length > 0) {
			errors.forEach((el) => {
				formated[el.property] = Object.values(el.constraints).map((x) => {
					return x.slice(el.property.length + 1);
				});
			});
		}

		return formated;
	}
}

export default StudentController;
