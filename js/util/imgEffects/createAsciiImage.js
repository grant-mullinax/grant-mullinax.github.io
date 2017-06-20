define(
    [
        "util/imgEffects/getReaderCanvas"
    ],
    function (
        getReaderCanvas
    ) {
        const asciiGradient = ["─", "▒", "▓", "▓", "▀"];

        return function(dir="img/trump.jpg", pxScale = 6 , xtraWide = 'true',callback) {
            getReaderCanvas(dir, function (readerCanvas,ctx) {
                let data = ctx.getImageData(0, 0, readerCanvas.width, readerCanvas.height),
                    outWidth = Math.floor(readerCanvas.width / pxScale),
                    outHeight = Math.floor(readerCanvas.height / pxScale*2);

                let out = "";

                for (let y = 0; y < outHeight; y++) {
                    for (let x = 0; x < outWidth; x++) {
                        let originalPos = (x + y * readerCanvas.width) * 4 * pxScale;

                        let pxBrightness = ((data.data[originalPos] + data.data[originalPos + 1] + data.data[originalPos + 2]) / 3) / 255;
                        let char = asciiGradient[Math.round(pxBrightness * (asciiGradient.length - 1))];
                        if (xtraWide === 'true') { //i want type coercion!
                            out += char;
                        } else {
                            out += char + char;
                        }

                    }
                    out += "<br/>"
                }

                callback(out);
            });
        }
    }
);