define(
    [
        "commands/command",
        "ui/log",
        "imgEffects/createRetroImage",
        "imgEffects/createAsciiImage"
    ],
    function(
        Command,
        log,
        createRetroImage,
        createAsciiImage
    ) {

        const commands = {
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
            )
        };

        return commands;
    }
);