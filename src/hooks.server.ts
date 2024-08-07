import { building } from "$app/environment";
import { prepare_api } from "$lib/code/api/api";
import { prepare_database } from "$lib/code/db.server";
import { get_lucia, prepare_lucia } from "$lib/code/lucia.server";
import { prepare_pulse } from "$lib/code/pulse.server";
import { Logbox, logger } from "$lib/code/utilities/logging";
import chalk from "chalk";

async function ini(){
    if(!building){
        await prepare_database()
        await prepare_lucia()
        await prepare_pulse()
        await prepare_api()
    }
}

ini()

export async function handle({ event, resolve }) {
    const logbox = new Logbox();
    event.locals.logbox_ = logbox;

    // log current time
    logbox.slog( chalk.blueBright(`::: ${new Date().toLocaleString()}`) );
    // logbox.add(chalk.blueBright(":::handle"), "");
    const lucia = get_lucia();

    const session_id = event.cookies.get(lucia.sessionCookieName);
    if(!session_id){
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    const {session, user} = await lucia.validateSession(session_id);
    if(session && session.fresh){
        const sessionCoockie = lucia.createSessionCookie(session.id);

        event.cookies.set(sessionCoockie.name, sessionCoockie.value, {
            path:"/",
            ...sessionCoockie.attributes
        });
    }

    // logbox.slog("Got user session:\n" + JSON.stringify(session));

    if(!session){
        const sessionCoockie = lucia.createBlankSessionCookie();
        event.cookies.set(sessionCoockie.name, sessionCoockie.value, {
            path:"/",
            ...sessionCoockie.attributes
        })
    }

    event.locals.user = user;
    event.locals.session = session;
    
    return resolve(event);
}