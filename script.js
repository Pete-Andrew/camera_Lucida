const pauseButton = document.getElementById('pause-button');

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

// Start with the default camera
startCamera(currentFacingMode);
