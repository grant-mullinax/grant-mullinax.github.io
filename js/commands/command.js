define(function() {
    class Command {
        constructor(func, desc) {
            this.func = func;
            this.help = desc;
        }

        run(args) {
            this.func(args);
        }
    }
    return Command;
});