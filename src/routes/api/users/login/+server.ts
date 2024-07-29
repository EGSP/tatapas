import { get_db } from "$lib/code/db.server";
import { bad, ok } from "$lib/code/db/types";
import { get_lucia } from "$lib/code/lucia.server";
import { logger, print_logbox } from "$lib/code/utilities/logging";
import type { RequestEvent } from "@sveltejs/kit";
import { json } from '@sveltejs/kit';
import { Ok } from "ts-results-es";

export async function POST(event: RequestEvent):Promise<Response>{
    const logbox = event.locals.logbox_
    const request = event.request;
    const { nickname, password } = await request.json()

    logbox.slog("Trying to find user: " + nickname)
    const users = get_db().collection("users")
    const user = await users.findOne({name: nickname})

    if (user == null) {
        logbox.slog("User logged with incorrect nickname")
        logbox.print()
        return json(bad("incorrect nickname or password"))
    }

    if(password != user.password) {
        logbox.slog("User logged with incorrect password")
        logbox.print()
        return json(bad("incorrect nickname or password"))
    }

    // TODO: invalidate or delete old sessions

    const lucia = get_lucia();
    const session = await lucia.createSession(user._id.toString(),{});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path:"/",
        ...sessionCookie.attributes
    });

    logbox.slog("User logged in")

    event.cookies.set("keep_cookie_test","true", {path:"/"})


    logbox.print()
    return json(ok({nickname: user.name, role: user.role}));
}