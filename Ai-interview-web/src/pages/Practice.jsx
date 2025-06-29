import { Button } from '@/components/ui/button';
import { ArrowLeftRight, MessageSquareText, Mic, RotateCcw, X, Volume2 } from 'lucide-react'; // Import Volume2 icon
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import PracticePrerequisiteDialog from '../components/common/PracticePrerequisiteDialog';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

// Import your placeholder image
import interviewerPlaceholderImage from '../assets/interviewer.png';

function Practice() {
    const { interviewId } = useParams();
    const [isPrerequisiteDialogOpen, setIsPrerequisiteDialogOpen] = useState(true);
    const [interviewQuestions, setInterviewQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [error, setError] = useState(null);
    const [userTranscript, setUserTranscript] = useState('');
    const [showAnswerInput, setShowAnswerInput] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isUserVideoMain, setIsUserVideoMain] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false); // New state for TTS
    const [ttsError, setTtsError] = useState(null); // New state for TTS errors

    const userVideoElementRef = useRef(null);
    const userVideoSmallElementRef = useRef(null);

    const [userStream, setUserStream] = useState(null);
    const navigate = useNavigate();

    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable,
        resetTranscript
    } = useSpeechRecognition();

    useEffect(() => {
        setUserTranscript(transcript);
    }, [transcript]);

    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            setError("Your browser doesn't support speech recognition. Please try Chrome or Edge.");
        } else if (!isMicrophoneAvailable) {
            setError("Microphone not found or permission denied. Please check your microphone settings.");
        }
    }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

    useEffect(() => {
        if (userStream) {
            if (isUserVideoMain && userVideoElementRef.current) {
                userVideoElementRef.current.srcObject = userStream;
                if (userVideoSmallElementRef.current) {
                    userVideoSmallElementRef.current.srcObject = null;
                }
            } else if (!isUserVideoMain && userVideoSmallElementRef.current) {
                userVideoSmallElementRef.current.srcObject = userStream;
                if (userVideoElementRef.current) {
                    userVideoElementRef.current.srcObject = null;
                }
            }
        }
    }, [userStream, isUserVideoMain]);

    const initializeMediaDevices = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setUserStream(stream);
            console.log("User media devices initialized.");
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
        if (!isPrerequisiteDialogOpen && interviewId && !interviewQuestions.length && !loadingQuestions) {
            fetchInterviewQuestions(interviewId);
        }
    }, [isPrerequisiteDialogOpen, interviewId, interviewQuestions.length, loadingQuestions]);

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

    useEffect(() => {
        return () => {
            if (userStream) {
                userStream.getTracks().forEach(track => track.stop());
            }
            SpeechRecognition.stopListening();
            // Stop any ongoing speech synthesis when component unmounts
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
        };
    }, [userStream]);

    const startSpeechRecognition = () => {
        if (browserSupportsSpeechRecognition && isMicrophoneAvailable) {
            resetTranscript();
            setUserTranscript('');
            SpeechRecognition.startListening({ continuous: true });
            console.log("Speech recognition started.");
            // Stop TTS if it's speaking
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                setIsSpeaking(false);
            }
        } else {
            setError("Speech recognition is not available or microphone access denied.");
        }
    };

    const stopSpeechRecognition = () => {
        SpeechRecognition.stopListening();
        console.log("Speech recognition stopped. Transcript captured but not yet submitted.");
    };

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
            setHasAnswered(true);
        } catch (err) {
            console.error('Error recording answer:', err);
            setError(err.message);
        }
    };

    const handleVoiceSubmit = async () => {
        if (listening) {
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
        SpeechRecognition.stopListening();
        resetTranscript();
        setUserTranscript('');
        setHasAnswered(false);
        setError(null);
        console.log("Re-record initiated. Transcript cleared.");
        // Stop any ongoing speech synthesis
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < interviewQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setUserTranscript('');
            setShowAnswerInput(false);
            setHasAnswered(false);
            SpeechRecognition.stopListening();
            resetTranscript();
            // Stop any ongoing speech synthesis
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                setIsSpeaking(false);
            }
        } else {
            console.log("Interview Finished!");
            navigate(`/feedback/${interviewId}`);
        }
    };

    const handleExitInterview = () => {
        if (userStream) {
            userStream.getTracks().forEach(track => track.stop());
        }
        SpeechRecognition.stopListening();
        // Stop any ongoing speech synthesis
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        console.log("Exiting interview.");
        navigate('/dashboard');
    };

    const handleCameraSwap = () => {
        setIsUserVideoMain(prevState => !prevState);
    };

    const speakQuestion = () => {
        if (currentQuestion && currentQuestion.question) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
                utterance.lang = 'en-US'; // Set language if needed
                utterance.onstart = () => {
                    setIsSpeaking(true);
                    setTtsError(null);
                };
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = (event) => {
                    console.error('SpeechSynthesisUtterance.onerror', event);
                    setTtsError('Error speaking the question.');
                    setIsSpeaking(false);
                };
                speechSynthesis.speak(utterance);
                // If speech recognition is active, stop it when speaking
                if (listening) {
                    SpeechRecognition.stopListening();
                }
            } else {
                setTtsError("Text-to-speech not supported in this browser.");
            }
        }
    };

    const currentQuestion = interviewQuestions[currentQuestionIndex];

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-[#000336] transition-colors duration-300">
            <PracticePrerequisiteDialog
                open={isPrerequisiteDialogOpen}
                onOpenChange={setIsPrerequisiteDialogOpen}
                onStartPractice={handleStartPractice}
                interviewId={interviewId}
            />

            {!isPrerequisiteDialogOpen && (
                <ResizablePanelGroup
                    direction="horizontal"
                    className="w-full h-full"
                >
                    {/* Left side: Contains two vertical panels (Camera and Q&A) */}
                    <ResizablePanel defaultSize={75}>
                        <ResizablePanelGroup direction="vertical">
                            {/* Panel for Main Camera (Large Video Feed) */}
                            <ResizablePanel defaultSize={60}>
                                <div className="p-8 flex flex-col items-center justify-center h-full">
                                    <div className="w-3/4 h-full bg-gray-800 dark:bg-gray-950 flex items-center justify-center rounded-lg shadow-lg overflow-hidden">
                                        {/* Main Video Display */}
                                        {isUserVideoMain ? (
                                            userStream ? (
                                                <video ref={userVideoElementRef} className="w-auto h-full object-cover transform scaleX(-1)" autoPlay playsInline muted></video>
                                            ) : (
                                                <div className="text-white dark:text-gray-300 text-xl">Loading your camera...</div>
                                            )
                                        ) : (
                                            <img
                                                src={interviewerPlaceholderImage}
                                                alt="Interviewer Placeholder"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                </div>
                            </ResizablePanel>

                            <ResizableHandle withHandle />

                            {/* Panel for Question and Answer Section */}
                            <ResizablePanel defaultSize={40}>
                                <div className="p-8 flex flex-col items-center justify-start h-full">
                                    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:border dark:border-gray-700 p-6 overflow-auto">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Main Question</div>
                                            {!loadingQuestions && interviewQuestions.length > 0 && currentQuestion && (
                                                <Button
                                                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md dark:bg-blue-700 dark:hover:bg-blue-800"
                                                    onClick={speakQuestion}
                                                    disabled={isSpeaking}
                                                >
                                                    <Volume2 className="mr-2 h-4 w-4" /> {isSpeaking ? 'Speaking...' : 'Listen to Question'}
                                                </Button>
                                            )}
                                        </div>

                                        {loadingQuestions ? (
                                            <h2 className="text-xl font-semibold text-gray-800 dark:text-blue-300 mb-4">Loading questions...</h2>
                                        ) : error ? (
                                            <h2 className="text-xl font-semibold text-red-500 dark:text-red-400 mb-4">Error: {error}</h2>
                                        ) : interviewQuestions.length === 0 ? (
                                            <h2 className="text-xl font-semibold text-gray-800 dark:text-blue-300 mb-4">No questions found for this interview.</h2>
                                        ) : (
                                            <h2 className="text-md font-semibold text-gray-800 dark:text-blue-300 mb-4">
                                                {currentQuestion ? currentQuestion.question : 'Interview ready, but no question to display.'}
                                            </h2>
                                        )}
                                        {ttsError && <p className="text-red-500 text-sm mt-1">{ttsError}</p>}

                                        {!hasAnswered && !loadingQuestions && interviewQuestions.length > 0 && (
                                            <>
                                                <div className="flex space-x-4 mb-4">
                                                    <Button
                                                        className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-200
                                                            ${listening ? 'bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800' : 'bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800'}`}
                                                        onClick={listening ? stopSpeechRecognition : startSpeechRecognition}
                                                        disabled={showAnswerInput || !browserSupportsSpeechRecognition || !isMicrophoneAvailable || isSpeaking}
                                                    >
                                                        <Mic className="mr-2 h-5 w-5" />
                                                        {listening ? 'Stop Recording' : 'Start Recording (Voice)'}
                                                    </Button>
                                                    <Button
                                                        className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-200
                                                            ${showAnswerInput ? 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800' : 'bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700'}`}
                                                        onClick={() => {
                                                            setShowAnswerInput(!showAnswerInput);
                                                            if (listening) {
                                                                SpeechRecognition.stopListening();
                                                            }
                                                            if (speechSynthesis.speaking) { // Stop TTS when toggling text input
                                                                speechSynthesis.cancel();
                                                                setIsSpeaking(false);
                                                            }
                                                        }}
                                                        disabled={listening || isSpeaking}
                                                    >
                                                        <MessageSquareText className="mr-2 h-5 w-5" />
                                                        {showAnswerInput ? 'Hide Text Input' : 'Type Answer'}
                                                    </Button>
                                                </div>

                                                {listening && (
                                                    <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">Listening: {transcript}</p>
                                                )}

                                                {!listening && userTranscript.trim() !== '' && !showAnswerInput && (
                                                    <div className="items-center mt-4">
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md
                                                                    dark:bg-blue-700 dark:hover:bg-blue-800"
                                                                onClick={handleVoiceSubmit}
                                                            >
                                                                Submit Voice Answer
                                                            </Button>
                                                            <Button
                                                                className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-md
                                                                    dark:bg-gray-600 dark:hover:bg-gray-700"
                                                                onClick={handleRerecord}
                                                            >
                                                                <RotateCcw className="mr-2 h-4 w-4" /> Re-record
                                                            </Button>
                                                        </div>
                                                        <div className="text-blue-700 dark:text-blue-400 text-sm italic font-medium mt-2"> <strong>Your Answer :-</strong> "{userTranscript}"</div>
                                                    </div>
                                                )}

                                                {showAnswerInput && (
                                                    <div className="mt-4">
                                                        <div className="flex justify-end space-x-2 mt-2">
                                                            <Button
                                                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md
                                                                    dark:bg-blue-700 dark:hover:bg-blue-800"
                                                                onClick={handleTextSubmit}
                                                                disabled={userTranscript.trim() === ''}
                                                            >
                                                                Submit Text Answer
                                                            </Button>
                                                            <Button
                                                                className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-md
                                                                    dark:bg-gray-600 dark:hover:bg-gray-700"
                                                                onClick={handleRerecord}
                                                                disabled={userTranscript.trim() === ''}
                                                            >
                                                                <RotateCcw className="mr-2 h-4 w-4" /> Clear/Re-type
                                                            </Button>
                                                        </div>
                                                        <textarea
                                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                                                                dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:focus:ring-blue-400 dark:placeholder-gray-400"
                                                            rows="4"
                                                            placeholder="Type your answer here..."
                                                            value={userTranscript}
                                                            onChange={(e) => setUserTranscript(e.target.value)}
                                                        ></textarea>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {hasAnswered && !loadingQuestions && interviewQuestions.length > 0 && (
                                            <div className="mt-4 flex justify-end">
                                                <Button
                                                    className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg
                                                        dark:bg-purple-700 dark:hover:bg-purple-800"
                                                    onClick={goToNextQuestion}
                                                >
                                                    {currentQuestionIndex === interviewQuestions.length - 1 ? 'Finish Interview' : 'Next Question'}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Right Section (Sidebar) */}
                    <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                        <div className="w-full h-full bg-white dark:bg-gray-900 p-6 shadow-lg flex flex-col justify-between dark:border-l dark:border-gray-700">
                            <div>
                                {/* Small Video Feed Display */}
                                <div className="w-full h-32 bg-gray-200 dark:bg-gray-950 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                    {isUserVideoMain ? (
                                        <img
                                            src={interviewerPlaceholderImage}
                                            alt="Interviewer Placeholder"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        userStream ? (
                                            <video ref={userVideoSmallElementRef} className="w-full h-full object-cover transform scaleX(-1)" autoPlay playsInline muted></video>
                                        ) : (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Loading your camera...</div>
                                        )
                                    )}
                                </div>
                                <Button
                                    className="w-full mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md
                                                dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                                    onClick={handleCameraSwap}
                                    disabled={!userStream}
                                >
                                    <ArrowLeftRight className="mr-2 h-4 w-4" /> Swap Cameras
                                </Button>

                                <h3 className="text-xl font-semibold text-gray-800 dark:text-blue-300 mb-2">Digital Marketing Specialist</h3>
                                <p className="text-gray-600 text-sm dark:text-gray-400 mb-4">Behavioral</p>
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50
                                                                        dark:text-blue-400 dark:border-blue-600 dark:hover:bg-gray-800">
                                        <MessageSquareText className="mr-2 h-4 w-4" /> EVALUATION CRITERIA
                                    </Button>
                                    <Button variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50
                                                                        dark:text-red-400 dark:border-red-600 dark:hover:bg-gray-800" onClick={handleExitInterview}>
                                        <X className="mr-2 h-4 w-4" /> EXIT INTERVIEW
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            )}
        </div>
    );
}

export default Practice;