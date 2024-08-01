import { DATABASE_URL } from "$env/static/private";
import { Pulse } from "@pulsecron/pulse";

import { get_lucia } from "./lucia.server";
import { Logbox, logger } from "./utilities/logging";

const pulse = new Pulse({
    db: {
        address: DATABASE_URL!,
        collection: 'jobs'
    },
    processEvery: "5 seconds"
})


export async function prepare_pulse() {
    const logbox = new Logbox()
    logbox.pulog("Preparing pulse job scheduler")
    logbox.pulog("Defining jobs")
    define_jobs()

    logbox.pulog("Starting pulse job scheduler")
    await pulse.start()
    logbox.pulog("Pulse job scheduler started")

    logbox.pulog("Initializing jobs")
    await pulse.every("10 seconds", "sing")
    await pulse.every("10 seconds", "sing 2")
    await pulse.every("5 minutes", "delete_expired_sessions")
    logbox.pulog("Jobs initialized")

    // pulse.on('start', (job) => {
    //     console.log(time(), `Job <${job.attrs.name}> starting`);
    // });
    // pulse.on('success', (job) => {
    //     console.log(time(), `Job <${job.attrs.name}> succeeded`);
    // });
    // pulse.on('fail', (error, job) => {
    //     console.log(time(), `Job <${job.attrs.name}> failed:`, error);
    // });

    logbox.print()

    function time() {
        return new Date().toTimeString().split(' ')[0];
    }
}

function define_jobs() {
    // pulse.define("sing", async (job, done) => {
    //     logger.pulog("sing")
    //     done();
    // })

    // pulse.define("sing 2", async (job, done) => {
    //     logger.pulog("sing 2")
    //     done();
    // })

    pulse.define("delete_expired_sessions", async (job, done) => {
        const logbox = new Logbox()

        try {
            logbox.pulog("Deleting expired sessions")
            const lucia = get_lucia();
            await lucia.deleteExpiredSessions();
            logbox.pulog("Expired sessions deleted")
            done();
        } catch (error: any) {
            logbox.pulog(JSON.stringify(error))
            done(error as Error);
        } finally {
            logbox.print()
        }

    })
}