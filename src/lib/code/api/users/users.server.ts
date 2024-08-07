import { get_db } from "$lib/code/db.server";
import { get_lucia } from "$lib/code/lucia.server";
import { bad, mes, ok, type Message } from "$lib/code/types";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function USERS_FETCH(object:any,event: RequestEvent): Promise<Response> {
    const logbox = event.locals.logbox_.from()
    const session = event.locals.session;

    if (session == null) {
        logbox.slog("Session not found")
        return json(bad(mes("Session not found","Please log in","info")))
    }

    const users = get_db().collection<{ _id: string }>("users")

    logbox.slog("Fetching user with id: " + session.userId + " length of " + session.userId.length)
    const user = await users.findOne({ _id: session.userId }, { projection: { password: 0 } } )
    if (user == null) {
        logbox.slog("User not found")
        return json(bad(mes("Not found","User associated with session not found")))
    } else {

        logbox.slog("Fetched user found: " + `${JSON.stringify(user)}`)
    }

    
    return json(ok(user))
}

export async function USERS_LOGIN(object:any,event: RequestEvent):Promise<Response>{
    const logbox = event.locals.logbox_.from();
    const { name, password } = object;

    logbox.slog("Trying to find user: " + name)
    const users = get_db().collection("users")
    const user = await users.findOne({name: name})

    if (user == null) {
        logbox.slog("User logged with incorrect name")
        return json(bad(mes("Login failed","User with that name or password not found","warning")))
    }

    if(password != user.password) {
        logbox.slog("User logged with incorrect password")
        return json(bad(mes("Login failed","User with that name or password not found","warning")))
    }

    const lucia = get_lucia();
    await lucia.invalidateUserSessions(user._id.toString());
    const session = await lucia.createSession(user._id.toString(),{});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path:"/",
        ...sessionCookie.attributes
    });

    logbox.slog("User logged in")
    event.cookies.set("keep_cookie_test","true", {path:"/"})

    return json(ok({name: user.name, role: user.role}));
}

export async function USERS_LOGOUT(object:any,event: RequestEvent):Promise<Response>{
    const logbox = event.locals.logbox_.from()
    const session = event.locals.session;

    if(session == null){
        logbox.slog("Session already closed")
        return json(ok("session already closed"))
    }

    logbox.slog("Trying to close session with user id: " + session.userId)

    const lucia = get_lucia();
    logbox.slog("Invalidating user sessions")
    await lucia.invalidateUserSessions(session.userId);

    logbox.slog("Creating new blank session cookie")
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path:"/",
        ...sessionCookie.attributes
    });

    logbox.slog("User logged out")
    
    return json(ok("session closed"))
}

export async function USERS_REGISTER(object:any,event: RequestEvent):Promise<Response>{

    const logbox = event.locals.logbox_.from()
    const { name, password } = object;
    
    let users = get_db().collection("users")

    logbox.slog("Trying to find user: " + name)
    let user = await users.findOne({ name: name })
    if (user == null) {

        logbox.slog("User not found")
        logbox.slog(`User input data: name: ${ name } Password: ${ password }`)
        let fault_messages: Message[] = []
        // VALIDATION
        if (!name) {
            fault_messages.push(mes("Empty name","Name cannot be empty","warning"))
        }

        if (!password) {
            fault_messages.push(mes("Empty password","Password cannot be empty","warning"))
        }

        if (fault_messages.length > 0) {
            logbox.slog("Input fults:\n" + JSON.stringify(fault_messages))
            
            return json(bad(...fault_messages))
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
        
        return json(ok({name: added_user?.name, role: added_user?.role}));
    } else {
        logbox.slog("User " + name + " already exists")
        
        return json(bad(mes("Register failed",`User with that name ${ name } already exists`,"warning")))
    }
}