import type { RequestEvent } from "@sveltejs/kit";

export async function POST( event: RequestEvent ): Promise<Response> {
    const logbox = event.locals.logbox_;
    
}