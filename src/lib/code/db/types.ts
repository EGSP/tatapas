export interface User {
    nickname: string
    role: string
}


export interface FetchResult {
    value: any | null;
    message: any | null
}

export function ok(result: any): FetchResult {
    return {
        value: result,
        message: null
    };
}

export function bad(result: any): FetchResult {
    return {
        message: result,
        value: null
    };
}

export function isOk(result: FetchResult): boolean {
    return result.message == null
}