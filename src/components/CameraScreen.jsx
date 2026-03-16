import { useEffect, useRef, useState } from "react";

function CameraScreen({ onBack, onSend }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");

  async function startCamera() {
    const s = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
      audio: false,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = s;
    }
    setStream(s);
  }

  function stopCamera() {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
  }

  useEffect(() => {
    if (!photo) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [photo, facingMode]);

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    setPhoto(canvas.toDataURL("image/png"));
    stopCamera();
  }

  function handleBack() {
    stopCamera();
    onBack();
  }

  return (
    <div className="camera">
      {/* HEADER */}
      <div className="cam-header">
        <button onClick={handleBack}>←</button>
        <span>Camera</span>
        <button
          onClick={() =>
            setFacingMode(f => (f === "user" ? "environment" : "user"))
          }
        >
          🔄
        </button>
      </div>

      {photo ? (
        /* PREVIEW */
        <div className="photo-preview">
          <img src={photo} alt="preview" />

          <div className="preview-actions">
            <button onClick={() => setPhoto(null)}>Retake</button>
            <button onClick={() => onSend(photo)}>Send</button>
          </div>
        </div>
      ) : (
        <>
          {/* LIVE CAMERA */}
          <div className="cam-preview">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="cam-video"
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>

          {/* SHUTTER */}
          <div className="cam-footer">
            <div className="cam-shutter" onClick={capture}></div>
          </div>
        </>
      )}
    </div>
  );
}

export default CameraScreen;
