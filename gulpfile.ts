import { main } from "./src/main";
import { database_setup, database_start, database_stop, database_delete } from "./tasks/database";

export const setup = async () => {
    await database_setup();
};

export const clean = async () => {
    await database_delete();
}

export const start = async () => {
    await database_start();
};

export const stop = async () => {
    await database_stop();
};

export default (cb: () => void) => {
    console.log("PerfectWeek's gulp config");
    cb();
};
