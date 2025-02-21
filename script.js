const pauseButton = document.getElementById('pause-button');
const cameraFeed = document.getElementById('camera-feed');
const cameraFeedContainer = document.getElementById('camera-container');
const overlayImage = document.getElementById('overlayImg');
const refreshBtn = document.getElementById('refresh');
const slider = document.getElementById('slider');
const imageUploadBtn = document.getElementById('imageUploadBtn');
let opacity;

//slider evert listener, lets you change the opacity of the overlay image. 
slider.addEventListener("input", function (){
    opacity = parseFloat(this.value)/100; //opacity range is 0-1, slider range is 0-100.
    console.log(opacity);
    overlayImage.style.opacity = opacity;
})

//image upload button
imageUploadBtn.addEventListener('click', function() {
    // Create a new file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; // indicates that it is a file input element.
    fileInput.accept = 'image/*'; //restrict the file input to only accept image files
    console.log("input image button clicked")
  
    // Trigger the file input click event programmatically
    fileInput.click(); //This opens the file selection dialog
  
    //An event listener is added to the file input element. This event listener is triggered when the user selects a file.
    fileInput.addEventListener('change', function(event) {
      const file = event.target.files[0]; //the selected file is accessed using this line
      if (file) {
        const img = new Image(); //creates a new Image using a constructor
        img.src = URL.createObjectURL(file); //This creates a temporary URL for the file. As the HTML element is a img you can set its src file.

        const videoFeedWidth = cameraFeedContainer.offsetWidth;
        const videoFeedHeight = cameraFeedContainer.offsetHeight;
        
        widthVHeight(videoFeedHeight, videoFeedWidth);

        img.onload = function () { //when the img is loaded, get it's width/height properties. 

           
            const uploadedImgWidth = img.naturalWidth;
            const uploadedImgHeight = img.naturalHeight;
            console.log(`Image dimensions: ${uploadedImgHeight} x ${uploadedImgWidth}`);
            
        if(uploadedImgWidth > uploadedImgHeight) {
            console.log("img width > height")
            //uploadedImgHeight = videoFeedHeight;
            //need to scale the img here     
        }
        };


        //replace the overlayImg
        overlayImage.src = img.src; 
        
      }
    });
  });

  function widthVHeight (height, width) {
    console.log(`Video feed width: ${width} px X height: ${height} px`)
  }

//Bug: 
// get camera feed dimensions
// set up width/height rule so the uploaded image best fits the space. 
// Prevent upload image stretching
// be able to distort image?

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

//Commented out as there is no need to switch camera view on the phone
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
