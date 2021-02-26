import * as express from 'express'
import { Application } from 'express'
import { createConnection } from 'typeorm'

class App {
    public app: Application
    public host: string
    public port: number

    constructor(appInit: { host: string, port: number; middleWares: any; controllers: any; }) {
        this.app = express()
        this.host = appInit.host
        this.port = appInit.port

        this.middlewares(appInit.middleWares)
        this.routes(appInit.controllers)
    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare)
        })
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router)
        })
    }

    public listen() {
        createConnection().then( () => {
            this.app.listen(this.port, this.host, () => {
                console.log(`Listening on http://localhost:${this.port}`)
            })
        }).catch( error => console.log("Error: " + error))
    }
}

export default App
