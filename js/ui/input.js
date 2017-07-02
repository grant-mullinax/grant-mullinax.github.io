define(
    [
        'ui/log',
        'commands/base'
    ],
    function (
        log,
        commands
    ) {

        const c = {
            cmdline: $("#cmdline"),
            blinking: false,
            context: ">",
            text: "",
            index: 0,
            commandHistory: [],
            historyIndex: -1,

            updateCmdText: function() {
                let displayText;
                if (c.blinking) {
                    displayText = c.text;
                } else {
                    displayText = c.text.slice(0, c.index + 1) + "█" + c.text.slice(c.index + 2);
                }
                c.cmdline.text(c.context + displayText);
            },
            handleKeyDown:function (e) { //desktop
                switch (e.keyCode) {
                    case 13://enter
                        if (c.text !== "") {
                            log.printLn(">" + c.text);
                        } else {
                            c.text = c.commandHistory[0];
                        }

                        let split = c.text.split(" "),
                            commandName = split[0].toLowerCase();
                        if (typeof commands[commandName] !== "undefined") {
                            split.shift();
                            commands[commandName].run(split);
                        }

                        c.commandHistory.unshift(c.text);
                        c.historyIndex = -1;

                        c.text = "";
                        c.index = 0;
                        break;
                    case 8://backspace
                        if (c.index > 0) {
                            c.text = c.text.slice(0, c.index-1) + c.text.slice(c.index);
                            c.index--;
                        }
                        break;
                    case 46://delete
                        c.text = c.text.slice(0, c.index) + c.text.slice(c.index + 1);
                        break;
                    case 37: //left
                        if (c.index > 0)
                            c.index--;
                        break;
                    case 38: //up
                        e.preventDefault();
                        if (c.historyIndex < c.commandHistory.length - 1) {
                            c.historyIndex++;
                            c.text = c.commandHistory[c.historyIndex];
                            c.index = c.text.length - 1;
                            c.updateCmdText();
                        }
                        break;
                    case 39: //right
                        if (c.index < c.text.length)
                            c.index++;
                        break;
                    case 40: //down
                        e.preventDefault();
                        if (c.historyIndex > 0) {
                            c.historyIndex--;
                            c.text = c.commandHistory[c.historyIndex];
                            c.index = c.text.length - 1;
                        } else {
                            c.text = "";
                            c.index = -1;
                        }
                        c.updateCmdText();
                        break;
                    default:
                        if (e.key.length === 1 && !e.ctrlKey) {
                            c.index++;
                            if (c.index === c.text.length) {
                                c.text += e.key;
                            } else {
                                c.text = c.text.slice(0, c.index) + e.key + c.text.slice(c.index);
                            }
                        }
                }
                c.updateCmdText();
            },
            handlePaste: function (e) { //someone said this is bad?
                let t = e.originalEvent.clipboardData.getData('Text');
                c.text = c.text.slice(0, c.index) + t + c.text.slice(c.index);
                c.index += t.length;
                c.updateCmdText();
            }
        };

        $(document).bind('paste', c.handlePaste);

        $(document).keydown(c.handleKeyDown);

        setInterval(
            function () {
                c.blinking = !c.blinking;
                c.updateCmdText();
            }
            , 500
        );

        return c;
    }
);