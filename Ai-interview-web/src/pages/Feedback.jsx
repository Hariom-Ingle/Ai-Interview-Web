// pages/FeedbackPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // ShadCN Button
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'; // ShadCN Card components
import { Badge } from '@/components/ui/badge'; // ShadCN Badge
import { ArrowLeft } from 'lucide-react'; // Lucide icon for back button

function Feedback() {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            setLoading(true);
            setError(null);
            try {
                // Adjust this URL to your actual backend endpoint
                const response = await fetch(`http://localhost:5000/api/interview/feedback/${interviewId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch interview feedback.');
                }
                const data = await response.json();
                setFeedbackData(data); // Assuming data is an array of feedback objects
            } catch (err) {
                console.error('Error fetching feedback:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (interviewId) {
            fetchFeedback();
        } else {
            setError("No interview ID provided.");
            setLoading(false);
        }
    }, [interviewId]);

    const getRatingColor = (rating) => {
        switch (rating?.toLowerCase()) {
            case 'excellent':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'good':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'average':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'poor':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8 flex flex-col items-center
                    dark:bg-[#000336] transition-colors duration-300"> {/* Apply dark background */}
            <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 space-y-8 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <Button
                        variant="outline"
                        className="text-gray-600 hover:bg-gray-100 flex items-center space-x-2 rounded-lg
                                   dark:text-blue-400 dark:border-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-300"
                        onClick={() => navigate('/dashboard')} // Navigate back to dashboard or previous page
                    >
                        <ArrowLeft className="h-4 w-4 dark:text-blue-400" />
                        <span>Back to Dashboard</span>
                    </Button>
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-blue-300 text-center flex-grow">Interview Feedback</h1>
                    <div></div> {/* Spacer for alignment */}
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center p-10 text-gray-600 dark:text-gray-400">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-blue-400 mb-4"></div>
                        <p className="text-lg">Loading feedback...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg
                                dark:bg-red-950 dark:border-red-700 dark:text-red-300">
                        <p className="text-xl font-semibold">Error: {error}</p>
                        <p className="text-md mt-2">Please try again later or check your network connection.</p>
                    </div>
                )}

                {!loading && !error && feedbackData.length === 0 && (
                    <div className="text-center p-10 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg
                                dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                        <p className="text-xl font-semibold">No feedback available for this interview yet.</p>
                        <p className="text-md mt-2">It might take some time for the feedback to be generated.</p>
                    </div>
                )}

                {!loading && !error && feedbackData.length > 0 && (
                    <div className="space-y-6">
                        {feedbackData.map((item, index) => (
                            <Card key={index} className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300 rounded-lg
                                        dark:bg-gray-900 dark:border-blue-700"> {/* Dark card background and accent border */}
                                <CardHeader className="bg-blue-50 dark:bg-gray-800 p-4 rounded-t-lg">
                                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-blue-200 mb-2">
                                        Question {index + 1}: {item.questionText}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                                        Answered on: {new Date(item.answeredAt).toLocaleString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Your Answer:</h3>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200 shadow-inner
                                                    dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600">
                                            {item.transcript || 'No transcript available.'}
                                        </p>
                                    </div>
                                    {/* Placeholder for Correct Answer - assuming backend might provide this */}
                                    {item.correctAnswer && (
                                        <div>
                                            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Correct Answer (Expected):</h3>
                                            <p className="text-gray-900 bg-green-50 p-3 rounded-md border border-green-200 shadow-inner
                                                        dark:text-gray-200 dark:bg-green-900 dark:border-green-700">
                                                {item.correctAnswer}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Feedback:</h3>
                                        <p className="text-gray-900 bg-yellow-50 p-3 rounded-md border border-yellow-200 shadow-inner
                                                    dark:text-gray-200 dark:bg-yellow-900 dark:border-yellow-700">
                                            {item.feedback || 'No detailed feedback provided.'}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-medium text-gray-700 dark:text-gray-300">Rating:</h3>
                                        <Badge className={`px-3 py-1 rounded-full text-sm font-semibold ${getRatingColor(item.rating)}`}>
                                            {item.rating || 'N/A'}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Feedback;