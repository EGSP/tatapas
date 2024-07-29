export interface User {
    _id: string
    name: string
    role: string
}



export interface FetchOk<T>{
    value: T
}

export interface FetchBad{
    message: string
}

export function ok<T>(result: any): FetchOk<T> {
    return {
        value: result
    };
}

export function bad(message: string): FetchBad {
    return {
        message: message,
    };
}

export function is_ok_fetch<T>(fetch: FetchOk<T>|FetchBad): fetch is FetchOk<T> {
    return (fetch as FetchOk<T>).value !== undefined;
}