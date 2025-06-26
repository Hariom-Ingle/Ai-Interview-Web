import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Search, Clock, Award, TrendingUp, Users, Lightbulb, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();

    // Placeholder data for recent interviews
    const recentInterviews = [
        { id: '1', title: 'Technical Interview - React Dev', date: 'June 18, 2025', status: 'Feedback Ready', rating: 'Good' },
        { id: '2', title: 'Behavioral Interview - Sales Lead', date: 'June 15, 2025', status: 'In Progress', rating: 'N/A' },
        { id: '3', title: 'Marketing Strategy Session', date: 'June 10, 2025', status: 'Feedback Ready', rating: 'Excellent' },
    ];

    // Placeholder data for practice categories
    const practiceCategories = [
        { name: "Technical", icon: <Brain className="h-6 w-6 text-blue-600" />, link: "/practice/technical" },
        { name: "Behavioral", icon: <Users className="h-6 w-6 text-blue-600" />, link: "/practice/behavioral" },
        { name: "Sales", icon: <TrendingUp className="h-6 w-6 text-blue-600" />, link: "/practice/sales" },
        { name: "Marketing", icon: <Lightbulb className="h-6 w-6 text-blue-600" />, link: "/practice/marketing" },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Feedback Ready':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'In Progress':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getRatingColor = (rating) => {
        switch (rating?.toLowerCase()) {
            case 'excellent':
                return 'text-green-700';
            case 'good':
                return 'text-blue-700';
            case 'average':
                return 'text-yellow-700';
            case 'poor':
                return 'text-red-700';
            default:
                return 'text-gray-700';
        }
    };

    return (
        <>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
                .font-poppins {
                    font-family: 'Poppins', sans-serif;
                }
                .custom-background {
                    background-color: #e5e5f7;
                    opacity: 0.8;
                    background-image: radial-gradient(#444cf7 0.5px, transparent 0.5px), radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px);
                    background-size: 20px 20px;
                    background-position: 0 0, 10px 10px;
                }
                `}
            </style>
            <div className="min-h-screen flex flex-col items-center font-poppins p-8">
                <div className="w-full max-w-6xl space-y-10 animate-fade-in-up">

                    {/* Welcome Header */}
                    <div className="text-center bg-white p-8 rounded-xl shadow-xl border border-blue-100 mb-8">
                        <h1 className="text-5xl font-extrabold text-blue-800 mb-4">
                            Welcome Back, Interviewer!
                        </h1>
                        <p className="text-xl text-blue-600 max-w-3xl mx-auto">
                            Your personalized hub for interview practice and progress tracking.
                        </p>
                    </div>

                    {/* Quick Actions / Main CTA */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-105">
                            <PlusCircle className="h-16 w-16 mb-4 text-white" />
                            <CardTitle className="text-3xl font-bold mb-3">Start a New Practice</CardTitle>
                            <CardDescription className="text-blue-100 mb-6">
                                Begin a new interview simulation to hone your skills.
                            </CardDescription>
                            <Button
                                className="bg-white text-blue-800 hover:bg-blue-100 px-8 py-4 text-lg rounded-full shadow-md"
                                onClick={() => navigate('/practice')} // Link to your practice page
                            >
                                Practice Now
                            </Button>
                        </Card>

                        <Card className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-105">
                            <Search className="h-16 w-16 mb-4 text-blue-600" />
                            <CardTitle className="text-3xl font-bold text-blue-800 mb-3">Explore Categories</CardTitle>
                            <CardDescription className="text-gray-700 mb-6">
                                Discover new interview types and specialized questions.
                            </CardDescription>
                            <Button
                                variant="outline"
                                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-full shadow-md"
                                onClick={() => navigate('/categories')} // Link to a categories page (if you create one)
                            >
                                Browse Categories
                            </Button>
                        </Card>
                    </section>

                    {/* Recent Interviews Section */}
                    <section className="bg-white p-8 rounded-xl shadow-xl border border-blue-100 animate-fade-in-up">
                        <h2 className="text-3xl font-extrabold text-blue-800 mb-6">Recent Interviews</h2>
                        <div className="space-y-4">
                            {recentInterviews.length > 0 ? (
                                recentInterviews.map((interview) => (
                                    <Card key={interview.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                        <div className="text-left mb-2 md:mb-0 md:w-2/3">
                                            <p className="text-lg font-semibold text-blue-900">{interview.title}</p>
                                            <p className="text-sm text-gray-600 flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {interview.date}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4 md:w-1/3 justify-end">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(interview.status)}`}>
                                                {interview.status}
                                            </span>
                                            {interview.rating && (
                                                <span className={`text-sm font-semibold ${getRatingColor(interview.rating)} flex items-center`}>
                                                    <Award className="h-4 w-4 mr-1" />
                                                    {interview.rating}
                                                </span>
                                            )}
                                            {interview.status === 'Feedback Ready' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:bg-blue-50"
                                                    onClick={() => navigate(`/feedback/${interview.id}`)} // Link to feedback page
                                                >
                                                    View Feedback
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-gray-600 text-center py-4">No recent interviews found. Start practicing!</p>
                            )}
                        </div>
                    </section>

                    {/* Practice Categories Section */}
                    <section className="bg-white p-8 rounded-xl shadow-xl border border-blue-100 animate-fade-in-up">
                        <h2 className="text-3xl font-extrabold text-blue-800 mb-6">Popular Practice Categories</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {practiceCategories.map((category, index) => (
                                <Card
                                    key={index}
                                    className="flex flex-col items-center p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-100 transition-transform duration-300 hover:scale-105 cursor-pointer"
                                    onClick={() => navigate(category.link)} // Navigate to specific category page
                                >
                                    <div className="mb-3">{category.icon}</div>
                                    <CardTitle className="text-lg font-semibold text-blue-800">{category.name}</CardTitle>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Upgrade Prompt */}
                    <section className="text-center bg-blue-700 text-white p-8 rounded-xl shadow-xl animate-fade-in-up">
                        <h2 className="text-4xl font-extrabold mb-6">Unlock Full Potential</h2>
                        <p className="text-xl mb-10 max-w-3xl mx-auto">
                            Upgrade your plan for unlimited features, advanced analytics, and personalized coaching.
                        </p>
                        <Button
                            className="bg-white text-blue-800 hover:bg-blue-100 px-10 py-5 text-xl rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105"
                            onClick={() => navigate('/upgrade')} // Link to your upgrade page
                        >
                            Explore Premium Features
                        </Button>
                    </section>

                </div>
            </div>
        </>
    );
}