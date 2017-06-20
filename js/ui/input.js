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
                if (this.blinking) {
                    displayText = this.text;
                } else {
                    displayText = this.text.slice(0, this.index + 1) + "█" + this.text.slice(this.index + 2);
                }
                this.cmdline.text(this.context + displayText);
            },
            handleKeyDown:function (e) { //desktop
                switch (e.keyCode) {
                    case 13://enter
                        if (this.text !== "") {
                            log.printLn(">" + this.text);
                        } else {
                            this.text = this.commandHistory[0];
                        }

                        let split = this.text.split(" "),
                            commandName = split[0].toLowerCase();
                        if (typeof commands[commandName] !== "undefined") {
                            split.shift();
                            commands[commandName].run(split);
                        }

                        this.commandHistory.unshift(this.text);
                        this.historyIndex = -1;

                        this.text = "";
                        this.index = 0;
                        break;
                    case 8://backspace
                        if (this.index > 0) {
                            this.text = this.text.slice(0, this.index-1) + this.text.slice(this.index);
                            this.index--;
                        }
                        break;
                    case 46://delete
                        this.text = this.text.slice(0, this.index) + this.text.slice(this.index + 1);
                        break;
                    case 37: //left
                        if (this.index > 0)
                            this.index--;
                        break;
                    case 38: //up
                        e.preventDefault();
                        if (this.historyIndex < this.commandHistory.length - 1) {
                            this.historyIndex++;
                            this.text = this.commandHistory[this.historyIndex];
                            this.index = this.text.length - 1;
                            this.updateCmdText();
                        }
                        break;
                    case 39: //right
                        if (this.index < this.text.length)
                            this.index++;
                        break;
                    case 40: //down
                        e.preventDefault();
                        if (this.historyIndex > 0) {
                            this.historyIndex--;
                            this.text = this.commandHistory[this.historyIndex];
                            this.index = this.text.length - 1;
                        } else {
                            this.text = "";
                            this.index = -1;
                        }
                        this.updateCmdText();
                        break;
                    default:
                        if (e.key.length === 1 && !e.ctrlKey) {
                            this.index++;
                            if (this.index === this.text.length) {
                                this.text += e.key;
                            } else {
                                this.text = this.text.slice(0, this.index) + e.key + this.text.slice(this.index);
                            }
                        }
                }
                this.updateCmdText();
            },
            handlePaste: function (e) { //someone said this is bad?
                let t = e.originalEvent.clipboardData.getData('Text');
                this.text = this.text.slice(0, this.index) + t + this.text.slice(this.index);
                this.index += t.length;
                this.updateCmdText();
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