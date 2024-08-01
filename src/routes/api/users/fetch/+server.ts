import { get_db } from "$lib/code/db.server";
import { bad, mes, ok, type User } from "$lib/code/db/types";
import { logger, print_logbox } from "$lib/code/utilities/logging";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent): Promise<Response> {
    const logbox = event.locals.logbox_
    const session = event.locals.session;

    if (session == null) {
        logbox.print()
        return json(bad(mes("Session not found","Please log in","info")))
    }

    const users = get_db().collection<{ _id: string }>("users")

    logbox.slog("Fetching user with id: " + session.userId + " length of " + session.userId.length)
    const user = await users.findOne({ _id: session.userId },
        { projection: { password: 0 } }
    ) as User
    if (user == null) {
        logbox.print()
        return json(bad(mes("Not found","User associated with session not found")))
    } else {

        logbox.slog("Fetched user found: " + `${JSON.stringify(user)}`)
    }

    logbox.print()
    return json(ok(user))
}