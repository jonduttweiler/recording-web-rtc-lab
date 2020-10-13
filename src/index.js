import './style.css';
//const mimeType = 'video/webm;'; <- with this doesn't work
const mimeType = 'video/webm; codecs=vp8';


let localVideo, recordedVideo,localStream, isRecording;

window.addEventListener("load", async function () {
  console.log(`loaded at: ${new Date().toISOString()}`)
  localVideo = document.querySelector("#local-video");
  recordedVideo = document.querySelector("#recorded-video");

  window.localVideo = localVideo;
  window.recordedVideo = recordedVideo;

  isRecording = false;

  await captureVideo();

  //init mediaSource

  const mediaSource = new MediaSource();
  recordedVideo.src = URL.createObjectURL(mediaSource);
  var sourceBuffer;
  mediaSource.addEventListener('sourceopen', function () {
    sourceBuffer = mediaSource.addSourceBuffer(mimeType);
    console.log(sourceBuffer);
  })

  //init mediaRecorder
  const mediaRecorder = new MediaRecorder(localStream, {mimeType});
  mediaRecorder.ondataavailable = e => {
    
    const reader = new FileReader();
    reader.onload = x => sourceBuffer.appendBuffer(new Uint8Array(x.target.result));
    reader.readAsArrayBuffer(e.data);

    if (recordedVideo.paused) {
        recordedVideo.play(0); // Start playing after 1st chunk is appended.
    }
  };

  mediaRecorder.start(1000);

});

async function captureVideo() {
  if (navigator.mediaDevices) {
    const constraints = { audio: false, video: true };
    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    localVideo.srcObject = localStream;
  }
}

