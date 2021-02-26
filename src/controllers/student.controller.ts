import { Student } from '../entity/student.entity'
import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from 'interfaces/IControllerBase.interface'
import { getManager } from 'typeorm'

class StudentController implements IControllerBase {
    public path = '/'
    public router = express.Router()

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/student', this.index)
    }

    index = (req: Request, res: Response) => {
        res.status(200).json({status: 200})
    }
}

export default StudentController
