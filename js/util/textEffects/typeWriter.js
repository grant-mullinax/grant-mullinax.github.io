define(function() {

    return function(element){ //put in typewriterorder objects
        for (let i=1; arguments.length; i++){
            let textIndex = arguments[i].length;
            const interval = setInterval(function() {

                if (textIndex<=0) clearInterval(interval);
            }, arguments[i].duration);
        }
    }
});