import { db, get_db } from "$lib/code/db.server"
import { json } from '@sveltejs/kit';
import type { RequestEvent } from "./$types";
import { logger } from "$lib/code/utilities/logging";
import { bad, bad_many, mes, ok, type Message } from "$lib/code/db/types";
import { get_lucia } from "$lib/code/lucia.server";

export async function POST(event: RequestEvent):Promise<Response>{

    const logbox = event.locals.logbox_
    const request = event.request;
    const { name, password } = await request.json()
    
    let users = get_db().collection("users")

    logbox.slog("Trying to find user: " + name)
    let user = await users.findOne({ name: name })
    if (user == null) {

        logbox.slog("User not found")
        logbox.slog(`User input data: name: ${ name } Password: ${ password }`)
        let fault_checks: Message[] = []
        // VALIDATION
        if (!name) {
            fault_checks.push(mes("Empty name","Name cannot be empty","warning"))
        }

        if (!password) {
            fault_checks.push(mes("Empty password","Password cannot be empty","warning"))
        }

        if (fault_checks.length > 0) {
            logbox.slog("Input fault: " + fault_checks)
            logbox.print()
            return json(bad_many(fault_checks))
        }

        // ADD to DB
        logbox.slog("Adding new user: " + name)
        const document_info = await users.insertOne({ name: name, password: password, role: "user" });
        logbox.slog("User document added: " + JSON.stringify(document_info))

        const added_user = await users.findOne({ _id: document_info.insertedId })

        // LUCIA
        const lucia = get_lucia();
        const session = await lucia.createSession(document_info.insertedId.toString(),{});
        const sessionCookie = lucia.createSessionCookie(session.id);

        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path:"/",
            ...sessionCookie.attributes
        });
        logbox.print()
        return json(ok({name: added_user?.name, role: added_user?.role}));
    } else {
        logbox.slog("User " + name + " already exists")
        logbox.print()
        return json(bad(mes("Register failed",`User with that name ${ name } already exists","warning`)))
    }
}