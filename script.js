const pauseButton = document.getElementById('pause-button');
const cameraFeed = document.getElementById('camera-feed');
const overlayImage = document.getElementById('overlayImg');
const refreshBtn = document.getElementById('refresh');
const slider = document.getElementById('slider');
const image = document.getElementById('image');
let opacity;

//slider evert listener, lets you change the opacity of the overlay image. 
slider.addEventListener("input", function (){
    opacity = parseFloat(this.value)/100; //opacity range is 0-1, slider range is 0-100.
    console.log(opacity);
    overlayImage.style.opacity = opacity;
})

let currentFacingMode = 'user'; // Default to front camera
let paused = false;

async function startCamera(facingMode) {
    paused = false;
    pauseButton.textContent = "Pause";
    
    const video = document.getElementById('camera-feed');

    // Stop any existing video stream
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }

    try {
        // Request access to the camera with the specified facingMode
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode },
            audio: false
        });

        // Set the video element's srcObject to the camera stream
        video.srcObject = stream;

        // Play the video
        video.onloadedmetadata = () => {
            video.play();
        };
    } catch (err) {
        console.error("Error accessing the camera: ", err);
        if (err.name === 'OverconstrainedError') {
            console.error(`The requested facingMode: ${facingMode} is not available.`);
        }
    }
}

document.getElementById('toggle-camera-button').addEventListener('click', () => {
    // Toggle the facing mode
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    startCamera(currentFacingMode);
});

pauseButton.addEventListener('click', () => {
    
    pauseButton.textContent = paused ? "Pause" : "Play";
    if (paused == false) {
    paused = true;
    const video = document.getElementById('camera-feed');
    video.pause()
    console.log("video paused");

} else {
    paused = false;
    startCamera(currentFacingMode);
    console.log("video un-paused"); 
    }

});

//constrains the image to the size of the camera feed
function resizeOverlay() {
    // Get the size and position of the video element
    const rect = cameraFeed.getBoundingClientRect();
    // Apply the size and position to the overlay
    overlayImage.style.width = `${rect.width}px`;
    overlayImage.style.height = `${rect.height}px`;
    overlayImage.style.top = `${rect.top}px`;
    overlayImage.style.left = `${rect.left}px`;
    console.log("resize overlay called");
}

//BUG:
//Add an image selection button
//if image width > height set width etc. 

// Adjust the overlay size whenever the window resizes
window.addEventListener('resize', resizeOverlay);

// Call the function initially to set the overlay size
resizeOverlay();

console.log("cameraFeed offsetHeight",cameraFeed.offsetHeight);
console.log("cameraFeed offsetWidth", cameraFeed.offsetWidth);

// Start with the default camera
startCamera(currentFacingMode);
refreshBtn.addEventListener('click', resizeOverlay);
