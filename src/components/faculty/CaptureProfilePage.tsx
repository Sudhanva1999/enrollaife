import React, { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

// fugu functionality to use hardware api
// i am using my laptop camera to get the video stream and capture the phototo be use for profile photo
const CaptureProfilePage = ({ onCaptureImage }: { onCaptureImage: (image: string) => void }) => {
    // maintaining the states and variables used in the code
    const [image, setImage] = useState<File | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isImageCaptured, setIsImageCaptured] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
    // to start the camera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {facingMode: 'environment', // This enables front camera
            width: { ideal: 1280 },
            height: { ideal: 720 }} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setIsCameraActive(true);
      } catch (err) {
        console.error('Error accessing camera: ', err);
      }
    };
  
    // to stop the camera
    const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    };
  
    useEffect(() => {
      startCamera();
      return () => {
        stopCamera();
      };
    }, []);
  
    // functionality to retake the photo if it is not what user wants
    const retake = async (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent event bubbling
      stopCamera();
      setIsImageCaptured(false);
      setImage(null);
      await startCamera();
    };
  
    // functionality to capture image
    const captureImage = (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation(); // Prevent event bubbling
      
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], 'profile_picture.png', { type: 'image/png' });
              setImage(file);
              setIsImageCaptured(true);
              onCaptureImage(URL.createObjectURL(file));
              stopCamera();
            }
          }, 'image/png');
        }
      }
    };
  
    // the tsx component
    return (
      <div className="camera-container" onClick={(e) => e.stopPropagation()}>
        <h2>Capture Your Profile Picture</h2>
        
        <div className="preview-container">
          {!isImageCaptured ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                width="320" 
                height="240" 
                style={{width: '100%',
                    maxWidth: '320px',
                    transform: 'scaleX(-1)' // Mirror effect for front camera
                  }}  />
              {isCameraActive && (
                <button 
                  onClick={captureImage}
                >
                  Capture Image
                </button>
              )}
            </>
          ) : (
            <>
              {image && (
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="Preview" 
                  width="320" 
                  height="240" 
                />
              )}
              <button 
                className="retake-button"
                onClick={retake}
              >
                Retake Photo
              </button>
            </>
          )}
        </div>
  
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  };
  
  export default CaptureProfilePage;