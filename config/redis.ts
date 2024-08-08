import { Redis } from "ioredis";

const redis = new Redis({
    port: parseInt(process.env.REDIS_PORT as string),
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: 0
}) 

redis.on('connect', () => {
    console.log('Connected to redis')
})
redis.on('error',(error) => {
    console.log('Redis error', error)
})

export default redis