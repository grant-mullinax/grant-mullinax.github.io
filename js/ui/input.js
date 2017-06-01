define(
    [
        './log',
        '../commands'
    ],
    function (
        log,
        commands
    ) {
    const cmdline = $("#cmdline");
    let blinking = false,
        context = ">",
        text = "",
        index = -1,
        commandHistory = [],
        historyIndex = -1;

    function updateCmdText() {
        let displayText;
        if (blinking) {
            displayText = text;
        } else {
            displayText = text.slice(0, index + 1) + "█" + text.slice(index + 2);
        }
        cmdline.text(context + displayText);
    }

    $(document).bind('paste', function (e) { //someone said this is bad?
        let t = e.originalEvent.clipboardData.getData('Text');
        text = text.slice(0, index + 1) + t + text.slice(index + 1);
        index += t.length;
        updateCmdText();
    });

    $(document).keydown(function (e) { //desktop
        switch (e.keyCode) {
            case 13://enter
                if (text !== "") {
                    log.printLn(">" + text);
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
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
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
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    text = commandHistory[historyIndex];
                    index = text.length - 1;
                } else {
                    text = "";
                    index = -1;
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
        function () {
            blinking = !blinking;
            updateCmdText();
        }
        , 500
    );
});