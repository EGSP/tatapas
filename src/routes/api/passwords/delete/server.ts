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

    const {usecase} = await event.request.json();
    const passwords = get_db().collection("passwords");

    // check if password with same usecase exists
    logbox.slog("Checking if password exists")
    const document_info = await passwords.deleteOne({owner_id: session.userId , usecase: usecase });

    if (document_info.deletedCount == 0) {
        logbox.slog(`Password for usecase ${ usecase } not found`)
        logbox.print()
        return json(bad(mes("Password not found","Password for this usecase not found","warning")))
    }else{
        logbox.slog("Password deleted");
        logbox.print() 
        return json(ok({usecase: usecase}))
    }
}