/*
todo fix text index (rename too)
todo make history add to end not front
todo rename data in filter
 */


let logIndex = 0,
    blinking = false,
    context = ">",
    text = "",
    index = -1,
    commandHistory = [],
    historyIndex = -1;

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

function appendImageToLogs(imgDir, pxScale=3, palatization=50){

    let img = document.createElement('img');
    img.crossOrigin = "Anonymous";
    img.src = imgDir;

    img.onload = function() { //we're going async!

        let outputCanvas = document.createElement('canvas');
        outputCanvas.width = this.width;
        outputCanvas.height = this.height;

        let readerCanvas = document.createElement('canvas');
        readerCanvas.width = this.width;
        readerCanvas.height = this.height;

        let ctx = readerCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        let data = ctx.getImageData(0, 0, readerCanvas.width, readerCanvas.height);

        let outCtx = outputCanvas.getContext('2d'),

            outWidth = Math.floor(this.width/pxScale),
            outHeight = Math.floor(this.height/pxScale);

        let outData = outCtx.createImageData(this.width, this.height);

        for (let x = 0; x < outWidth; x++) {
            for (let y = 0; y < outHeight; y++) {
                let originalPos = (x+y*this.width)*4*pxScale;

                for (let sx = 0; sx < pxScale; sx++) { //fill full image
                    for (let sy = 0; sy < pxScale; sy++) {
                        let outPos = ((x*pxScale)+sx+((y*pxScale)+sy)*this.width)*4;

                        outData.data[outPos] = Math.floor(data.data[originalPos]/palatization)*palatization;
                        outData.data[outPos + 1] = Math.floor(data.data[originalPos+1]/palatization)*palatization;
                        outData.data[outPos + 2] = Math.floor(data.data[originalPos+2]/palatization)*palatization;
                        outData.data[outPos + 3] = data.data[originalPos+3]
                    }
                }
            }
        }

        outCtx.putImageData(outData,0,0);
        $("#log").append(outputCanvas);
        newLogSection();
    }
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

        "img": new Command(
            function (args) {
                appendImageToLogs(args[0],args[1],args[2]);
            },"displays a stylized image from any website hosted on a server with no CORS restrictions"
        ),

        "trump": new Command(
            function () {
                appendImageToLogs("img/trump.jpg");
            },"displays a picture of the president of the united states"
        ),

        "hire-me": new Command(
            function () {
                log("youve done it!");
            },"claim your destiny"
        )
    };

$(document).bind('paste', function(e) { //someone said this is bad?
    let t = e.originalEvent.clipboardData.getData('Text');
    text = text.slice(0, index+1) + t + text.slice(index+1);
    index+=t.length;
    updateCmdText();
});

$(document).keydown(function (e) { //desktop
    switch (e.keyCode) {
        case 13://enter
            if (text !== "") {
                log(">" + text);
            } else {
                text = commandHistory[0];
            }

            let split = text.split(" ");
            let commandName = split[0].toLowerCase();
            if (typeof commands[commandName] !== "undefined") {
                split.shift();
                commands[commandName].run(split);
            }

            commandHistory.unshift(text);
            historyIndex = -1;

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
            if (index >= 0)
                index--;
            break;
        case 38: //up
            if (historyIndex < commandHistory.length-1) {
                historyIndex++;
                text = commandHistory[historyIndex];
                index = text.length - 1;
                updateCmdText();
            }
            break;
        case 39: //right
            if (index < text.length - 1)
                index++;
            break;
        case 40: //down
            historyIndex--;
            if (historyIndex>=0){
                text = commandHistory[historyIndex];
                index = text.length - 1;
            }else{
                text="";
                index=-1;
            }
            updateCmdText();
            break;
        default:
            if (e.key.length === 1 && !e.ctrlKey) {
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

commands.help.run('');
log('');

if (typeof window.orientation !== 'undefined') {
    log("this website doesn't work on mobile!");
    log("maybe someday it will");
    log("probably not.");
    log("if you have a bluetooth keyboard though, it would probably work right now.");
    log("I'm not sure, its only a theory");
}