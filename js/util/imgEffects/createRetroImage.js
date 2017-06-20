define(
    [
        "util/imgEffects/getReaderCanvas"
    ],
    function (
        getReaderCanvas
    ) {
        return function(dir, pxScale = 4, palatization = 60, callback) {
            getReaderCanvas(dir, function (readerCanvas, ctx) {
                let outputCanvas = document.createElement('canvas');
                outputCanvas.width = readerCanvas.width;
                outputCanvas.height = readerCanvas.height;

                let data = ctx.getImageData(0, 0, readerCanvas.width, readerCanvas.height);

                let outCtx = outputCanvas.getContext('2d'),

                    outWidth = Math.floor(readerCanvas.width / pxScale),
                    outHeight = Math.floor(readerCanvas.height / pxScale);

                let outData = outCtx.createImageData(readerCanvas.width, readerCanvas.height);

                for (let x = 0; x < outWidth; x++) {
                    for (let y = 0; y < outHeight; y++) {
                        let originalPos = (x + y * readerCanvas.width) * 4 * pxScale;

                        for (let sx = 0; sx < pxScale; sx++) { //fill full image
                            for (let sy = 0; sy < pxScale; sy++) {
                                let outPos = ((x * pxScale) + sx + ((y * pxScale) + sy) * readerCanvas.width) * 4;

                                outData.data[outPos] = Math.floor(data.data[originalPos] / palatization) * palatization;
                                outData.data[outPos + 1] = Math.floor(data.data[originalPos + 1] / palatization) * palatization;
                                outData.data[outPos + 2] = Math.floor(data.data[originalPos + 2] / palatization) * palatization;
                                outData.data[outPos + 3] = data.data[originalPos + 3]
                            }
                        }
                    }
                }

                console.log(outData);

                outCtx.putImageData(outData, 0, 0);
                callback(outputCanvas);
            });
        }
    }
);