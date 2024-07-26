import { get_db } from "$lib/code/db.server";
import { bad, ok, type User } from "$lib/code/db/types";
import { logger } from "$lib/code/utilities/logging";
import { json, type RequestEvent } from "@sveltejs/kit";
import { ObjectId } from "mongodb";

export async function POST(event: RequestEvent):Promise<Response> {
    const session = event.locals.session;

    if(session == null){
        return json(bad("user not logged in"))
    }

    const users = get_db().collection<{_id:string}>("users")

    logger.slog("Fetching user with id: " + session.userId + " length of "+ session.userId.length)
    const user = await users.findOne({ _id: session.userId}) as User
    if(user == null){
        
        return json(bad("user not found"))
    }else{
        
        logger.slog("Fetched user found: " +`${JSON.stringify(user)}`)
        logger.slog("Fetched user name: " +`${user.name}`)
        logger.slog("Fetched user id: " +`${user._id}`)
        logger.slog("Fetched user password: " +`${user.password}`)
        logger.slog("Fetched user role: " +`${user.role}`)
    }
    return json(ok(user))
}