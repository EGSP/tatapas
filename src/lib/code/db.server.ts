import { Db, MongoClient } from "mongodb"
import { DATABASE_URL } from "$env/static/private"
import { DATABASE_NAME } from "$env/static/private"

console.log("DATABASE_URL: " + DATABASE_URL)

let mongo:MongoClient;
export let db: Db;


function create_client(){
    mongo = new MongoClient(DATABASE_URL!)
    db = mongo.db(DATABASE_NAME)
}

async function test_connection() {
    console.log("test connection")
    create_client()
    try {
        await mongo.connect()

        // send a ping to confirm a successful connection
        await mongo.db(DATABASE_NAME).command({ ping: 1 })

    } finally {
        await mongo.close()
    }

    console.log("connection tested")
}

export async function prepare_database() {
    await test_connection().catch(console.dir)


    console.log("prepare database")
    create_client()
    mongo.connect()

    await seed_database();
    console.log("database prepared")
}

export function get_db() {
    return db
}


async function seed_database(){
    let users = db.collection("users")

    let admin = await users.findOne({ name: "admin" })
    if (admin == null) {
        await users.insertOne({ name: "admin", password: "admin", role: "admin" }).catch(console.dir)
        console.log("admin user created")
    }else{
        console.log("admin user already exists")
    }
}
