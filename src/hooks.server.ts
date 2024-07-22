import { building } from "$app/environment";
import { prepare_database } from "$lib/code/db.server";
import { get_lucia, prepare_lucia } from "$lib/code/lucia.server";

async function ini(){
    if(!building){
        await prepare_database()
        await prepare_lucia()
    }
}

ini()

export async function handle({ event, resolve }) {
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
            path:".",
            ...sessionCoockie.attributes
        });
    }

    if(!session){
        const sessionCoockie = lucia.createBlankSessionCookie();
        event.cookies.set(sessionCoockie.name, sessionCoockie.value, {
            path:".",
            ...sessionCoockie.attributes
        })
    }

    event.locals.user = user;
    event.locals.session = session;

    return resolve(event);
}