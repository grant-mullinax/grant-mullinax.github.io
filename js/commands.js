define(
    [
        './ui/log',
        "./imgEffects/createRetroImage",
        "./imgEffects/createAsciiImage"
    ],
    function(
        log,
        createRetroImage,
        createAsciiImage
    ) {
        class Command {
            constructor(func, desc) {
                this.func = func;
                this.help = desc;
            }

            run(args) {
                this.func(args);
            }
        }

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
                log.clearLogs(),
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

            "img": new Command(
                function (args) {
                    createRetroImage(args[0],args[1],args[2],log.append);
                }, "displays a stylized image from any website hosted on a server with no CORS restrictions"
            ),

            "ascii-img": new Command(
                function (args) {
                    createAsciiImage(args[0], args[1], args[2], log.printLn);
                }, "displays a stylized image from any website hosted on a server with no CORS restrictions"
            ),

            "trump": new Command(
                function () {
                    createRetroImage("img/trump.jpg",4,60, log.append);
                }, "displays a picture of the president of the united states"
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