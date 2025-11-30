import { createServer, Server } from 'http'
import app from './app'
import mongoose from 'mongoose'
import config from './app/config'
import { errorlogger, logger } from './app/utils/logger'
import { seeder } from './app/seeder/seed'
import initializeSocketIO from './socket'

let server: Server
export const io = initializeSocketIO(createServer(app))

async function main() {
  try {
    await mongoose.connect(config.database_url as string)

    logger.info('Connected to database')

    // default task added
    seeder.seedAdmin()
    seeder.seedContents()

    server = app.listen(Number(config.port), config.ip as string, () => {
      console.log((`🚀 App is listening on port ${config.port}`),
      )
      logger.info(`App is listening on port ${config.port}`)

      io.listen(Number(config.socket_port))
      console.log(`Socket is listening on port ${config.socket_port}`)
      logger.info(`Socket is listening on port ${config.socket_port}`)

      //@ts-ignore
      global.socketio = io
    })
  } catch (err) {
    console.log(('❌ Error while connecting to the database:'))
    console.log((err))
    errorlogger.error(err)
  }
}

main()

process.on('unhandledRejection', (err) => {
  console.log((`😈 Unhandled rejection detected, shutting down...`))
  errorlogger.error(err)
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('uncaughtException', () => {
  console.log((`😈 Uncaught exception detected, shutting down...`))
  errorlogger.error('uncaughtException is detected')
  process.exit(1)
})
