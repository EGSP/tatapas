import chalk from "chalk"

export let logger = {
    slog: (message:any) => {
        const prefix = chalk.bgWhiteBright.black("[SERVER]")
        console.log(prefix,message)
    },
    dlog: (message:any) => {
        const prefix = chalk.bgGreenBright.black("[DB]")
        console.log(prefix,message)
    },
    plog: (message:any) => {
        const prefix = chalk.bgMagentaBright.black("[PAGE]")
        console.log(prefix,message)
    }
}