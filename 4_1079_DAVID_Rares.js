window.onload = function() {

    document.getElementById("getStartedButton").onclick = () => {
        //transition to second screen
        document.getElementById("title").style.fontSize="50px";
        document.getElementById("description").remove()
        var getStartedButton = document.getElementById("getStartedButton");
        getStartedButton.remove();
        document.getElementById("authorLink").remove();


        //creating canvas
        var canvas = document.createElement("Canvas");
        var ctx = canvas.getContext("2d");
        canvas.height=480;
        canvas.width=720;
        canvas.style.border="3px solid #540a0a";
        canvas.style.marginTop="5px";
        ctx.fillStyle="white"
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        document.body.append(canvas);


    }

}

