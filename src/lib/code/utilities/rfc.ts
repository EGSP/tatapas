import type { Argument } from "../api/api";

export async function fetch_api(argument: Argument): Promise<Response> {
    const response = await fetch('/api/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(argument)
    });
    return response;
}
