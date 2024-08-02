import { get_db } from "$lib/code/db.server";
import { bad, mes, ok } from "$lib/code/types";
import { get_lucia } from "$lib/code/lucia.server";
import { logger, print_logbox } from "$lib/code/utilities/logging";
import type { RequestEvent } from "@sveltejs/kit";
import { json } from '@sveltejs/kit';
import { Ok } from "ts-results-es";

export async function POST(event: RequestEvent):Promise<Response>{
    const logbox = event.locals.logbox_
    const request = event.request;
    const { name, password } = await request.json()

    logbox.slog("Trying to find user: " + name)
    const users = get_db().collection("users")
    const user = await users.findOne({name: name})

    if (user == null) {
        logbox.slog("User logged with incorrect name")
        logbox.print()
        return json(bad(mes("Login failed","User with that name or password not found","warning")))
    }

    if(password != user.password) {
        logbox.slog("User logged with incorrect password")
        logbox.print()
        return json(bad(mes("Login failed","User with that name or password not found","warning")))
    }

    const lucia = get_lucia();
    await lucia.invalidateUserSessions(user._id.toString());
    const session = await lucia.createSession(user._id.toString(),{});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path:"/",
        ...sessionCookie.attributes
    });

    logbox.slog("User logged in")

    event.cookies.set("keep_cookie_test","true", {path:"/"})


    logbox.print()
    return json(ok({name: user.name, role: user.role}));
}