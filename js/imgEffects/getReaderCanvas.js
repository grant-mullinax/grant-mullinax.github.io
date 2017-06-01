define(function() {
        return function getReaderCanvas(dir, callback) {
            let img = document.createElement('img');
            img.crossOrigin = "Anonymous";
            img.src = dir;

            img.onload = function () { //we're going async!
                let readerCanvas = document.createElement('canvas');
                readerCanvas.width = this.width;
                readerCanvas.height = this.height;

                let ctx = readerCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                callback(readerCanvas, ctx)
            }
        }
    }
);