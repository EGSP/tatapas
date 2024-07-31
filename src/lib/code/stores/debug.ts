import { writable } from "svelte/store";

export const debug_store = writable<boolean|undefined>(undefined)