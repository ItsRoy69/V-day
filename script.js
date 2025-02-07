let video;
let canvas;
let captureBtn;
let startCameraBtn;
let complimentBox;
let currentDaySpan;
let capturedImage;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    captureBtn = document.getElementById('captureBtn');
    startCameraBtn = document.getElementById('startCamera');
    complimentBox = document.getElementById('compliment');
    currentDaySpan = document.getElementById('currentDay');
    capturedImage = document.getElementById('capturedImage');

    // Update current day
    updateCurrentDay();

    // Add event listeners
    startCameraBtn.addEventListener('click', initCamera);
    captureBtn.addEventListener('click', captureImage);
});

function updateCurrentDay() {
    const today = new Date();
    const month = today.toLocaleString('default', { month: 'short' });
    const date = today.getDate();
    const currentDate = `${month} ${date}`;
    
    const dayInfo = loveDaysData[currentDate];
    if (dayInfo) {
        currentDaySpan.textContent = `${dayInfo.name} (${currentDate})`;
        document.getElementById('dayTitle').textContent = dayInfo.name;
    } else {
        currentDaySpan.textContent = currentDate;
    }
}

async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        video.srcObject = stream;
        startCameraBtn.style.display = 'none';
        captureBtn.disabled = false;
        video.style.display = 'block';
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Unable to access camera. Please make sure you have granted camera permissions.');
    }
}

function captureImage() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageDataUrl = canvas.toDataURL('image/png');
    capturedImage.src = imageDataUrl;
    capturedImage.style.display = 'block';
    
    // Stop camera stream
    const stream = video.srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.style.display = 'none';
    
    // Show compliment
    showCompliment();
}

function showCompliment() {
    const today = new Date();
    const month = today.toLocaleString('default', { month: 'short' });
    const date = today.getDate();
    const currentDate = `${month} ${date}`;
    
    const dayInfo = loveDaysData[currentDate];
    if (dayInfo) {
        const randomCompliment = dayInfo.compliments[Math.floor(Math.random() * dayInfo.compliments.length)];
        complimentBox.textContent = randomCompliment;
        complimentBox.style.display = 'block';
    } else {
        complimentBox.textContent = "Every day is a day to celebrate love! ❤️";
        complimentBox.style.display = 'block';
    }
    
    startCameraBtn.style.display = 'block';
    startCameraBtn.textContent = 'Take Another Photo';
    captureBtn.disabled = true;
}