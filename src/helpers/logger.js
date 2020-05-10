import { LogglyTracker } from 'loggly-jslogger'

const logger = new LogglyTracker()

logger.push({ 'logglyKey': '13e3cd5b-34e9-4df3-b46f-27a4bf1ceac7' })

export default logger