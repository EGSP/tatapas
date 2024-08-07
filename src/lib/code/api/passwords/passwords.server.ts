import { get_db } from "$lib/code/db.server";
import { bad, mes, ok } from "$lib/code/types";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function PASSWORDS_ADD(object:any, event: RequestEvent): Promise<Response> {
    const logbox = event.locals.logbox_.from();
    const session = event.locals.session;

    if (session == null) {
        logbox.slog("Session not found")
        return json(bad(mes("Session not found","Please log in","info")))
    }

    const {password, usecase} = object;
    const passwords = get_db().collection("passwords");

    // check if same password with same usecase exists
    logbox.slog("Checking if password already exists")
    const password_in_db = await passwords.findOne({owner_id: session.userId , usecase: usecase }, { projection: { value: 0 } });

    if (password_in_db != null) {
        logbox.slog(`Password for usecase ${ usecase } already exists`)
        
        return json(bad(mes("Password already exists","Password for this usecase already exists","warning")))
    }else{

        logbox.slog("Adding password: "+ password + "for usecase: " + usecase)
        const document_info = await passwords.insertOne({
            owner_id: session.userId,
            value: password,
            usecase: usecase
        });

        logbox.slog("Password added");
         
        return json(ok({usecase: usecase}))
    }
}

export async function PASSWORDS_CHANGE(object:any, event: RequestEvent): Promise<Response> {
    const logbox = event.locals.logbox_.from()
    const session = event.locals.session;

    if (session == null) {
        logbox.slog("Session not found")
        return json(bad(mes("Session not found","Please log in","info")))
    }

    const {usecase, password} = object;
    const passwords = get_db().collection("passwords");

    // check if same password with same usecase exists
    logbox.slog("Checking if password exists")
    const password_in_db = await passwords.findOne({owner_id: session.userId , usecase: usecase }, { projection: { value: 0 } });

    if (password_in_db == null) {
        logbox.slog(`Password for usecase ${ usecase } not found`)
        
        return json(bad(mes("Password not found","Password for this usecase not found","warning")))
    }else{

        logbox.slog("Changing password: "+ password + "for usecase: " + usecase)
        const document_info = await passwords.updateOne({owner_id: session.userId , usecase: usecase }, { $set: { value: password } });
        logbox.slog("Password changed");
         
        return json(ok({usecase: usecase}))
    }
}

export async function PASSWORDS_DELETE(object:any, event: RequestEvent): Promise<Response> {
    const logbox = event.locals.logbox_.from()
    const session = event.locals.session;

    if (session == null) {
        logbox.slog("Session not found")
        return json(bad(mes("Session not found","Please log in","info")))
    }

    const {usecase, password} = object;
    const passwords = get_db().collection("passwords");

    // check if same password with same usecase exists
    logbox.slog("Checking if password exists")
    const password_in_db = await passwords.findOne({owner_id: session.userId , usecase: usecase }, { projection: { value: 0 } });

    if (password_in_db == null) {
        logbox.slog(`Password for usecase ${ usecase } not found`)
        
        return json(bad(mes("Password not found","Password for this usecase not found","warning")))
    }else{

        logbox.slog("Changing password: "+ password + "for usecase: " + usecase)
        const document_info = await passwords.updateOne({owner_id: session.userId , usecase: usecase }, { $set: { value: password } });
        logbox.slog("Password changed");
         
        return json(ok({usecase: usecase}))
    }
}