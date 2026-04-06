import { MongoClient } from 'mongodb'
const url:string = process.env["MONGO_URL"]!

let connectDB: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
        _mongo: Promise<MongoClient>
    }
    if (!globalWithMongo._mongo) {
        globalWithMongo._mongo = new MongoClient(url).connect()
    }
    connectDB = globalWithMongo._mongo
} else {
    connectDB = new MongoClient(url).connect()
}
export { connectDB }