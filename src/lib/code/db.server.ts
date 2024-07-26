import { Db, MongoClient } from "mongodb"
import { DATABASE_URL } from "$env/static/private"
import { DATABASE_NAME } from "$env/static/private"
import chalk from "chalk";
import { generateId, generateIdFromEntropySize } from "lucia";

console.log("DATABASE_URL: " + DATABASE_URL)

let mongo:MongoClient;
export let db: Db;


function create_client(){
    mongo = new MongoClient(DATABASE_URL!,{
        pkFactory: {
            createPk:()=> generateId(24)
        }
    })
    db = mongo.db(DATABASE_NAME)
}

async function test_connection() {
    dlog("test connection")
    create_client()
    try {
        await mongo.connect()

        // send a ping to confirm a successful connection
        await mongo.db(DATABASE_NAME).command({ ping: 1 })

    } finally {
        await mongo.close()
    }

    dlog("connection tested")
}

export async function prepare_database() {
    await test_connection().catch(console.dir)


    dlog("prepare database")
    create_client()
    mongo.connect()

    await seed_database();
    dlog("database prepared")
}

export function get_db() {
    if (!db) {
        prepare_database()
    }
    return db
}


async function seed_database(){
    let users = db.collection("users")

    let admin = await users.findOne({ name: "admin" })
    if (admin == null) {
        await users.insertOne({ name: "admin", password: "admin", role: "admin" }).catch(console.dir)
        dlog("admin user created")
    }else{
        dlog("admin user already exists")
    }
}


export function dlog(message: string) {
    const prefix = chalk.bgGreenBright.black("[DB]")
    console.log(prefix,":", message)
}