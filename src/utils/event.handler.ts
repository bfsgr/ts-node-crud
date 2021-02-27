import { StatusCodes } from 'http-status-codes';

class EventHandler {
	static init(): Array<any> {
		return [this.error, this.notFound];
	}

	private static notFound(req, res, next): any {
		res.status(StatusCodes.NOT_FOUND).json({
			status: StatusCodes.NOT_FOUND,
			error: `Cannot ${req.method} ${req.path}`,
		});
	}

	private static error(err, req, res, next): any {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: StatusCodes.INTERNAL_SERVER_ERROR,
			error: `${err}`,
		});
	}
}

export default EventHandler;
