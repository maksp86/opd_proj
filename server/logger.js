const winston = require("winston")
const fs = require("fs")
const path = require("path")
require('winston-daily-rotate-file');


let dest = path.join(__dirname, "logs");
if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
}


const logFileFormat = winston.format.combine(
    winston.format.timestamp({}),
    winston.format.splat(),
    winston.format.json()
)

const excludeErrorLevel = winston.format((info) => (info.level === 'error') ? false : info);

winston.add(new winston.transports.DailyRotateFile({
    filename: path.join(dest, 'error-%DATE%.log'),
    datePattern: 'DD-MM-YYYY',
    maxFiles: '14d',
    maxSize: '100m',
    level: 'error',
    format: logFileFormat
}));

winston.add(new winston.transports.DailyRotateFile({
    filename: path.join(dest, 'info-%DATE%.log'),
    datePattern: 'DD-MM-YYYY',
    maxFiles: '14d',
    maxSize: '100m',
    level: 'info',
    format: winston.format.combine(excludeErrorLevel(), logFileFormat)
}));

if (process.env.NODE_ENV !== 'prod') {
    const consoleFormat = winston.format.printf((info) => {
        return `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`;
    });
    winston.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.splat(),
            consoleFormat,
            winston.format.colorize({all: true})
        ),
        level: "debug"
    }));
}


module.exports = winston;