import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Code2, Briefcase, FileText, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for React Router

// import PracticePrerequisiteDialog from './PracticePrerequisiteDialog';
import { v4 as uuidv4 } from 'uuid'; // For generating a unique interview ID

export default function InterviewFormDialog({ onStartInterview }) {
    const [open, setOpen] = useState(false);


    const [mode, setMode] = useState('general');
    const [selectedRound, setSelectedRound] = useState("Coding");
    const [difficulty, setDifficulty] = useState("Beginner");
    const [duration, setDuration] = useState("5 mins");

    const [inputs, setInputs] = useState({
        language: '',
        role: '',
        experience: '',
        jobDescription: '',
    });

    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [error, setError] = useState(null);
    const [currentInterviewId, setCurrentInterviewId] = useState(null);

    const navigate = useNavigate(); // Initialize useNavigate

    // Common selection options
    const commonRounds = ["Coding", "Technical Theory", "Scenario", "Mix"];
    const commonDifficultyLevels = ["Beginner", "Professional"];
    const commonDurations = [
        { time: "5 ", premium: false, questionNo: "5 questions" },
        { time: "15 ", premium: true, questionNo: "10 questions" },
        { time: "30 ", premium: true, questionNo: "15 questions" },
    ];

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleGenerateQuestions = async () => {
        setLoadingQuestions(true);
        setError(null);

        const newInterviewId = uuidv4();
        setCurrentInterviewId(newInterviewId);

        const formData = {
            ...inputs,
            mode,
            selectedRound,
            difficulty,
            duration,
            interviewId: newInterviewId, // Pass theerated ID to the gen backend
        };

        try {
            const response = await fetch('http://localhost:5000/api/interview/generate-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate questions from backend.');
            }

            const data = await response.json();
            console.log('Questions generated and saved:', data);

            // Assuming your backend returns the interviewId in the response data
            const receivedInterviewId = data.interviewId || newInterviewId;

            setOpen(false); // Close the Interview Preferences dialog

            // Navigate to the practice page with the interview ID using React Router
            navigate(`/practice/${receivedInterviewId}`);

        } catch (err) {
            console.error('Error generating questions:', err);
            setError(err.message);
        } finally {
            setLoadingQuestions(false);
        }
    };

    const handleGoBackFromPractice = () => {
        setOpenPracticeDialog(false);
        setOpen(true);
    };

    const handleStartPractice = () => {
        if (onStartInterview && currentInterviewId) {
            setOpenPracticeDialog(false);
            onStartInterview(currentInterviewId);
        } else {
            console.error("Cannot start practice: No interview ID or onStartInterview callback missing.");
            setError("Failed to start practice. Please try again.");
        }
    };

    return (
        <div className="flex justify-center py-10">
            {/* <Button
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition-transform"
                onClick={() => setOpen(true)}
            >
                Start Interview Setup
            </Button> */}

            <Button
                className="bg-white text-blue-800 w-auto hover:bg-blue-100 px-10 py-5 text-xl rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105 animate-bounce-once"
                // Assuming '/practice' is your interview start page
                onClick={() => setOpen(true)}
            >
                <Play className="mr-3 h-7 w-7" />
                Start Free Interview Practice
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-full max-w-2xl bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <DialogHeader>
                        <DialogTitle className="text-blue-800 text-2xl font-semibold">Interview Preferences</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Mode Selector */}
                        <div className="flex flex-col">
                            <label className="text-blue-800 font-medium text-sm mb-1">Interview Mode</label>
                            <Select value={mode} onValueChange={setMode}>
                                <SelectTrigger className="bg-white border border-blue-200 rounded-lg py-2 px-3 text-sm text-blue-900">
                                    <SelectValue placeholder="Select Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General (e.g. Java, CSS, React)</SelectItem>
                                    <SelectItem value="specific">Specific (Job Role with Description)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Input Fields based on Mode */}
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                            {mode === 'general' ? (
                                <>
                                    <div>
                                        <label className="block text-blue-800 text-sm font-medium mb-1">Language/Technology</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-blue-400">
                                                <Code2 className="w-5 h-5" />
                                            </span>
                                            <Input
                                                name="language"
                                                value={inputs.language}
                                                onChange={handleChange}
                                                placeholder="e.g. React, Python"
                                                className="pl-10 w-full border border-blue-200 rounded-lg text-blue-900 bg-white"
                                            />
                                        </div>
                                    </div>

                                </>
                            ) : (
                                <>
                                    <div className="sm:col-span-2">
                                        <label className="block text-blue-800 text-sm font-medium mb-1">Job Description</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-blue-400">
                                                <FileText className="w-5 h-5" />
                                            </span>
                                            <Input
                                                name="jobDescription"
                                                value={inputs.jobDescription}
                                                onChange={handleChange}
                                                placeholder="Paste job description or keywords..."
                                                className="pl-10 w-full border border-blue-200 rounded-lg text-blue-900 bg-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-blue-800 text-sm font-medium mb-1">Role</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-blue-400">
                                                <Briefcase className="w-5 h-5" />
                                            </span>
                                            <Input
                                                name="role"
                                                value={inputs.role}
                                                onChange={handleChange}
                                                placeholder="e.g. Frontend Developer"
                                                className="pl-10 w-full border border-blue-200 rounded-lg text-blue-900 bg-white"
                                            />
                                        </div>
                                    </div>
                                   
                                    
                                </>
                            )}
                            <div>
                                <label className="block text-blue-800 text-sm font-medium mb-1">Experience (Years)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-blue-400">
                                        <Briefcase className="w-5 h-5" />
                                    </span>
                                    <Input
                                        name="experience"
                                        value={inputs.experience}
                                        onChange={handleChange}
                                        placeholder="e.g. 1, 2, 3"
                                        className="pl-10 w-full border border-blue-200 rounded-lg text-blue-900 bg-white"
                                    />
                                </div>
                            </div>
                             <div className="sm:col-span-2 space-y-4">
                                        {/* Select Round */}
                                        <div>
                                            <p className="text-blue-800 font-semibold">Select Round <span className="text-red-500">*</span></p>
                                            <div className="flex gap-2 flex-wrap">
                                                {commonRounds.map((item) => (
                                                    <button
                                                        key={item}
                                                        onClick={() => setSelectedRound(item)}
                                                        className={`px-4 py-2 rounded-lg border ${selectedRound === item
                                                            ? "bg-purple-50 text-purple-700 border-purple-500"
                                                            : "bg-gray-100 text-gray-700 border-gray-200"
                                                            }`}
                                                    >
                                                        {item}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Difficulty Level */}
                                        <div>
                                            <p className="text-blue-800 font-semibold">Difficulty Level <span className="text-red-500">*</span></p>
                                            <div className="flex gap-2 flex-wrap">
                                                {commonDifficultyLevels.map((level) => (
                                                    <button
                                                        key={level}
                                                        onClick={() => setDifficulty(level)}
                                                        className={`px-4 py-2 rounded-lg border ${difficulty === level
                                                            ? "bg-purple-50 text-purple-700 border-purple-500"
                                                            : "bg-gray-100 text-gray-700 border-gray-200"
                                                            }`}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Interview Duration */}
                                        <TooltipProvider>
                                            <div>
                                                <p className="text-blue-800 font-semibold">Interview Duration <span className="text-red-500">*</span></p>
                                                <div className="flex gap-3 flex-wrap">
                                                    {commonDurations.map(({ time, premium, questionNo }) => (
                                                        <Tooltip key={time}>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    onClick={() => !premium && setDuration(time)}
                                                                    className={`relative px-4 py-2 rounded-lg border flex items-center gap-1 ${duration === time && !premium
                                                                        ? "bg-purple-50 text-purple-700 border-purple-500"
                                                                        : "bg-gray-100 text-gray-700 border-gray-200"
                                                                        } ${premium ? "opacity-50 cursor-not-allowed" : ""}`}
                                                                >
                                                                    {time} min
                                                                    {premium && <Crown size={16} className="text-yellow-500 ml-1" />}
                                                                </button>
                                                            </TooltipTrigger>
                                                            {premium && <TooltipContent>{questionNo}</TooltipContent>}
                                                        </Tooltip>
                                                    ))}
                                                </div>
                                            </div>
                                        </TooltipProvider>
                                    </div>
                        </div>

                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-6">
                            <Button
                                variant="ghost"
                                className="text-blue-800 hover:bg-blue-100 px-5 py-2 rounded-lg"
                                onClick={() => setOpen(false)}
                                disabled={loadingQuestions}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                                onClick={handleGenerateQuestions}
                                disabled={loadingQuestions}
                            >
                                {loadingQuestions ? 'Generating...' : 'Generate Questions'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>


        </div>
    );
}