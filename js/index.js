let previousText = "",
    logIndex = 0,
    blinking,
    context,
    text,
    index,
    mobile;

if (typeof window.orientation === 'undefined') {
    blinking = false;
    context = ">";
    text = "";
    index = -1;
    mobile = false;
}else{
    mobile = true;
}

function scrollToBottom() {
    $("#bottom")[0].scrollIntoView();
}

function log(t){
    $("#log_section_"+logIndex).append(t+'<br />');
    scrollToBottom();
}

function newLogSection(){
    logIndex++;
    $("#log").append('<pre id="log_section_'+logIndex+'"></pre>');
    scrollToBottom();
}

function appendToLogs(html){
    $("#log").append(html);
    newLogSection();
}

function updateCmdText(){
    let displayText;
    if (blinking){
        displayText = text;
    }else{
        displayText = text.slice(0, index+1) + "█" + text.slice(index+2);
    }
    $("#cmdline").text(context+displayText);
}

class Command{
    constructor(func,desc){
        this.func = func;
        this.help = desc;
    }

    run(args){
        this.func(args);
    }
}

let commands =
    {
        "help": new Command(
            function (args) {
                let command = args[0];
                if (typeof command !== "undefined") {
                    if (typeof commands[command] !== "undefined"){
                        log(command + " : " + commands[command].help);
                    }else{
                        log("that command does not exist!")
                    }
                }else{
                    log("these are all the commands:");
                    for(command in commands) this.func([command]);
                }
            },"provides info about a command"
        ),

        "hello": new Command(
            function () {
                log("hi");
            },"it says hi"
        ),

        "echo": new Command(
            function (args) {
                let text = "";
                args.forEach(function (arg,i) {
                    text+=arg+" ";
                });
                log(text);
            },"it echoes what you say!"
        ),

        "clear": new Command(
            function () {
                $("#log").html('<pre id="log_section_0"></pre>');
                logIndex = 0;
            },"clear the logs"
        ),

        "github": new Command(
            function () {
                appendToLogs('<a href="https://github.com/grant-mullinax" target="_blank"><img src="img/github-logo.png" alt="github" width="100" height="100"></a>')
            },"displays a link to my github"
        ),

        "google": new Command(
            function () {
                appendToLogs('<a href="https://www.google.com" target="_blank">Google</a>')
            },"displays a link to google"
        ),

        "trump": new Command(
            function () {
                appendToLogs('<img src="img/trump.jpg" alt="president of the united states">');
            },"displays a picture of the president of the united states"
        ),

        "hire-me": new Command(
            function () {
                log("youve done it!");
            },"claim your destiny"
        )
    };

function executeCommand(text){
    if (text !== "") {
        log(">" + text);
    } else {
        text = previousText;
    }

    let split = text.split(" ");
    let commandName = split[0].toLowerCase();
    if (typeof commands[commandName] !== "undefined") {
        split.shift();
        commands[commandName].run(split);
    }

    previousText = text;
}

if (!mobile) {
    $(document).keydown(function (e) { //desktop
        switch (e.keyCode) {
            case 13://enter
                executeCommand(text);

                text = "";
                index = -1;
                break;
            case 8://backspace
                if (index >= 0) {
                    text = text.slice(0, index) + text.slice(index + 1);
                    index--;
                }
                break;
            case 46://delete
                text = text.slice(0, index + 1) + text.slice(index + 2);
                break;
            case 37: //left
                console.log('left');
                if (index >= 0)
                    index--;
                break;
            case 39: //right
                if (index < text.length - 1)
                    index++;
                break;
            default:
                if (e.key.length === 1) {
                    index++;
                    if (index === text.length) {
                        text += e.key;
                    } else {
                        text = text.slice(0, index) + e.key + text.slice(index);
                    }
                }
        }
        updateCmdText();
    });

    setInterval(
        function(){
            blinking=!blinking;
            updateCmdText();
        }
        , 500
    );
}

function mobileCommand(){
    let cmdline = $("#mobile_cmdline");
    executeCommand(cmdline.val());
    cmdline.val('');
}

commands.help.run('');
log('1.0');