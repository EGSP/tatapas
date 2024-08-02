import type { RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent): Promise<Response> {
    const logbox = event.locals.logbox_;
    const user = event.locals.user;

    const passwords = await event.request.json();
}