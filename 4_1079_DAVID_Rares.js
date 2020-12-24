window.onload = function () {

    let downloadCount = 1;
    let newWidth = 0;
    let newHeight = 0;
    let positionX = 0;
    let positionY = 0;
    let currentlySelecting = false;
    let imgData = 0;

    //setting up canvas
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let rect = {
        x: 0,
        y: 0,
        w: canvas.width,
        h: canvas.height
    };
    let littleSquareSide = 10;
    let currentHandle = false, drag = false;

    function init() {
        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.addEventListener('mouseup', mouseUp, false);
        canvas.addEventListener('mousemove', mouseMove, false);
    }

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
        if (dist(mouse, point(rect.x + rect.w / 2, rect.y)) <= littleSquareSide)
            return 'top';
        if (dist(mouse, point(rect.x, rect.y + rect.h / 2)) <= littleSquareSide)
            return 'left';
        if (dist(mouse, point(rect.x + rect.w / 2, rect.y + rect.h)) <= littleSquareSide)
            return 'bottom';
        if (dist(mouse, point(rect.x + rect.w, rect.y + rect.h / 2)) <= littleSquareSide)
            return 'right';
        return false;
    }

    function mouseDown(e) {
        if (currentHandle) drag = true;
        draw();
    }

    function mouseUp() {
        drag = false;
        currentHandle = false;
        draw();
    }

    function mouseMove(e) {
        var previousHandle = currentHandle;
        if (!drag) currentHandle = getHandle(point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop));
        if (currentHandle && drag) {
            var mousePos = point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
            switch (currentHandle) {
                case 'top':
                    rect.h += rect.y - mousePos.y;
                    rect.y = mousePos.y;
                    break;

                case 'left':
                    rect.w += rect.x - mousePos.x;
                    rect.x = mousePos.x;
                    break;

                case 'bottom':
                    rect.h = mousePos.y - rect.y;
                    break;

                case 'right':
                    rect.w = mousePos.x - rect.x;
                    break;
            }
        }
        if (drag || currentHandle != previousHandle) draw();
    }

    function draw() {
        ctx.putImageData(imgData, 0, 0);
        ctx.fillStyle = "rgb(84, 10, 10, 0.4)";
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgb(84, 10, 10)"
        ctx.rect(rect.x, rect.y, rect.w, rect.h);
        ctx.stroke();

        var posHandle1 = point(0, 0);
        var posHandle2 = point(0, 0);
        var posHandle3 = point(0, 0);
        var posHandle4 = point(0, 0);


        posHandle1.x = rect.x + rect.w / 2;
        posHandle1.y = rect.y;

        posHandle2.x = rect.x;
        posHandle2.y = rect.y + rect.h / 2;

        posHandle3.x = rect.x + rect.w / 2;
        posHandle3.y = rect.y + rect.h;

        posHandle4.x = rect.x + rect.w;
        posHandle4.y = rect.y + rect.h / 2;



        ctx.beginPath();

        ctx.fillStyle = "#fce8e8"
        ctx.fillRect(posHandle1.x-littleSquareSide/2, posHandle1.y-littleSquareSide/2, littleSquareSide, littleSquareSide);
        ctx.fillRect(posHandle2.x-littleSquareSide/2, posHandle2.y-littleSquareSide/2, littleSquareSide, littleSquareSide);
        ctx.fillRect(posHandle3.x-littleSquareSide/2, posHandle3.y-littleSquareSide/2, littleSquareSide, littleSquareSide);
        ctx.fillRect(posHandle4.x-littleSquareSide/2, posHandle4.y-littleSquareSide/2, littleSquareSide, littleSquareSide);

    }





    //transition to second screen
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

    //load button
    let input = document.getElementById("input");
    function loadOnClick() {
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
            console.log("eroare")
        }
        image.src = URL.createObjectURL(this.files[0]);

        document.getElementById("loadButton").style.opacity=0.2;
        document.getElementById("saveButton").style.opacity=1;
        document.getElementById("selectButton").style.opacity=1;
        document.getElementById("cropButton").style.opacity=1;
        document.getElementById("filterButton").style.opacity=1;
        document.getElementById("scaleButton").style.opacity=1;
        document.getElementById("textButton").style.opacity=1;
        document.getElementById("histogramButton").style.opacity=1;
        document.getElementById("eraseButton").style.opacity=1;
        input.type='';
    }
    input.onchange = loadOnClick;

    //save button
    document.getElementById("saveButton").onclick = function () {
        let newCanvas = document.createElement('canvas');
        newCanvas.width = newWidth;
        newCanvas.height = newHeight;

        let newContext = newCanvas.getContext("2d");
        newContext.drawImage(canvas, positionX, positionY, newWidth, newHeight, 0, 0, newWidth, newHeight);

        let downloadLink = document.createElement('a');
        downloadLink.download = 'rogobo' + (downloadCount++) + '.png';
        downloadLink.href = newCanvas.toDataURL();
        downloadLink.click();
    }

    //select button
    document.getElementById("selectButton").onclick = function () {
        if (currentlySelecting) {
            ctx.putImageData(imgData, 0, 0);
            currentlySelecting = false;
        }
        else {
            imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            currentlySelecting = true;

            // ctx.fillStyle = "rgb(84, 10, 10, 0.2)"
            // ctx.fillRect(0, 0, canvas.width, canvas.height);

            // ctx.lineWidth = 5;
            // ctx.strokeStyle = "rgb(84, 10, 10)"
            // ctx.rect(0, 0, canvas.width, canvas.height);
            // ctx.stroke();

            // x = (canvas.width - littleSquareSide) / 2;
            // y = -littleSquareSide / 2;
            // ctx.fillStyle = "#fce8e8"
            // ctx.fillRect((canvas.width - littleSquareSide) / 2, -littleSquareSide / 2, littleSquareSide, littleSquareSide);
            // ctx.fillRect(canvas.width - littleSquareSide / 2, (canvas.height - littleSquareSide) / 2, littleSquareSide, littleSquareSide);
            // ctx.fillRect((canvas.width - littleSquareSide) / 2, canvas.height - littleSquareSide / 2, littleSquareSide, littleSquareSide);
            // ctx.fillRect(-littleSquareSide / 2, (canvas.height - littleSquareSide) / 2, littleSquareSide, littleSquareSide);

            init();
            draw();

        }
    }
}