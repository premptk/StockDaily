import winston, { format, Logger } from "winston";

const logger: Logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf((info) => {
      const { timestamp, level, message } = info;
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "app.log" }),
  ],
});

export default logger;
