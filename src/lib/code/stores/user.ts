import { writable } from "svelte/store";
import {  type Result, type User } from "../db/types";
import type { Logbox } from "../utilities/logging";

export const user_store = create_user_store()

function create_user_store() {
    const { subscribe, set, update } = writable<User | null>(null);

    return {
        subscribe,
        logged_in: (new_user: User) => update(user => new_user),
        logged_out: () => update(user => null),
    }
}

export async function user_fetch(logbox_: Logbox): Promise<Result<User>> {
    const logbox = logbox_.from()
    logbox.plog("Fetching user to get authenticated")

    const fetch_response = await fetch('/api/users/fetch', {
        method: 'POST'
    });
    const result = (await fetch_response.json()) as Result<User>;

    if (result.value != null) {
        logbox.plog("Fetch succeeded: " + JSON.stringify(result))
        return result;
    } else {
        logbox.plog("Fetch failed: " + JSON.stringify(result))
        return result;
    }
}

export async function user_login(logbox_: Logbox, name_: string, password_: string): Promise<Result<User>> {
    const logbox = logbox_.from()
    logbox.plog("Authenticating user with name: " + name_ + " and password: " + password_)
    
    const fetch_response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name_,
            password: password_
        })
    });

    const result = (await fetch_response.json()) as Result<User>;
    if (result.value != null) {
        logbox.plog("Authentication succeeded: " + JSON.stringify(result))
        return result;
    } else {
        logbox.plog("Authentication failed: " + JSON.stringify(result))
        return result;
    }
}

export async function user_register(logbox_: Logbox, name_: string, password_: string): Promise<Result<User>> {
    const logbox = logbox_.from()
    logbox.plog("Registering user")
    
    const fetch_response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name_,
            password: password_
        })
    });

    const result = (await fetch_response.json()) as Result<User>;
    if ( result.value != null ) {
        logbox.plog("Registration succeeded: " + JSON.stringify(result))
        return result;
    } else {
        logbox.plog("Registration failed: " + JSON.stringify(result))
        return result;
    }
}