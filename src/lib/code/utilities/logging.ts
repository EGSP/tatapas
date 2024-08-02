import chalk from "chalk"
import type { Message } from "../types"

export let logger = {
    slog: (message: any) => {
        const logbox = new Logbox()
        logbox.slog(message)
        logbox.print()
    },
    dlog: (message: any) => {
        const logbox = new Logbox()
        logbox.dlog(message)
        logbox.print()
    },
    plog: (message: any) => {
        const logbox = new Logbox()
        logbox.plog(message)
        logbox.print()
    },
    pulog: (message: any) => {
        const logbox = new Logbox()
        logbox.pulog(message)
        logbox.print()
    }
}


export class Logbox {
    logs: ([header: string, message: string] | Logbox)[] = []

    add(header: string, message: string) {
        this.logs.push([header, message])
    }

    add_box(logbox: Logbox) {
        this.logs.push(logbox)
    }

    from(): Logbox {
        const logbox = new Logbox()
        this.add_box(logbox)
        return logbox
    }

    slog(message: string) {
        const header = chalk.bgWhiteBright.black("server")
        this.add(header, message)
    }

    dlog(message: string) {
        const header = chalk.bgGreenBright.black("db")
        this.add(header, message)
    }

    plog(message: string) {
        const header = chalk.bgMagentaBright.black("page")
        this.add(header, message)
    }

    pulog(message: string) {
        const header = chalk.bgYellowBright.black("pulse")
        this.add(header, message)
    }

    print() {
        // print_logbox(this)
        print_logbox_iterative(this)
    }
}

export function print_logbox(logbox: Logbox, depth = 0) {
    const logs = logbox.logs
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i]
        if (log instanceof Logbox) {
            print_logbox(log, depth + 1)
        } else {
            console.log("\t".repeat(depth) + log)
        }
    }
}


export function print_logbox_iterative(logbox: Logbox) {
    const logs: [log: ([header: string, message: string] | Logbox), depth: number][] = logbox_to_logs(logbox, 0)
    let messages_printed = 0
    while (logs.length > 0) {
        const [log, depth] = logs.shift()!

        if (log instanceof Logbox) {
            logs.unshift(...logbox_to_logs(log, depth + 1))

        } else {
            const header = log[0];
            const message = log[1];
            let symbol = ""

            if (messages_printed == 0 && logs.length == 0) {
                symbol = chalk.gray("<> ")
            } else {
                // check if it is the first message
                if (messages_printed == 0) {
                    symbol = chalk.gray(">  ")
                } else if (logs.length == 0) {
                    symbol = chalk.gray(">. ")
                }
            }

            if (symbol == "") {
                console.log("   "+"| ".repeat(depth) + `${header} ${message}`)
            } else {
                console.log(symbol + "| ".repeat(depth) + `${header} ${message}`)
            }
            messages_printed++
        }
    }

    function logbox_to_logs(logbox: Logbox, depth: number): [log: ([header: string, message: string] | Logbox), depth: number][] {
        return logbox.logs.map(log => [log, depth])
    }
}

export function message_to_log(message: Message) {
    return `${chalk_kind(message.kind)} ${message.title} ${message.subtitle}`
}

export function chalk_kind(kind: string) {
    switch (kind) {
        case "info":
            return chalk.blue(kind)
        case "success":
            return chalk.green(kind)
        case "warning":
            return chalk.yellow(kind)
        case "error":
            return chalk.red(kind)
    }
}
