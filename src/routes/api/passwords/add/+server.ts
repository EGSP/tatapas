import { get_db } from "$lib/code/db.server";
import { bad, mes, ok, type Password } from "$lib/code/types";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent): Promise<Response> {
    const logbox = event.locals.logbox_;
    const session = event.locals.session;

    if (session == null) {
        logbox.print()
        return json(bad(mes("Session not found","Please log in","info")))
    }

    const {password, usecase} = await event.request.json();
    const passwords = get_db().collection("passwords");

    // check if same password with same usecase exists
    logbox.slog("Checking if password already exists")
    const password_in_db = await passwords.findOne({owner_id: session.userId , usecase: usecase }, { projection: { value: 0 } });

    if (password_in_db != null) {
        logbox.slog(`Password for usecase ${ usecase } already exists`)
        logbox.print()
        return json(bad(mes("Password already exists","Password for this usecase already exists","warning")))
    }else{

        logbox.slog("Adding password: "+ password + "for usecase: " + usecase)
        const document_info = await passwords.insertOne({
            owner_id: session.userId,
            value: password,
            usecase: usecase
        });

        logbox.slog("Password added");
        logbox.print() 
        return json(ok({usecase: usecase}))
    }
}