//Old js

(async function() {
    const video = document.getElementById('camera-feed');

    try {
        // Request access to the camera
        const stream = await navigator.mediaDevices.getUserMedia({
            
            //need to put in a toggle button so that the camera can switch between input cameras. 
            
            video: true,
            
            // video: {
            //     facingMode: { exact: 'environment' }
            // },
            
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
    }
})();

