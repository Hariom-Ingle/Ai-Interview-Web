import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Code2, Briefcase, FileText, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { generateQuestions } from '../../features/interview/interviewSlice';
import { v4 as uuidv4 } from 'uuid'; // For generating a unique interview ID

export default function InterviewFormDialog() { // onStartInterview prop is not used, removed
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState('general');
    const [selectedRound, setSelectedRound] = useState("Coding");
    const [difficulty, setDifficulty] = useState("Beginner");
    const [duration, setDuration] = useState("5 mins");

    const dispatch = useDispatch();
    // Destructure `error` directly from Redux state for consistent error handling
    const { loading, error } = useSelector((state) => state.interview);

    const [inputs, setInputs] = useState({
        language: '',
        role: '',
        experience: '',
        jobDescription: '',
    });

    const navigate = useNavigate();

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
        // You might want to add client-side validation here before dispatching
        // For example:
        if (mode === 'general' && !inputs.language.trim()) {
            // This is a simple example. For a more robust solution,
            // you could dispatch an error action or use a local state for input validation errors.
            alert('Please enter a language/technology for General mode.');
            return;
        }
        if (mode === 'specific' && (!inputs.jobDescription.trim() || !inputs.role.trim())) {
             alert('Please enter Job Description and Role for Specific mode.');
             return;
        }
        if (!inputs.experience.trim()) {
            alert('Please enter your experience.');
            return;
        }


        const formData = {
            ...inputs,
            mode,
            selectedRound,
            difficulty,
            duration,
            interviewId: uuidv4(), // Generate unique ID
        };

        const result = await dispatch(generateQuestions(formData));

        // Check if the thunk was fulfilled (successful)
        if (generateQuestions.fulfilled.match(result)) {
            setOpen(false); // Close dialog on success
            navigate(`/practice/${result.payload.interviewId}`); // Navigate to interview
        }
        // No explicit `setError` needed here for Redux errors,
        // as `useSelector` already picks up `error` from the Redux state.
        // The `error` variable from useSelector will be truthy if the thunk was rejected.
    };

    return (
        <div className="flex justify-center py-10">
            <Button
                className="bg-white text-blue-800 w-auto hover:bg-blue-100 px-10 py-5 text-xl rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105 animate-bounce-once"
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

                        {/* Error display from Redux state */}
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-6">
                            <Button
                                variant="ghost"
                                className="text-blue-800 hover:bg-blue-100 px-5 py-2 rounded-lg"
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                                onClick={handleGenerateQuestions}
                                disabled={loading}
                            >
                                {loading ? 'Generating...' : 'Generate Questions'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}