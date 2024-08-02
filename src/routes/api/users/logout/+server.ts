import { bad, ok } from "$lib/code/types";
import { get_lucia } from "$lib/code/lucia.server";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent):Promise<Response>{
    const logbox = event.locals.logbox_
    const session = event.locals.session;

    if(session == null){
        return json(ok("session already closed"))
    }

    logbox.slog("Trying to close session with user id: " + session.userId)

    const lucia = get_lucia();
    logbox.slog("Invalidating user sessions")
    await lucia.invalidateUserSessions(session.userId);

    logbox.slog("Creating new blank session cookie")
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path:"/",
        ...sessionCookie.attributes
    });

    logbox.slog("User logged out")
    logbox.print()
    return json(ok("session closed"))
}