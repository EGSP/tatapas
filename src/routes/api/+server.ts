import { get_api, type Argument } from "$lib/code/api/api";
import { bad, mes } from "$lib/code/types";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent): Promise<Response> {
    const logbox = event.locals.logbox_;
    const api = get_api();

    const argument = await event.request.json() as Argument;

    // return json(bad(mes("Not implemented", "Not implemented", "warning")))

    logbox.slog("Get API argument: " + JSON.stringify(argument))
    if (argument.api == null) {
        logbox.slog("No API specified")
        logbox.print();
        return json(bad(mes("No API specified", "Please specify an API", "warning")))
    }

    logbox.slog("Trying to call API: " + argument.api)
    try {
        const response = await api.call(argument.api, argument.object, event);
        if (response == null) {
            logbox.slog("No API found")
            logbox.print();
            return json(bad(mes("No API found", "Please specify an API", "warning")))
        } else {
            logbox.slog(`API: ${argument.api} successfully called`)
            logbox.print();
            return response
        }
    } catch (error:any) {
        logbox.slog("API call failed")
        logbox.slog(error.toString())
        logbox.print();
        return json(bad(mes("Internal error", "Error occurred during API call", "error")))
    }
}