import { Ok, Err, Result } from "ts-results"
import { db } from "../db.server"

export async function register_user(nickname: string, password: string):
    Promise<Result<void, string[]>> {

    let users = db.collection("users")

    let user = await users.findOne({ name: nickname })
    if (user == null) {
        let fault_checks: string[] = []
        // check values
        if (!nickname) {
            fault_checks.push("nickname is empty")
        }

        if (!password) {
            fault_checks.push("password is empty")
        }

        if (fault_checks.length > 0) {
            return Err(fault_checks)
        }

        users.insertOne({ name: nickname, password: password, role: "user" }).catch(console.dir)

        return Ok(undefined);
    } else {
        return Err(["user already exists"])
    }

}