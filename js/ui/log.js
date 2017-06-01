define(function() {
    const
        log = $("#log"),
        bottom = $("#bottom")[0];

    let logIndex = 0;

    const l = { //what do i name this? why doesn't 'this' work?
        scrollToBottom: function () {
            bottom.scrollIntoView();
        },

        printLn: function (t) {
            $("#log_section_" + logIndex).append(t + '<br />');
            l.scrollToBottom();
        },

        newLogSection: function () {
            logIndex++;
            log.append('<pre id="log_section_' + logIndex + '"></pre>');
            l.scrollToBottom();
        },

        append: function (e) {
            log.append(e);
            l.newLogSection();
        },

        clearLogs: function () {
            log.html('<pre id="log_section_0"></pre>');
            logIndex = 0;
        },

        getElement: function(){
            return log;
        }
    }

    return l;
});