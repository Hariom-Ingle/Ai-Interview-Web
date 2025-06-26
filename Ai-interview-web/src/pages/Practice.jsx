import { Button } from '@/components/ui/button'; // Assuming you have a Button component from ShadCN UI
import { ArrowLeftRight, MessageSquareText, Mic, RotateCcw, X } from 'lucide-react'; // Added RotateCcw icon
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import PracticePrerequisiteDialog from '../components/common/PracticePrerequisiteDialog';

function Practice() {
    const { interviewId } = useParams();
    const [isPrerequisiteDialogOpen, setIsPrerequisiteDialogOpen] = useState(true);
    const [interviewQuestions, setInterviewQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [error, setError] = useState(null);
    const [userTranscript, setUserTranscript] = useState('');
    const [showAnswerInput, setShowAnswerInput] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false); // Indicates if an answer has been submitted for the current question
    const [interviewerVideoReady, setInterviewerVideoReady] = useState(false);
    const [isUserVideoMain, setIsUserVideoMain] = useState(false);

    const userVideoElementRef = useRef(null);
    const interviewerVideoElementRef = useRef(null);
    const [userStream, setUserStream] = useState(null);
    const navigate = useNavigate();

    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable,
        resetTranscript
    } = useSpeechRecognition();

    // Update local userTranscript state with real-time speech recognition transcript
    useEffect(() => {
        setUserTranscript(transcript);
    }, [transcript]);

    // Handle browser and microphone support
    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            setError("Your browser doesn't support speech recognition. Please try Chrome or Edge.");
        } else if (!isMicrophoneAvailable) {
            setError("Microphone not found or permission denied. Please check your microphone settings.");
        }
    }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

    const initializeMediaDevices = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setUserStream(stream);
            console.log("User media devices initialized.");
            setInterviewerVideoReady(true);
        } catch (err) {
            console.error("Error accessing media devices:", err);
            setError("Please allow camera and microphone access to continue the interview.");
            setIsPrerequisiteDialogOpen(true);
            return false;
        }
        return true;
    };

    const handleStartPractice = async () => {
        setIsPrerequisiteDialogOpen(false);
        console.log(`User confirmed. Attempting to initialize media and fetch questions for interview ID: ${interviewId}`);
        const mediaReady = await initializeMediaDevices();
        if (mediaReady) {
            fetchInterviewQuestions(interviewId);
        }
    };

    useEffect(() => {
        if (userVideoElementRef.current && userStream) {
            userVideoElementRef.current.srcObject = userStream;
        }
    }, [userStream]);

    useEffect(() => {
        if (interviewerVideoElementRef.current && interviewerVideoReady) {
            // Logic for interviewer video, if any
        }
    }, [interviewerVideoReady]);

    useEffect(() => {
        if (!isPrerequisiteDialogOpen && interviewId && !interviewQuestions.length && interviewerVideoReady && !loadingQuestions) {
            fetchInterviewQuestions(interviewId);
        }
    }, [isPrerequisiteDialogOpen, interviewId, interviewQuestions.length, interviewerVideoReady, loadingQuestions]);

    const fetchInterviewQuestions = async (id) => {
        setLoadingQuestions(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/api/interview/questions/${id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch interview questions.');
            }
            const data = await response.json();
            setInterviewQuestions(data.questions);
            setLoadingQuestions(false);
            console.log('Fetched questions:', data.questions);
        } catch (err) {
            console.error('Error fetching questions:', err);
            setError(err.message);
            setLoadingQuestions(false);
        }
    };

    // Cleanup media streams and speech recognition on component unmount
    useEffect(() => {
        return () => {
            if (userStream) {
                userStream.getTracks().forEach(track => track.stop());
            }
            SpeechRecognition.stopListening();
        };
    }, [userStream]);

    

    // --- Speech Recognition Functions --- //
    const startSpeechRecognition = () => {
        if (browserSupportsSpeechRecognition && isMicrophoneAvailable) {
            resetTranscript(); // Clear previous transcript from internal API buffer
            setUserTranscript(''); // Clear displayed transcript
            SpeechRecognition.startListening({ continuous: true });
            console.log("Speech recognition started.");
        } else {
            setError("Speech recognition is not available or microphone access denied.");
        }
    };

    const stopSpeechRecognition = () => {
        SpeechRecognition.stopListening();
        console.log("Speech recognition stopped. Transcript captured but not yet submitted.");
        // The transcript is now in `userTranscript` state, waiting for submission
    };

    // This function now explicitly sends the transcript to the backend
    const recordAnswer = async (answerText) => {
        const currentQuestion = interviewQuestions[currentQuestionIndex];
        if (!currentQuestion) {
            setError("No current question to record answer for.");
            return;
        }
        console.log("Sending answer to backend:", answerText);

        try {
            const response = await fetch('http://localhost:5000/api/interview/record-answer-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    interviewId: interviewId,
                    questionText: currentQuestion.question,
                    transcript: answerText,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to record answer.');
            }

            const data = await response.json();
            console.log('Answer recorded successfully:', data);
            setHasAnswered(true); // Answer has been submitted
            // Optionally display feedback here (data.userAnswer.feedback, data.userAnswer.rating)
        } catch (err) {
            console.error('Error recording answer:', err);
            setError(err.message);
        }
    };

    const handleVoiceSubmit = async () => {
        if (listening) { // Ensure recording is stopped before submitting
            SpeechRecognition.stopListening();
        }
        if (userTranscript.trim() !== '') {
            await recordAnswer(userTranscript);
        } else {
            setError("No speech detected to submit.");
        }
    };

    const handleTextSubmit = async () => {
        if (userTranscript.trim() !== '') {
            await recordAnswer(userTranscript);
        } else {
            setError("Please type your answer to submit.");
        }
    };

    const handleRerecord = () => {
        SpeechRecognition.stopListening(); // Stop any ongoing listening
        resetTranscript(); // Clear internal transcript
        setUserTranscript(''); // Clear displayed transcript
        setHasAnswered(false); // Allow re-answering
        setError(null); // Clear any previous errors
        console.log("Re-record initiated. Transcript cleared.");
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < interviewQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setUserTranscript(''); // Clear transcript for next question
            setShowAnswerInput(false); // Reset answer input visibility
            setHasAnswered(false); // Reset answered state for the new question
            SpeechRecognition.stopListening(); // Ensure listening is stopped
            resetTranscript(); // Clear internal transcript for new question
        } else {
            console.log("Interview Finished!");
            // Handle interview completion (e.g., show summary, navigate to results page)

            console.log("navigare",`/feedback/${interviewId}`)
        navigate(`/feedback/${interviewId}`);

        }
    };

    const handleExitInterview = () => {
        if (userStream) {
            userStream.getTracks().forEach(track => track.stop());
        }
        SpeechRecognition.stopListening();
        console.log("Exiting interview.");
        // Example: navigate('/');
        navigate('/dashboard')
    };

    const handleCameraSwap = () => {
        setIsUserVideoMain(prevState => !prevState);
    };

    const currentQuestion = interviewQuestions[currentQuestionIndex];

    return (
        <div className="flex h-screen bg-gray-100">
            <PracticePrerequisiteDialog
                open={isPrerequisiteDialogOpen}
                onOpenChange={setIsPrerequisiteDialogOpen}
                onStartPractice={handleStartPractice}
                interviewId={interviewId}
            />

            {!isPrerequisiteDialogOpen && (
                <>
                    {/* Left Section (Main Interview Area) */}
                    <div className="flex-1 p-8 flex flex-col items-center justify-between">
                        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg ">
                            {/* Main Video Area */}
                            <div className="relative w-full h-96 bg-gray-800 flex items-center justify-center rounded-xl  *:">
                                {isUserVideoMain ? (
                                    userStream ? (
                                        <video ref={interviewerVideoElementRef} className="w-full h-full object-cover transform scaleX(-1)" autoPlay playsInline muted></video>
                                    ) : (
                                        <div className="text-white text-xl">Waiting for your camera...</div>
                                    )
                                ) : (
                                    interviewerVideoReady ? (
                                        <video ref={userVideoElementRef} className="w-full h-full object-cover rounded-xl" autoPlay muted playsInline></video>
                                    ) : (
                                        <div className="text-white text-xl">Loading Interviewer Video...</div>
                                    )
                                )}
                            </div>

                            {/* Question and Controls */}
                            <div className="p-6 h-auto bg-blue-50">
                                <div className="text-sm text-gray-600 mb-2">Main Question</div>
                                {loadingQuestions ? (
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Loading questions...</h2>
                                ) : error ? (
                                    <h2 className="text-xl font-semibold text-red-500 mb-4">Error: {error}</h2>
                                ) : interviewQuestions.length === 0 ? (
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">No questions found for this interview.</h2>
                                ) : (
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                        {currentQuestion ? currentQuestion.question : 'Interview ready, but no question to display.'}
                                    </h2>
                                )}

                                {!hasAnswered && !loadingQuestions && interviewQuestions.length > 0 && (
                                    <>
                                        <div className="flex space-x-4 mb-4">
                                            <Button
                                                className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-200 ${listening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                                onClick={listening ? stopSpeechRecognition : startSpeechRecognition}
                                                disabled={showAnswerInput || !browserSupportsSpeechRecognition || !isMicrophoneAvailable}
                                            >
                                                <Mic className="mr-2 h-5 w-5" />
                                                {listening ? 'Stop Recording' : 'Start Recording (Voice)'}
                                            </Button>
                                            <Button
                                                className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-200 ${showAnswerInput ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                                                onClick={() => {
                                                    setShowAnswerInput(!showAnswerInput);
                                                    if (listening) {
                                                        SpeechRecognition.stopListening(); // Stop voice recording if switching to text
                                                    }
                                                }}
                                                disabled={listening} // Disable if voice recording is active
                                            >
                                                <MessageSquareText className="mr-2 h-5 w-5" />
                                                {showAnswerInput ? 'Hide Text Input' : 'Type Answer'}
                                            </Button>
                                        </div>

                                        {/* Display current transcript from speech recognition */}
                                        {listening && (
                                            <p className="mt-2 text-gray-700 text-sm">Listening: {transcript}</p>
                                        )}

                                        {/* Submit button for voice input */}
                                        {!listening && userTranscript.trim() !== '' && !showAnswerInput && (
                                            <div className="  items-center mt-4">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                                                        onClick={handleVoiceSubmit}
                                                    >
                                                        Submit Voice Answer
                                                    </Button>
                                                    <Button
                                                        className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-md"
                                                        onClick={handleRerecord}
                                                    >
                                                        <RotateCcw className="mr-2 h-4 w-4" /> Re-record
                                                    </Button>
                                                <div className="text-blue-700 text-sm italic font-medium"> <strong >Your Answer :-</strong> "{userTranscript}"</div>
                                                </div>
                                            </div>
                                        )}

                                        {showAnswerInput && (
                                            <div className="mt-4">
                                                 
                                                <div className="flex justify-end space-x-2 mt-2">
                                                    <Button
                                                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                                                        onClick={handleTextSubmit}
                                                        disabled={userTranscript.trim() === ''}
                                                    >
                                                        Submit Text Answer
                                                    </Button>
                                                    <Button
                                                        className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-md"
                                                        onClick={handleRerecord}
                                                        disabled={userTranscript.trim() === ''} // Disable if nothing to re-record
                                                    >
                                                        <RotateCcw className="mr-2 h-4 w-4" /> Clear/Re-type
                                                    </Button>

                                                </div>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    rows="4"
                                                    placeholder="Type your answer here..."
                                                    value={userTranscript}
                                                    onChange={(e) => setUserTranscript(e.target.value)}
                                                ></textarea>
                                            </div>
                                        )}
                                         {/* Display current transcript from speech recognition */}
                                        
                                    </>
                                )}

                                {hasAnswered && !loadingQuestions && interviewQuestions.length > 0 && (
                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg"
                                            onClick={goToNextQuestion}
                                        >
                                            {currentQuestionIndex === interviewQuestions.length - 1 ? 'Finish Interview' : 'Next Question'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section (Sidebar) */}
                    <div className="w-80 bg-white p-6 shadow-lg flex flex-col justify-between">
                        <div>
                            {/* Small Video Feed */}
                            <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                {isUserVideoMain ? (
                                    interviewerVideoReady ? (
                                        <video ref={interviewerVideoElementRef} className="w-full h-full object-cover" autoPlay muted playsInline></video>
                                    ) : (
                                        <div className="text-sm text-gray-500">Loading Interviewer...</div>
                                    )
                                ) : (
                                    userStream ? ( 
                                        <video ref={interviewerVideoElementRef} className="w-full h-full object-cover transform scaleX(-1)" autoPlay playsInline muted></video>
                                    ) : (
                                        <div className="text-sm text-gray-500">Loading your camera...</div>
                                    )
                                )}
                            </div>
                            <Button
                                className="w-full mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                                onClick={handleCameraSwap}
                                disabled={!userStream}
                            >
                                <ArrowLeftRight className="mr-2 h-4 w-4" /> Swap Cameras
                            </Button>

                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Digital Marketing Specialist</h3>
                            <p className="text-gray-600 text-sm mb-4">Behavioral</p>
                            <div className="space-y-3">
                                <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">
                                    <MessageSquareText className="mr-2 h-4 w-4" /> EVALUATION CRITERIA
                                </Button>
                                <Button variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50" onClick={handleExitInterview}>
                                    <X className="mr-2 h-4 w-4" /> EXIT INTERVIEW
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Practice;