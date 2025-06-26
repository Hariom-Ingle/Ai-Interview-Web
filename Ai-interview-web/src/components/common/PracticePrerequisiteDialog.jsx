import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'; // Added AlertCircle icon

export default function PracticePrerequisiteDialog({ open, onOpenChange, onStartPractice, onGoBack }) {
  const [cameraStatus, setCameraStatus] = useState(null); // null: checking, true: granted, false: denied
  const [micStatus, setMicStatus] = useState(null); // null: checking, true: granted, false: denied
  const [videoStream, setVideoStream] = useState(null);
  const [permissionError, setPermissionError] = useState(null); // State to hold specific error messages
  const videoRef = useRef(null);

  /**
   * Stops the active media stream (camera and microphone tracks).
   */
  const stopVideoStream = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clear the video element source
      }
      setVideoStream(null);
      console.log("Media stream stopped.");
    }
  };

  /**
   * Checks camera and microphone permissions and initializes media devices.
   */
  const checkPermissions = async () => {
    setCameraStatus(null); // Reset status to checking
    setMicStatus(null);    // Reset status to checking
    setPermissionError(null); // Clear previous errors
    stopVideoStream(); // Stop any existing stream before trying a new one

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setVideoStream(stream);
      setCameraStatus(true);
      setMicStatus(true);
      console.log("Camera and microphone access granted.");
    } catch (err) {
      console.error("Permission error:", err);
      setCameraStatus(false);
      setMicStatus(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError("Camera and microphone access denied. Please enable permissions in your browser settings.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionError("No camera or microphone found. Please ensure devices are connected and enabled.");
      } else if (err.name === 'NotReadableError' || err.name === 'OverconstrainedError') {
        setPermissionError("Camera/microphone is in use by another application or not accessible.");
      } else {
        setPermissionError(`An unknown error occurred: ${err.message}.`);
      }
    }
  };

  // Effect to manage stream lifecycle when dialog opens/closes
  useEffect(() => {
    if (open) {
      checkPermissions(); // Start checking permissions when dialog opens
    } else {
      stopVideoStream(); // Stop stream when dialog closes
    }

    // Cleanup function: This runs when the component unmounts or when 'open' changes
    return () => {
      stopVideoStream(); // Ensure stream is stopped on component unmount
    };
  }, [open]); // Dependency array: run when 'open' prop changes

  // Determine if 'START PRACTICE' button should be enabled
  const canStartPractice = cameraStatus === true && micStatus === true;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-5xl bg-white p-6 rounded-xl border border-blue-100 shadow-md">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle className="text-blue-800 text-2xl font-semibold">Practice Prerequisite</DialogTitle>
          {/* EVALUATION CRITERIA button - kept as is */}
          <Button variant="outline" className="text-blue-700 border-blue-300 hover:bg-blue-50 text-sm px-4 py-2 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 block" />
            EVALUATION CRITERIA
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Compatibility Check Section */}
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 shadow-sm">
            <h3 className="text-blue-800 text-lg font-semibold mb-4">Compatibility Test</h3>
            <div className="relative w-full h-48 bg-gray-900 rounded-md flex items-center justify-center mb-4 overflow-hidden">
              {cameraStatus === null ? (
                <div className="text-white text-lg flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                  Checking devices...
                </div>
              ) : cameraStatus === true ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover transform scaleX(-1)" // Added transform for selfie view
                />
              ) : (
                <span className="text-5xl text-white">🚫🎥</span> // Emoji for no camera
              )}
            </div>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-center gap-2">
                {cameraStatus === true ? (
                  <CheckCircle2 className="text-green-500" />
                ) : cameraStatus === false ? (
                  <XCircle className="text-red-500" />
                ) : (
                  <AlertCircle className="text-yellow-500" /> // Icon for checking
                )}
                {cameraStatus === true ? 'Camera is enabled.' : cameraStatus === false ? 'Camera not accessible.' : 'Checking camera...'}
              </li>
              <li className="flex items-center gap-2">
                {micStatus === true ? (
                  <CheckCircle2 className="text-green-500" />
                ) : micStatus === false ? (
                  <XCircle className="text-red-500" />
                ) : (
                  <AlertCircle className="text-yellow-500" /> // Icon for checking
                )}
                {micStatus === true ? 'Microphone is enabled.' : micStatus === false ? 'Microphone not accessible.' : 'Checking microphone...'}
              </li>
            </ul>
            {permissionError && (
              <p className="text-red-600 text-sm mt-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {permissionError}
              </p>
            )}
            <Button
              onClick={checkPermissions}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
            >
              RECHECK DEVICES
            </Button>
          </div>

          {/* Instructions Section */}
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 shadow-sm">
            <h3 className="text-blue-800 text-lg font-semibold mb-4">Interview Practice Instructions</h3>
            <div className="relative w-full h-48 bg-blue-100 rounded-md flex items-center justify-center mb-4">
              <span className="text-5xl">👨‍💼</span>
              <Button className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm">
                ▶ START ANSWER
              </Button>
            </div>
            <ol className=" list-inside text-blue-700 text-sm space-y-2">
              <li> <strong>1.</strong> Click on 'Start Recording' to begin speaking your answer. Click 'Stop Recording' when finished.</li>
              <li><strong>2.</strong> You can choose to 'Type Answer' if you prefer not to use your voice.</li>
              <li><strong>3.</strong> After submitting your answer, click 'Next Question' to proceed.</li>
              <li><strong>4.</strong> Answer all questions to generate your detailed feedback report.</li>
              <li><strong>5.</strong> Headphones are recommended for optimal audio quality during voice recording.</li>
            </ol>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-sm"
            onClick={onStartPractice}
            disabled={!canStartPractice} // Disable if camera/mic not ready
          >
            START PRACTICE
          </Button>
          <Button
            variant="ghost"
            className="text-blue-700 hover:bg-blue-100 px-6 py-3 rounded-lg"
            onClick={() => {
              if (onGoBack) onGoBack(); // callback to parent if needed
              onOpenChange(false);      // properly closes the dialog
            }}
          >
            GO BACK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}