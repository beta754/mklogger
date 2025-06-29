import * as winston from "winston"
import { ElasticsearchTransport } from "winston-elasticsearch"

export type Logger = ReturnType<typeof winston["createLogger"]>;

export function mkLogger(app?: string, env?: string): Logger
export function mkLogger(app: string, env: string, cloudId: string, username: string, password: string, minLevel?: "debug" | "info" | "warn" | "error"): Logger
export function mkLogger(app?: string, env?: string, cloudId?: string, username?: string, password?: string, minLevel?: string): Logger {

  const index = `logs-${env}-${app}`
  return winston.createLogger({
    level: minLevel || 'info',
    format: winston.format.simple(),
    defaultMeta: {
      app,
      env
    },
    transports: [
      new winston.transports.Console({
        format: winston.format.colorize(),
      }),
      cloudId && new ElasticsearchTransport({
        index,
        format: winston.format.json(),
        indexSuffixPattern: "YYYY.MM.DD",
        dataStream: true,
        clientOpts: {
          cloud: {
            id: cloudId
          },
          auth: {
            username: username,
            password: password
          }
        }
      })
    ].filter(Boolean),
  })
}
