import { get_db } from "$lib/code/db.server";
import { bad, ok } from "$lib/code/db/types";
import { json, type RequestEvent } from "@sveltejs/kit";
import { ObjectId } from "mongodb";

export async function POST(event: RequestEvent):Promise<Response> {
    const session = event.locals.session;

    if(session == null){
        return json(bad("user not logged in"))
    }

    const users = get_db().collection("users")

    const user = await users.findOne({ _id: new ObjectId(session.userId) })
    return json(ok(user))
}