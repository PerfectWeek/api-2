export const main = (): void => {
    let count = 1;

    setInterval(() => {
        console.log(`API is running: ${count}`);
        ++count;
    }, 1000);
};

/*
 * Run main function if called as a script
 */
if (require.main === module) {
    main();
}
