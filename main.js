/**
TODO
**/


// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/ptzjyXSV/';
  
// Video
let video;
var constraints = { video: { facingMode: "user" }, audio: false };

// To store the classification
let label = "";
var topLabel = "";

//Perform scan
var scanOn = false;
var scanCount = 0;
var scanResults = [];

//variables to store window information
var windowWidth, windowHeight;

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
	//initialize window width and height variables
	windowWidth = window.innerWidth;
	console.log(window.innerWidth);
	windowHeight = window.innerHeight;
	console.log(window.innerHeight);
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('jssketch');
	// Create the video
	video = createCapture(VIDEO);
	video.hide()
	//watch for screen resize
	window.addEventListener("resize", function(){
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
		resizeCanvas(windowWidth, windowHeight);
	});	
}

function draw() {
  	background(255);
  	// Draw the video, resizing depending on window size
	if(windowWidth < windowHeight) {
  		image(video, 0, 0, windowWidth, video.height*windowWidth/video.width);
	} else {
		image(video, 0, 0, video.width*windowHeight/video.height, windowHeight);
	}
	// Draw the label
	/**fill(0);
	textSize(16);
	textAlign(CENTER);
	text(topLabel, width / 2, height - 4);**/
	//adds scan results to a list if a scan is currently working
  if(scanOn){
	if(scanCount <= 10) {
		classifyVideo();
	} else {
		//Sort scanResults and find the mode
		scanOn = false;
		scanResults.sort();
		console.log(scanResults);
		var topCount = 1;
		var currentCount = 1;
		for(i = 1; i < scanResults.length; i++) {
			if(scanResults[i - 1] == scanResults[i]) {
				currentCount++;
			} else {
				if(currentCount > topCount) {
					topCount = currentCount;
					topLabel = scanResults[i - 1];
					currentCount = 1;
					//console.log(topLabel);
				}
			}
		}
		if(currentCount > topCount) {
			topCount = currentCount;
			topLabel = scanResults[i - 1];
		}
		//Change text based on label
		if(label == "Courthouse") {
			document.getElementById("info").innerHTML = "Harrisonburg Rockingham Courthouse<br>80 Court Square";
		} else if(label == "Capital Ale House") {
			document.getElementById("info").innerHTML = label;
		} else if(label == "Larkin Arts") {
			document.getElementById("info").innerHTML = "Denton Building<br>61 Court Square<br>Currently Larkin Arts";
		} else if(label == "Bank") {
			document.getElementById("info").innerHTML = "57 S Main Street<br>Currently Pendleton Community Bank";
		} else if(label == "HCPS") {
			document.getElementById("info").innerHTML = "1 Court Square<br>Currently Harrisonburg City Public Schools";
		} else if(label == "Judicial Center") {
			document.getElementById("info").innerHTML = label;
		} else if(label == "Springhouse") {
			document.getElementById("info").innerHTML = label;
		} else if(label == "Church") {
			document.getElementById("info").innerHTML = label;
		} else if(label == "Nexus") {
			document.getElementById("info").innerHTML = label;
		} else if(label == "Brick Building") {
			document.getElementById("info").innerHTML = label;
		} else {
			document.getElementById("info").innerHTML = label + ", no information recorded";
		}
		//document.getElementById("info").innerHTML = label;
	}
	scanCount++;
  }
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(video, gotResult);
}

// When we get a result
function gotResult(error, results) {
	// If there is an error
	if (error) {
		console.error(error);
	return;
	}
	// The results are in an array ordered by confidence.
	console.log(results[0]);
	label = results[0].label;
	scanResults.push(label);//I found that in order to collect data every time I had to put this here
}

//function triggered when scan button is pressed
function scan() {
	scanOn = true;
	scanCount = 0;
	scanResults = [];
	classifyVideo();
}
