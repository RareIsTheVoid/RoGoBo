window.onload = function() {

    //setting up canvas
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    document.getElementById("getStartedButton").onclick = () => {

        //transition to second screen
        document.getElementById("title").style.fontSize="50px";
        document.getElementById("description").remove()
        let getStartedButton = document.getElementById("getStartedButton");
        getStartedButton.remove();
        document.getElementById("authorLink").remove();
        document.getElementById("canvasContainer").style.display="block";
        document.getElementById("editButtons").style.display="flex";
        document.getElementById("editButtons").style.flexDirection="row";

        ctx.fillStyle="white"
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    input.onchange = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle="white"
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let image = new Image();
        image.onload = function() {

            let ratio = image.width / image.height;
            let newWidth = canvas.width;
            let newHeight = newWidth / ratio;
            if (newHeight > canvas.height) {
                newHeight = canvas.height;
                newWidth = newHeight * ratio;
            }

            let positionX = (canvas.width - newWidth)/2;
            let positionY = (canvas.height - newHeight)/2;

            ctx.drawImage(image, positionX, positionY, newWidth, newHeight);
        }
        image.src=URL.createObjectURL(this.files[0]);
    }
}

