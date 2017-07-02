define(
    [
        "commands/command",
        "ui/log"
    ],
    function(
        Command,
        log
    ) {

        const commands = {
            "help": new Command(
                function (args) {
                    let command = args[0];
                    if (typeof command !== "undefined") {
                        if (typeof commands[command] !== "undefined") {
                            log.printLn(command + " : " + commands[command].help);
                        } else {
                            log.printLn("that command does not exist!")
                        }
                    } else {
                        log.printLn("these are all the commands:");
                        for (command in commands) this.func([command]);
                    }
                }, "provides info about a command"
            ),

            "hello": new Command(
                function () {
                    log.printLn("hi");
                }, "it says hi"
            ),

            "echo": new Command(
                function (args) {
                    let text = "";
                    args.forEach(function (arg) {
                        text += arg + " ";
                    });
                    log.printLn(text);
                }, "it echoes what you say!"
            ),

            "clear": new Command(
                function () {
                    log.clearLogs()
                },
                "clear the logs"
            ),

            "github": new Command(
                function () {
                    log.append('<a href="https://github.com/grant-mullinax" target="_blank"><img src="img/github-logo.png" alt="github" width="100" height="100"></a>')
                }, "displays a link to my github"
            ),

            "google": new Command(
                function () {
                    log.append('<a href="https://www.google.com" target="_blank">Google</a>')
                }, "displays a link to google"
            ),

            "bonus-mode": new Command(
                function () {
                    if (!localStorage.bonusMode) {
                        localStorage.bonusMode = true;

                    }
                }, "turns on bonus mode forever! bonus mode has whacky features!"
            ),

            "hire-me": new Command(
                function () {
                    log.printLn("youve done it!");
                }, "claim your destiny"
            )
        };

        return commands;
    }
);