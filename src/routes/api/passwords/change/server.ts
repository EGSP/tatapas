import { get_db } from "$lib/code/db.server";
import { bad, mes, ok } from "$lib/code/types";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent): Promise<Response> {
    const logbox = event.locals.logbox_
    const session = event.locals.session;

    if (session == null) {
        logbox.print()
        return json(bad(mes("Session not found","Please log in","info")))
    }

    const {usecase, password} = await event.request.json();
    const passwords = get_db().collection("passwords");

    // check if same password with same usecase exists
    logbox.slog("Checking if password exists")
    const password_in_db = await passwords.findOne({owner_id: session.userId , usecase: usecase }, { projection: { value: 0 } });

    if (password_in_db == null) {
        logbox.slog(`Password for usecase ${ usecase } not found`)
        logbox.print()
        return json(bad(mes("Password not found","Password for this usecase not found","warning")))
    }else{

        logbox.slog("Changing password: "+ password + "for usecase: " + usecase)
        const document_info = await passwords.updateOne({owner_id: session.userId , usecase: usecase }, { $set: { value: password } });
        logbox.slog("Password changed");
        logbox.print() 
        return json(ok({usecase: usecase}))
    }
}