export interface User {
    name: string
    role: string
}

export interface Password{
    _id: string,
    usecase: string,
}

export interface CatalogTree{
    _id: string,
    root: Catalog
}

export interface Catalog{
    catalogs: Catalog[]|null,
    passwords_id: string|null
}

// export interface FetchOk<T>{
//     value: T
// }

// export interface FetchBad{
//     messages: Message[]
// }

export interface Message{
    kind: Kind,
    title: string
    subtitle: string
}

export type Kind = "success" | "info" | "warning" | "error";

export interface Result<T> {
    value: T|null
    messages: Message[]
}

export function result<T>( value: T|null, messages: Message[] = []): Result<T> {
    return {
        value: value,  
        messages: messages
    };
}

export function ok<T>(value: T): Result<T> {
    return result(value);
}

export function bad<T>(...messages: Message[]): Result<T> {
    return result(null as T, messages);
}

export function mes(title:string,subtitle: string,kind:Kind = "info"): Message {
    return {
        kind: kind,
        title: title+":",
        subtitle: subtitle
    };
}