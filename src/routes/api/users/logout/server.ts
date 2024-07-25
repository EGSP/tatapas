import { bad, ok } from "$lib/code/db/types";
import { get_lucia } from "$lib/code/lucia.server";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent):Promise<Response>{
    const session = event.locals.session;

    if(session == null){
        return json(ok("session already closed"))
    }

    const lucia = get_lucia();
    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path:".",
        ...sessionCookie.attributes
    });

    return json(ok("session closed"))
}