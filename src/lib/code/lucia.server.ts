import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { db, get_db } from "./db.server";
import type { Collection } from "mongodb";
import { Lucia } from "lucia";

let adapter: MongodbAdapter;
let lucia: Lucia;

export function prepare_lucia() {
    const _db = get_db();

    const users = _db.collection("users") as Collection<UserDocumentScheme>;
    const sessions = _db.collection("sessions") as Collection<SessionDocumentScheme>;

    adapter = new MongodbAdapter(sessions, users);

    lucia = new Lucia(adapter,
        {
            sessionCookie: {
                attributes: {
                    secure: false
                }
            },
        }
    );
}

export function get_lucia() {
    if (!lucia) {
        prepare_lucia();
    }

    return lucia;
}

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
    }
}

interface UserDocumentScheme {
    _id: string;
}


interface SessionDocumentScheme {
    _id: string;
    user_id: string;
    expires_at: Date;
}