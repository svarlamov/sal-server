function loadPage(){
    
}
function doAudio() {
    var obj = {}, txt="";
    obj = {
        video: false,
        audio: true
    };
    txt = "<audio>";
    navigator.webkitGetUserMedia(obj, function(stream) {
        $("#result").empty();
        var output = $(txt).appendTo("#result")[0],
            source = window.webkitURL.createObjectURL(stream);
        output.autoplay = true;
        output.src = source;
        console.log(stream);
        window.a = stream; //debug
        $("span#name").html("Camera name: <b>" + stream.videoTracks[0].label + "</b><br>" + "Mic name: <b>" + stream.audioTracks[0].label + "</b>");
    }, function(err) {
        console.log(err);
        err.code == 1 && (alert("You can click the button again anytime to enable."))
    });
}

function doVideo() {
    var obj = {}, txt="";
    obj = {
        video: true,
        audio: true
    };
    txt = "<video>";
    navigator.webkitGetUserMedia(obj, function(stream) {
        $("#result").empty();
        var output = $(txt).appendTo("#result")[0],
            source = window.webkitURL.createObjectURL(stream);
        output.autoplay = true;
        output.src = source;
        console.log(stream);
        window.a = stream; //debug
        $("span#name").html("Camera name: <b>" + stream.videoTracks[0].label + "</b><br>" + "Mic name: <b>" + stream.audioTracks[0].label + "</b>");
    }, function(err) {
        console.log(err);
        err.code == 1 && (alert("You can click the button again anytime to enable."))
    });
}