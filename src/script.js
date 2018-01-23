window.onload = main;


function main() {
	var video = $('#webcam')[0];
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
	if (navigator.getUserMedia) {       
		navigator.getUserMedia({video: true}, handleVideo, videoError);
	}
	
	var canvas = $('#picture')[0];
	var ctx = canvas.getContext('2d');
	canvas.style.width = 640 + "px"; //window.getComputedStyle(canvas,null).getPropertyValue("width");
	canvas.style.height = 480 + "px"; //window.getComputedStyle(canvas,null).getPropertyValue("height");
	ctx.fillStyle = 'grey';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	var x = canvas.width / 2;
    var y = canvas.height / 2;
	
	ctx.font = '30pt Roboto';
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.fillText('Please take a picture :)', x, y);
	
	if(!pic.img) {
		$('#picture')[0].style.display = "none";
		$('#colors')[0].style.display = "none";
	} else {
		$('#picture')[0].style.display = "inline";
		$('#colors')[0].style.display = "inline";

	}
	
	//Add Event Listener for Device Orientation
	if (window.DeviceOrientationEvent) {
		
		window.addEventListener("deviceorientation", function(event) 
		{
			var accelColor = $('#colorModeAccelerometer')[0].checked;
			if (!accelColor) return;
			var hue = Math.round(event.alpha);
			if (hue < 0) hue = 360 + hue;
			hue = hue % 360;
			var saturation = Math.round(map_range(event.gamma, -90, 90, 0, 100)); //-90 - 90
			var lightness = Math.round(map_range(event.beta, -180, 180, 0, 100)); //-180 - 180
			var alpha = $('#alpha')[0].value;
			
			var colorEnabled = $('#colorEnabled')[0].checked;
			var color = colorEnabled ? "hsla(" + hue + "," + saturation + "%," + lightness + "%," + alpha + ")" : "rgba(0,0,0,0)";
			var canvas = setColor(color);
			
			var dlButton = $('#download-button')[0];
			dlButton.href = canvas.toDataURL('image/jpeg');
			dlButton.style.display = 'block';
		}, true);
		
		
	}
}
 
function handleVideo(stream) {
	var video = $('#webcam')[0];
	var canvas = $('#picture')[0];
	var page = $('#page')[0];
	video.addEventListener( "loadedmetadata", function (e) {
		video.style.height = "100%"
		video.style.width = "100%"
		canvas.style.height = "100%"
		canvas.style.width = "100%"
		page.style.maxWidth = video.videoWidth + "px";
	}, false);
	
    video.src = window.URL.createObjectURL(stream);
    video.play();
	
}
 
function videoError(e) {
    // do something
}

//https://codepen.io/dudleystorey/pen/wavpGe


var pic = {
	takePicture: function(video) {
		pic.frame = captureVideoFrame(video,'jpeg');
		console.log("Picture has been taken");
		
		var canvas = $('#picture')[0];
		canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
		
		var context = canvas.getContext('2d');

        // load image from data url
        pic.img = new Image();
        pic.img.onload = function() {
			console.log("Image has been loaded, displaying...");
			context.drawImage(this, 0, 0);
			changeColor();
        };
		pic.img.src = pic.frame.dataUri;
		$('#picture')[0].style.display = "inline";
		$('#colors')[0].style.display = "inline";
		
		var bodi = $('html, body');
		bodi.animate({
        scrollTop: $("#picture").offset().top
		}, 500);
      }
      /*
      // make ajax call to get image data url
      var request = new XMLHttpRequest();
      request.open('GET', 'https://www.html5canvastutorials.com/demos/assets/dataURL.txt', true);
      request.onreadystatechange = function() {
        // Makes sure the document is ready to parse.
        if(request.readyState == 4) {
          // Makes sure it's found the file.
          if(request.status == 200) {
            loadCanvas(request.responseText);
          }
        }
      };
      request.send(null);
	  */
};
function setColor(color) {
	var canvas = $('#picture')[0]
	if(!pic.img) return canvas;
	var context = canvas.getContext('2d');
	//clear pic
	context.clearRect(0, 0, canvas.width, canvas.height);
	//redraw pic
	context.drawImage(pic.img, 0, 0);
	
	context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
	return canvas;

}

function changeColor() {
	var rgb = hexToRgb($('#color')[0].value);
	var alpha = $('#alpha')[0].value;
	var colorEnabled = $('#colorEnabled')[0].checked;
	if (colorEnabled) {
		$('#colorComplete')[0].style.display = 'block';
	} else {
		$('#colorComplete')[0].style.display = 'none';
	}
	var staticColor = $('#colorModeStatic')[0].checked;
	var accelColor = $('#colorModeAccelerometer')[0].checked;
	
	if (staticColor){
		$('#colorPicker')[0].style.display = "block";
	} else {
		$('#colorPicker')[0].style.display = "none";
	}
	
	if (staticColor){
		var color = colorEnabled ? "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + alpha + ")" : "rgba(0,0,0,0)";
		var canvas = setColor(color);
		
		var dlButton = $('#download-button')[0];
		dlButton.href = canvas.toDataURL('image/jpeg');
		dlButton.style.display = 'block';
	}
}


//https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function map_range(val, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (val - low1) / (high1 - low1);
}
