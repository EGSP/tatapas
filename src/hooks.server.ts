import { building } from "$app/environment";
import { prepare_database } from "$lib/code/db.server";

async function ini(){
    if(!building){
        await prepare_database()
    }
}

ini()