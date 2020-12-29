window.onload = function () {

    let downloadCount = 1;
    let newWidth = 0, newHeight = 0;
    let positionX = 0, positionY = 0;
    let currentlySelecting = false;
    let imgData = 0;

    //setting up canvas
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    

    //============================================================================================================================ transition to second screen
    document.getElementById("getStartedButton").onclick = () => {

        document.getElementById("title").style.fontSize = "50px";
        document.getElementById("description").remove()
        let getStartedButton = document.getElementById("getStartedButton");
        getStartedButton.remove();
        document.getElementById("authorLink").remove();
        document.getElementById("canvasContainer").style.display = "block";
        document.getElementById("editButtons").style.display = "flex";
        document.getElementById("editButtons").style.flexDirection = "row";

        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }


    //============================================================================================================================ load button
    function newImage(source){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let image = new Image();
        image.onload = function () {

            let ratio = image.width / image.height;
            newWidth = canvas.width;
            newHeight = newWidth / ratio;
            if (newHeight > canvas.height) {
                newHeight = canvas.height;
                newWidth = newHeight * ratio;
            }

            positionX = (canvas.width - newWidth) / 2;
            positionY = (canvas.height - newHeight) / 2;

            ctx.drawImage(image, positionX, positionY, newWidth, newHeight);
        }
        image.onerror = function () {
            alert("There is a problem with your image source. Check it and try again!");
        }

        image.src = source;
    }

    let input = document.getElementById("input");
    input.onchange = function() {
        newImage(URL.createObjectURL(this.files[0]));

        document.getElementById("loadButton").style.opacity=0.2;
        document.getElementById("saveButton").style.opacity=1;
        document.getElementById("selectButton").style.opacity=1;
        document.getElementById("cropButton").style.opacity=1;
        document.getElementById("grayscaleButton").style.opacity=1;
        document.getElementById("sepiaButton").style.opacity=1;
        document.getElementById("invertColorsButton").style.opacity=1;
        document.getElementById("scaleButton").style.opacity=1;
        document.getElementById("textButton").style.opacity=1;
        document.getElementById("histogramButton").style.opacity=1;
        document.getElementById("eraseButton").style.opacity=1;
        input.type='';
    };


    //============================================================================================================================ save button
    document.getElementById("saveButton").onclick = function () {
        //create new invisible canvas
        let newCanvas = document.createElement('canvas');
        newCanvas.width = newWidth;
        newCanvas.height = newHeight;

        //paste the content of the old canvas into the new one
        let newContext = newCanvas.getContext("2d");
        newContext.drawImage(canvas, positionX, positionY, newWidth, newHeight, 0, 0, newWidth, newHeight);

        let downloadLink = document.createElement('a');
        downloadLink.download = 'rogobo' + (downloadCount++) + '.png';
        downloadLink.href = newCanvas.toDataURL();
        downloadLink.click();
    }


    //============================================================================================================================ select button
    let selectedRect = {
        x: 0,
        y: 0,
        w: canvas.width,
        h: canvas.height
    };

    let littleSquareSide = 10;
    let currentHandle = false, drag = false;

    function point(x, y) {
        return {
            x: x,
            y: y
        };
    }

    function dist(p1, p2) {
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    }

    function getHandle(mouse) {
        if (dist(mouse, point(selectedRect.x + selectedRect.w / 2, selectedRect.y)) <= littleSquareSide)
            return 'top';
        if (dist(mouse, point(selectedRect.x, selectedRect.y + selectedRect.h / 2)) <= littleSquareSide)
            return 'left';
        if (dist(mouse, point(selectedRect.x + selectedRect.w / 2, selectedRect.y + selectedRect.h)) <= littleSquareSide)
            return 'bottom';
        if (dist(mouse, point(selectedRect.x + selectedRect.w, selectedRect.y + selectedRect.h / 2)) <= littleSquareSide)
            return 'right';
        return false;
    }

    function mouseDown(e) {
        if (currentHandle) drag = true;
        drawSelection();
    }

    function mouseUp() {
        drag = false;
        currentHandle = false;
        drawSelection();
    }

    function mouseMove(e) {
        var previousHandle = currentHandle;
        if (!drag) currentHandle = getHandle(point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop));
        if (currentHandle && drag) {
            var mousePos = point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
            switch (currentHandle) {
                case 'top':
                    selectedRect.h += selectedRect.y - mousePos.y;
                    selectedRect.y = mousePos.y;
                    break;

                case 'left':
                    selectedRect.w += selectedRect.x - mousePos.x;
                    selectedRect.x = mousePos.x;
                    break;

                case 'bottom':
                    selectedRect.h = mousePos.y - selectedRect.y;
                    break;

                case 'right':
                    selectedRect.w = mousePos.x - selectedRect.x;
                    break;
            }
        }
        if (drag || currentHandle != previousHandle) drawSelection();
    }

    function drawSelection() {
        //load image before each draw so past selected rectangles don't remain on canvas
        ctx.putImageData(imgData, 0, 0);
        ctx.fillStyle = "rgb(84, 10, 10, 0.4)";
        ctx.fillRect(selectedRect.x, selectedRect.y, selectedRect.w, selectedRect.h);

        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgb(84, 10, 10)"
        ctx.rect(selectedRect.x, selectedRect.y, selectedRect.w, selectedRect.h);
        ctx.stroke();

        var posHandle1 = point(0, 0);
        var posHandle2 = point(0, 0);
        var posHandle3 = point(0, 0);
        var posHandle4 = point(0, 0);


        posHandle1.x = selectedRect.x + selectedRect.w / 2;
        posHandle1.y = selectedRect.y;

        posHandle2.x = selectedRect.x;
        posHandle2.y = selectedRect.y + selectedRect.h / 2;

        posHandle3.x = selectedRect.x + selectedRect.w / 2;
        posHandle3.y = selectedRect.y + selectedRect.h;

        posHandle4.x = selectedRect.x + selectedRect.w;
        posHandle4.y = selectedRect.y + selectedRect.h / 2;

        ctx.beginPath();

        ctx.fillStyle = "#fce8e8"
        ctx.fillRect(posHandle1.x-littleSquareSide/2, posHandle1.y-littleSquareSide/2, littleSquareSide, littleSquareSide);
        ctx.fillRect(posHandle2.x-littleSquareSide/2, posHandle2.y-littleSquareSide/2, littleSquareSide, littleSquareSide);
        ctx.fillRect(posHandle3.x-littleSquareSide/2, posHandle3.y-littleSquareSide/2, littleSquareSide, littleSquareSide);
        ctx.fillRect(posHandle4.x-littleSquareSide/2, posHandle4.y-littleSquareSide/2, littleSquareSide, littleSquareSide);
    }
    
    function unselect(){
        currentlySelecting = false;
        canvas.removeEventListener('mousedown', mouseDown);
        canvas.removeEventListener('mouseup', mouseUp);
        canvas.removeEventListener('mousemove', mouseMove);
    }

    document.getElementById("selectButton").onclick = function () {
        if (currentlySelecting) {
            ctx.putImageData(imgData, 0, 0);
            unselect();
        }
        else {
            imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            currentlySelecting = true;

            canvas.addEventListener('mousedown', mouseDown, false);
            canvas.addEventListener('mouseup', mouseUp, false);
            canvas.addEventListener('mousemove', mouseMove, false);
            drawSelection();
        }
    }


    //============================================================================================================================ crop button
    function convertImgdataToImage(imagedata) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = imagedata.width;
        canvas.height = imagedata.height;
        ctx.putImageData(imagedata, 0, 0);
        return canvas.toDataURL();
    }

    document.getElementById("cropButton").onclick = function () {
        ctx.putImageData(imgData, 0, 0);
        unselect();
        imgData = ctx.getImageData(selectedRect.x, selectedRect.y, selectedRect.w, selectedRect.h);
        let image = convertImgdataToImage(imgData);
        newImage(image);
    }


    //============================================================================================================================ grayscale button
    document.getElementById("grayscaleButton").onclick = function() {
        ctx.putImageData(imgData, 0, 0);
        unselect();
        let grayPixels = ctx.getImageData(selectedRect.x, selectedRect.y, selectedRect.w, selectedRect.h);
        for(let i=0;i<grayPixels.data.length;i+=4){
            let filter = parseInt(grayPixels.data[i]*0.299+ grayPixels.data[i + 1]*0.587 + grayPixels.data[i + 2]*0.114)

            grayPixels.data[i]=filter;
            grayPixels.data[i+1]=filter;
            grayPixels.data[i+2]=filter;
        }
        ctx.putImageData(grayPixels, selectedRect.x, selectedRect.y);
    }


    //============================================================================================================================ sepia button
    document.getElementById("sepiaButton").onclick = function() {
        ctx.putImageData(imgData, 0, 0);
        unselect();
        let sepiaPixels = ctx.getImageData(selectedRect.x, selectedRect.y, selectedRect.w, selectedRect.h);
        let r = [0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 17, 18, 19, 19, 20, 21, 22, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40, 41, 42, 44, 45, 47, 48, 49, 52, 54, 55, 57, 59, 60, 62, 65, 67, 69, 70, 72, 74, 77, 79, 81, 83, 86, 88, 90, 92, 94, 97, 99, 101, 103, 107, 109, 111, 112, 116, 118, 120, 124, 126, 127, 129, 133, 135, 136, 140, 142, 143, 145, 149, 150, 152, 155, 157, 159, 162, 163, 165, 167, 170, 171, 173, 176, 177, 178, 180, 183, 184, 185, 188, 189, 190, 192, 194, 195, 196, 198, 200, 201, 202, 203, 204, 206, 207, 208, 209, 211, 212, 213, 214, 215, 216, 218, 219, 219, 220, 221, 222, 223, 224, 225, 226, 227, 227, 228, 229, 229, 230, 231, 232, 232, 233, 234, 234, 235, 236, 236, 237, 238, 238, 239, 239, 240, 241, 241, 242, 242, 243, 244, 244, 245, 245, 245, 246, 247, 247, 248, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        g = [0, 0, 1, 2, 2, 3, 5, 5, 6, 7, 8, 8, 10, 11, 11, 12, 13, 15, 15, 16, 17, 18, 18, 19, 21, 22, 22, 23, 24, 26, 26, 27, 28, 29, 31, 31, 32, 33, 34, 35, 35, 37, 38, 39, 40, 41, 43, 44, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 83, 84, 85, 86, 88, 89, 90, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 105, 106, 107, 108, 109, 111, 113, 114, 115, 117, 118, 119, 120, 122, 123, 124, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137, 138, 140, 141, 142, 144, 145, 146, 148, 149, 150, 151, 153, 154, 155, 157, 158, 159, 160, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174, 175, 176, 177, 178, 179, 181, 182, 183, 184, 186, 186, 187, 188, 189, 190, 192, 193, 194, 195, 195, 196, 197, 199, 200, 201, 202, 202, 203, 204, 205, 206, 207, 208, 208, 209, 210, 211, 212, 213, 214, 214, 215, 216, 217, 218, 219, 219, 220, 221, 222, 223, 223, 224, 225, 226, 226, 227, 228, 228, 229, 230, 231, 232, 232, 232, 233, 234, 235, 235, 236, 236, 237, 238, 238, 239, 239, 240, 240, 241, 242, 242, 242, 243, 244, 245, 245, 246, 246, 247, 247, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 255],
        b = [53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 57, 57, 57, 58, 58, 58, 59, 59, 59, 60, 61, 61, 61, 62, 62, 63, 63, 63, 64, 65, 65, 65, 66, 66, 67, 67, 67, 68, 69, 69, 69, 70, 70, 71, 71, 72, 73, 73, 73, 74, 74, 75, 75, 76, 77, 77, 78, 78, 79, 79, 80, 81, 81, 82, 82, 83, 83, 84, 85, 85, 86, 86, 87, 87, 88, 89, 89, 90, 90, 91, 91, 93, 93, 94, 94, 95, 95, 96, 97, 98, 98, 99, 99, 100, 101, 102, 102, 103, 104, 105, 105, 106, 106, 107, 108, 109, 109, 110, 111, 111, 112, 113, 114, 114, 115, 116, 117, 117, 118, 119, 119, 121, 121, 122, 122, 123, 124, 125, 126, 126, 127, 128, 129, 129, 130, 131, 132, 132, 133, 134, 134, 135, 136, 137, 137, 138, 139, 140, 140, 141, 142, 142, 143, 144, 145, 145, 146, 146, 148, 148, 149, 149, 150, 151, 152, 152, 153, 153, 154, 155, 156, 156, 157, 157, 158, 159, 160, 160, 161, 161, 162, 162, 163, 164, 164, 165, 165, 166, 166, 167, 168, 168, 169, 169, 170, 170, 171, 172, 172, 173, 173, 174, 174, 175, 176, 176, 177, 177, 177, 178, 178, 179, 180, 180, 181, 181, 181, 182, 182, 183, 184, 184, 184, 185, 185, 186, 186, 186, 187, 188, 188, 188, 189, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193, 193, 194, 194, 194, 195, 196, 196, 196, 197, 197, 197, 198, 199];
    
        
        for(let i=0;i<sepiaPixels.data.length;i+=4){
            sepiaPixels.data[i]=r[sepiaPixels.data[i]];
            sepiaPixels.data[i+1]=g[sepiaPixels.data[i+1]];
            sepiaPixels.data[i+2]=b[sepiaPixels.data[i+2]];
        }
        ctx.putImageData(sepiaPixels, selectedRect.x, selectedRect.y);
    }

    
    //============================================================================================================================ inverted colors button
    document.getElementById("invertColorsButton").onclick = function() {
        ctx.putImageData(imgData, 0, 0);
        unselect();
        let invertedPixels = ctx.getImageData(selectedRect.x, selectedRect.y, selectedRect.w, selectedRect.h);
        for(let i=0;i<invertedPixels.data.length;i+=4){
            invertedPixels.data[i]=255-invertedPixels.data[i];
            invertedPixels.data[i+1]=255-invertedPixels.data[i+1];
            invertedPixels.data[i+2]=255-invertedPixels.data[i+2];
            invertedPixels.data[i+3]=255;
        }
        ctx.putImageData(invertedPixels, selectedRect.x, selectedRect.y);
    }


    //============================================================================================================================ erase button
    document.getElementById("eraseButton").onclick = function() {
        ctx.putImageData(imgData, 0, 0);
        unselect();
        let blankPixels = ctx.getImageData(selectedRect.x, selectedRect.y, selectedRect.w, selectedRect.h);
        for(let i=0;i<blankPixels.data.length;i++){
            blankPixels.data[i]=255;
        }
        ctx.putImageData(blankPixels, selectedRect.x, selectedRect.y);
    }
}