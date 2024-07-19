import { Db, MongoClient } from "mongodb"
import { DATABASE_URL } from "$env/static/private"
import { DATABASE_NAME } from "$env/static/private"

console.log("DATABASE_URL: " + DATABASE_URL)

const mongo = new MongoClient(DATABASE_URL!)
export let db: Db = mongo.db(DATABASE_NAME)

test_connection().catch(console.dir)

async function test_connection() {
    try {
        await mongo.connect()

        // send a ping to confirm a successful connection
        await mongo.db(DATABASE_NAME).command({ ping: 1 })

    } finally {
        await mongo.close()
    }
}

export async function prepare_database() {
    let users = db.collection("users")

    let admin = await users.findOne({ name: "admin" })
    if (admin == null) {
        await users.insertOne({ name: "admin", password: "admin", role: "admin" }).catch(console.dir)
        console.log("admin user created")
    }else{
        console.log("admin user already exists")
    }
}

