const winston = require("winston")

const logFileFormat = winston.format.combine(
    winston.format.timestamp({}),
    winston.format.json()
)

const excludeErrorLevel = winston.format((info) => (info.level === 'error') ? false : info);

winston.add(new winston.transports.File({ filename: 'error.log', level: 'error', format: logFileFormat }));
winston.add(new winston.transports.File({ filename: 'info.log', format: winston.format.combine(excludeErrorLevel(), logFileFormat) }));

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
            consoleFormat
        ),
        level: "debug"
    }));
}


module.exports = winston;