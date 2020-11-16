window.onload = function() {

    document.getElementById("getStartedButton").onclick = () => {
        document.getElementById("title").style.fontSize="50px";
        document.getElementById("description").remove()
        var getStartedButton = document.getElementById("getStartedButton");
        getStartedButton.remove();
        document.getElementById("authorLink").remove();

        var canvas = document.createElement("Canvas");
        var ctx = canvas.getContext("2d");
        canvas.height=450;
        canvas.width=1200;
        canvas.style.border="3px solid #540a0a";
        ctx.fillStyle="white"
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        document.body.append(canvas);
    }

}

