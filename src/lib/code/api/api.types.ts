import type { RequestEvent } from "@sveltejs/kit"
import { USERS_FETCH, USERS_LOGIN, USERS_LOGOUT, USERS_REGISTER } from "./users/users.server"
import { PASSWORDS_ADD, PASSWORDS_CHANGE, PASSWORDS_DELETE } from "./passwords/passwords.server"

export interface Argument{
    api: string,
    object: any
}

export type ApiFunction = (object: any, event: RequestEvent) => Promise<Response>

export interface ApiRoute{
    path: string,
    function: ApiFunction
}

export const api={
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

    call: (path: string, object: any, event: RequestEvent): Promise<Response|null> => {
        for (let i = 0; i < api.routes.length; i++) {
            if (api.routes[i].path == path) {
                return api.routes[i].function(object, event)
            }
        }
        return Promise.resolve(null);
    }
}

function seed(){
    api.add_routes(
        {path: "api/users/fetch", function: USERS_FETCH},
        {path: "api/users/login", function: USERS_LOGIN},
        {path: "api/users/logout", function: USERS_LOGOUT},
        {path: "api/users/register", function: USERS_REGISTER}
    )

    api.add_routes(
        {path: "api/passwords/add", function: PASSWORDS_ADD},
        {path: "api/passwords/change", function: PASSWORDS_CHANGE},
        {path: "api/passwords/delete", function: PASSWORDS_DELETE}
    )
}