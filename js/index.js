let context = ">",
    text = "",
    previousText = "",
    index = -1,
    logIndex = 0,
    blinking = false;

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

function logLink(text, url){
    $("#log").append('<a href="'+url+'" target="_blank">'+text+'</a>');
    newLogSection();
}

function logImg(img){
    $("#log").append('<img src="img/'+img+'" alt="president of the united states">');
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

    run(s){
        this.func(s[1],s[2],s[3],s[4]);
        //don't hate the player, hate the game. you shouldn't need more than 4 arguments, right?
    }
}

let commands =
    {
        "help": new Command(
            function (command) {
                if (typeof command !== "undefined") {
                    if (typeof commands[command] !== "undefined"){
                        log(command + " : " + commands[command].help);
                    }else{
                        log("that command does not exist!")
                    }
                }else{
                    log("these are all the commands:");
                    for(command in commands) this.func(command);
                }
            },"provides info about a command"
        ),

        "hello": new Command(
            function () {
                log("hi");
            },"it says hi"
        ),

        "echo": new Command(
            function (reply) {
                log(reply);
            },"it echoes what you say!"
        ),

        "github": new Command(
            function () {
                logLink("github","https://github.com/grant-mullinax")
            },"displays a link to my github"
        ),

        "google": new Command(
            function () {
                logLink("google","https://www.google.com")
            },"displays a link to google"
        ),

        "trump": new Command(
            function () {
                logImg("trump.jpg")
            },"displays a picture of the president of the united states"
        ),

        "hire-grant": new Command(
            function () {
                log("youve done it!");
            },"claim your destiny"
        )
    };

$(document).keydown(function(e) {
    console.log(e.keyCode);
    switch(e.keyCode){
        case 13://enter
            if (text!=="") {
                log(">"+text);
            }else{
                text = previousText;
            }

            let split = text.split(" ");
            let commandName = split[0].toLowerCase();
            if (typeof commands[commandName] !== "undefined")
                commands[commandName].run(split);

            previousText = text;

            text = "";
            index = -1;
            break;
        case 8://backspace
            if(index>=0){
                text = text.slice(0, index) + text.slice(index+1);
                index--;
            }
            break;
        case 46://delete
            text = text.slice(0, index+1) + text.slice(index+2);
            break;
        case 37: //left
            console.log('left');
            if (index>=0)
                index--;
            break;
        case 39: //right
            if (index<text.length-1)
                index++;
            break;
        default:
            if (e.key.length===1) {
                index++;
                if (index===text.length){
                    text+=e.key;
                }else{
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

$('#retro_overlay').on('dragstart', function(event) { event.preventDefault(); });

commands.help.run('');
log('');