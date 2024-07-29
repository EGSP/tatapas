import { building } from "$app/environment";
import { prepare_database } from "$lib/code/db.server";
import { get_lucia, prepare_lucia } from "$lib/code/lucia.server";
import { Logbox, logger } from "$lib/code/utilities/logging";

async function ini(){
    if(!building){
        await prepare_database()
        await prepare_lucia()
    }
}

ini()

export async function handle({ event, resolve }) {
    const logbox = new Logbox()
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

    logbox.slog("User session from cookies:\n" + JSON.stringify(session));

    if(!session){
        const sessionCoockie = lucia.createBlankSessionCookie();
        event.cookies.set(sessionCoockie.name, sessionCoockie.value, {
            path:"/",
            ...sessionCoockie.attributes
        })
    }

    event.locals.user = user;
    event.locals.session = session;

    event.locals.logbox_ = logbox

    return resolve(event);
}