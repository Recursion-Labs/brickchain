import winston, { format, transports } from "winston";
import { join } from "path";

const { combine, timestamp, printf, colorize } = format;

const loggerFormat = printf((info) => {
	return `${info.timestamp} ${info.level}: ${info.message}`;
});

export const logger = winston.createLogger({
	level: process.env.NODE_ENV === "production" ? "info" : "debug",
	format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), loggerFormat),
	transports: [
		new transports.Console(),
		new transports.File({
			filename: join("logs", "combined.log"),
		}),
		new transports.File({
			filename: join("logs", "error.log"),
			level: "error",
		}),
	],
});