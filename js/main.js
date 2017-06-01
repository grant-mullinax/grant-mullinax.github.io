define(
    [
        "./ui/input",
        "./ui/log",
        "./commands"
    ],
    function(
        input,
        log,
        commands
    ) {
        /*
         todo fix text index (rename too)
         todo make history add to end not front
         todo rename data in filter
         todo make getdata function
         */

        commands.help.run('');
        log.printLn('');

        if (typeof window.orientation !== 'undefined') {
            log.printLn("this website doesn't work on mobile!");
            log.printLn("maybe someday it will,");
            log.printLn("probably not.");
            log.printLn("if you have a bluetooth keyboard however, it would probably/hopefully work right now.");
        }
    }
);