import type { User } from "lucia";
import { writable } from "svelte/store";

function create_user_store(){
    const { subscribe, set, update } = writable<User | null>(null);

    return {
        subscribe,
        login: (new_user: User) => update(user => new_user),
        logout: () => update(user => null),
    }
}