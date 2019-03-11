import { main } from "./src/main";

const defaultTask = (cb: () => void) => {
    console.log("Gulp for PerfectWeek");

    main();

    cb();
}

export default defaultTask;
