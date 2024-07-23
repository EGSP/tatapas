import type { RequestEvent } from "@sveltejs/kit";
import { json } from '@sveltejs/kit';
import { Ok } from "ts-results-es";

export async function POST(event: RequestEvent):Promise<Response>{
    return json(Ok(undefined))
}