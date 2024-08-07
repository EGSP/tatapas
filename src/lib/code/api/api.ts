import { json, type RequestEvent } from "@sveltejs/kit"
import { USERS_FETCH, USERS_LOGIN, USERS_LOGOUT, USERS_REGISTER } from "./users/users.server"
import { PASSWORDS_ADD, PASSWORDS_CHANGE, PASSWORDS_DELETE } from "./passwords/passwords.server"
import { bad, mes } from "../types"

export interface Argument {
    api: string,
    object: any
}

export type ApiFunction = (object: any, event: RequestEvent) => Promise<Response>

export interface ApiRoute {
    path: string,
    function: ApiFunction
}

const api = {
    routes: new Array<ApiRoute>(),

    add: (path: string, function_: ApiFunction) => {
        api.routes.push({
            path: path,
            function: function_
        })
    },

    add_routes: (...routes: ApiRoute[]) => {
        api.routes.push(...routes)
    },

    call: async (path: string, object: any, event: RequestEvent): Promise<Response> => {
        for (let i = 0; i < api.routes.length; i++) {
            if (api.routes[i].path == path) {
                // console.log(event)
                return await api.routes[i].function(object, event)
            }
        }
        return json(bad(mes("Not found", "Api route not found", "warning")))
    }
}

export function prepare_api() {
    api.add_routes(
        { path: "users/fetch", function: USERS_FETCH },
        { path: "users/login", function: USERS_LOGIN },
        { path: "users/logout", function: USERS_LOGOUT },
        { path: "users/register", function: USERS_REGISTER }
    )

    api.add_routes(
        { path: "passwords/add", function: PASSWORDS_ADD },
        { path: "passwords/change", function: PASSWORDS_CHANGE },
        { path: "passwords/delete", function: PASSWORDS_DELETE }
    )
}

export function get_api() {
    return api
}