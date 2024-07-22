import { Ok, Err, Result } from "ts-results-es"
import { db } from "$lib/code/db.server"
import { json } from '@sveltejs/kit';
import type { RequestEvent } from "./$types";

export async function POST(event: RequestEvent):Promise<Response>{

    const request = event.request;
    // console.log(request)
    const { nickname, password } = await request.json()

    // Promise<Result<void, string[]>> 
    let users = db.collection("users")

    console.log("find user: " + nickname)
    let user = await users.findOne({ name: nickname })
    console.log("founded user: "+ user)
    if (user == null) {
        console.log("fault checks")
        console.log(`Nickname: ${ nickname } Password: ${ password }`)
        let fault_checks: string[] = []
        // check values
        if (!nickname) {
            fault_checks.push("nickname is empty")
        }

        if (!password) {
            fault_checks.push("password is empty")
        }

        if (fault_checks.length > 0) {
            return json(Err(fault_checks))
        }

        console.log("insert user: " + nickname)
        users.insertOne({ name: nickname, password: password, role: "user" }).catch(console.dir)

        return json(Ok(undefined));
    } else {
        console.log("user already exists")
        return json(Err(["user already exists"]))
    }

}