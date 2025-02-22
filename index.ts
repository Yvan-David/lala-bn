import express, { Application, Request, Response } from 'express'
import http from 'http'
import bodyParser from 'body-parser'
// import localtunnel from "localtunnel"
// import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
// import swaggerUi from 'swagger-ui-express'
// import 'express-async-errors'
// import specs from './src/utils/swagger'
import userRoute from './src/routes/userRoutes'
import { PORT } from './src/config'
//import passport from './src/config/passport'
import { sequelize } from './src/database/models/index';
import passport from 'passport'
// import { ErrorHandler, notFoundHandler } from './src/utils/errorHandler'
import listingRoutes from './src/routes/listingRoutes'
import bookingRoutes from './src/routes/bookingRoutes'

dotenv.config()

const app: Application = express()

app.use(passport.initialize())

// app.use(passport.initialize())
// // Serve Swagger UI
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// app.use(cors({ credentials: true }))
app.use(compression())
app.use(bodyParser.json())
app.use(express.static('public'))
// Routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to LALA' })
})

app.use('/users', userRoute)
app.use('/listing', listingRoutes)
app.use('/booking', bookingRoutes)
// app.use(notFoundHandler)

// app.use(ErrorHandler)


const server = http.createServer(app)


server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('server started');
    console.log(`Database Connection status: Success\nRunning Port: ${PORT}`);
  } catch (e) {
    console.log(e);
  }
});

export { app, server }
