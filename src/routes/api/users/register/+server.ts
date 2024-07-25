import { db, get_db } from "$lib/code/db.server"
import { json } from '@sveltejs/kit';
import type { RequestEvent } from "./$types";
import { logger } from "$lib/code/utilities/logging";
import { bad, ok } from "$lib/code/db/types";
import { get_lucia } from "$lib/code/lucia.server";

export async function POST(event: RequestEvent):Promise<Response>{

    const request = event.request;
    const { nickname, password } = await request.json()
    
    let users = get_db().collection("users")

    logger.slog("Trying to find user: " + nickname)
    let user = await users.findOne({ name: nickname })
    if (user == null) {

        logger.slog("User not found")
        logger.slog(`User input data: Nickname: ${ nickname } Password: ${ password }`)
        let fault_checks: string[] = []
        // VALIDATION
        if (!nickname) {
            fault_checks.push("nickname is empty")
        }

        if (!password) {
            fault_checks.push("password is empty")
        }

        if (fault_checks.length > 0) {
            logger.slog("Input fault: " + fault_checks)
            return json(bad(fault_checks))
        }


        // ADD to DB
        logger.slog("Adding new user: " + nickname)
        const document_info = await users.insertOne({ name: nickname, password: password, role: "user" });
        logger.slog("User document added: " + JSON.stringify(document_info))

        const added_user = await users.findOne({ _id: document_info.insertedId })

        // LUCIA
        const lucia = get_lucia();
        const session = await lucia.createSession(document_info.insertedId.toString(),{});
        const sessionCookie = lucia.createSessionCookie(session.id);

        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path:"/",
            ...sessionCookie.attributes
        });

        return json(ok({nickname: added_user?.name, role: added_user?.role}));
    } else {
        logger.slog("User already exists")
        return json(bad(["user already exists"]))
    }
}