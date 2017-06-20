define(function() {
    const l = { //what do i name this? why doesn't 'this' work?
        log: $("#log"),
        bottom: $("#bottom")[0],

        logIndex: 0,

        scrollToBottom: function () {
            this.bottom.scrollIntoView();
        },

        printLn: function (t) {
            $("#log_section_" + this.logIndex).append(t + '<br />');
            this.scrollToBottom();
        },

        newLogSection: function () {
            this.logIndex++;
            this.append('<pre id="log_section_' + this.logIndex + '"></pre>');
            this.scrollToBottom();
        },

        append: function (e) {
            this.log.append(e);
            this.newLogSection();
        },

        clearLogs: function () {
            this.log.html('<pre id="log_section_0"></pre>');
            this.logIndex = 0;
        },

        getElement: function(){
            return this.log;
        }
    };

    return l;
});