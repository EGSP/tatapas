import chalk from "chalk"

export let logger = {
    slog: (message: any) => {
        const prefix = chalk.bgWhiteBright.black("[SERVER]")
        console.log(prefix, message)
    },
    dlog: (message: any) => {
        const prefix = chalk.bgGreenBright.black("[DB]")
        console.log(prefix, message)
    },
    plog: (message: any) => {
        const prefix = chalk.bgMagentaBright.black("[PAGE]")
        console.log(prefix, message)
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
            let header = log[0];
            const message = log[1];

            // check if it is the first message
            if (messages_printed == 0) {
                header = chalk.gray("> ")+ chalk.bold(header)
            } else if (logs.length == 0) {
                header =chalk.gray(">. ") + chalk.underline(header)
            }
            console.log(" | ".repeat(depth) + `${header} ${message}`)
            messages_printed++
        }
    }

    function logbox_to_logs(logbox: Logbox, depth: number): [log: ([header: string, message: string] | Logbox), depth: number][] {
        return logbox.logs.map(log => [log, depth])
    }
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
