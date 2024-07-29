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
    const stack: [logbox:Logbox, depth:number][] = [[logbox, 0]]
    let messages_printed = 0
    while (stack.length > 0) {
        const [logbox, depth] = stack.pop()!
        const logs = logbox.logs
        for (let i = 0; i < logs.length; i++) {
            const log = logs[i]
            if (log instanceof Logbox) {
                stack.push([log, depth + 1])
            } else {
                let header = log[0];
                const message = log[1];

                // check if it is the first message
                if (messages_printed == 0) {
                    header = chalk.bold(header)
                }else if(i == logs.length - 1 && stack.length == 0){
                    header = chalk.underline(header)
                }
                console.log("\t".repeat(depth) + `${header} ${message}`) 
                messages_printed++
            }
        }
    }
}
