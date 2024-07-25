import { get_db } from "$lib/code/db.server";
import { bad, ok } from "$lib/code/db/types";
import { get_lucia } from "$lib/code/lucia.server";
import { logger } from "$lib/code/utilities/logging";
import type { RequestEvent } from "@sveltejs/kit";
import { json } from '@sveltejs/kit';
import { Ok } from "ts-results-es";

export async function POST(event: RequestEvent):Promise<Response>{
    const request = event.request;
    const { nickname, password } = await request.json()

    logger.slog("Trying to find user: " + nickname)
    const users = get_db().collection("users")
    const user = await users.findOne({name: nickname})

    if (user == null) {
        logger.slog("User logged with incorrect nickname")
        return json(bad("incorrect nickname or password"))
    }

    if(password != user.password) {
        logger.slog("User logged with incorrect password")
        return json(bad("incorrect nickname or password"))
    }

    const lucia = get_lucia();
    const session = await lucia.createSession(user._id.toString(),{});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path:".",
        ...sessionCookie.attributes
    });

    logger.slog("User logged in")
    return json(ok({nickname: user.name, role: user.role}));
}