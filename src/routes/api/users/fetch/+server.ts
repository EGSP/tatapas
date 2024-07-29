import { get_db } from "$lib/code/db.server";
import { bad, ok, type User } from "$lib/code/db/types";
import { logger, print_logbox } from "$lib/code/utilities/logging";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent): Promise<Response> {
    const logbox = event.locals.logbox_
    const session = event.locals.session;

    if (session == null) {
        logbox.print()
        return json(bad("user not logged in"))
    }

    const users = get_db().collection<{ _id: string }>("users")

    logbox.slog("Fetching user with id: " + session.userId + " length of " + session.userId.length)
    const user = await users.findOne({ _id: session.userId },
        { projection: { password: 0 } }
    ) as User
    if (user == null) {
        logbox.print()
        return json(bad("user not found"))
    } else {

        logbox.slog("Fetched user found: " + `${JSON.stringify(user)}`)
        // logger.slog("Fetched user name: " +`${user.name}`)
        // logger.slog("Fetched user id: " +`${user._id}`)
        // logger.slog("Fetched user password: " +`${(user as any).password}`)
        // logger.slog("Fetched user role: " +`${user.role}`)
    }

    logbox.print()
    return json(ok(user))
}