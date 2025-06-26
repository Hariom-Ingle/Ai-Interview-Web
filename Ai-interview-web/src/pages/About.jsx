import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming ShadCN Button
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // ShadCN Card components
import { Brain, Mic, MessageSquareText, BarChart2 } from 'lucide-react'; // Icons for features
import { useNavigate } from 'react-router-dom';

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-blue-50 p-8 flex flex-col items-center justify-center">
            <Card className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-8 space-y-8 animate-fade-in-up border border-blue-100">
                <CardHeader className="text-center">
                    <CardTitle className="text-5xl font-extrabold text-blue-800 mb-4">
                        About Our AI Interview Coach
                    </CardTitle>
                    <CardDescription className="text-xl text-blue-600 max-w-2xl mx-auto">
                        Master your interviews with personalized, AI-powered practice sessions. Get ready to shine!
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-10">
                    <section className="text-center">
                        <h2 className="text-3xl font-bold text-blue-800 mb-4">What We Do</h2>
                        <p className="text-lg text-blue-900 leading-relaxed">
                            Our platform provides a realistic interview simulation experience, allowing you to practice common interview questions, receive instant feedback, and refine your answers. Whether you're a fresh graduate or an experienced professional, our AI coach is designed to help you build confidence and ace your next job interview.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-blue-800 text-center mb-6">Key Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FeatureCard
                                icon={<Mic className="h-10 w-10 text-blue-600" />} 
                                title="Voice Recognition"
                                description="Practice speaking your answers naturally, with real-time transcription."
                            />
                            <FeatureCard
                                icon={<MessageSquareText className="h-10 w-10 text-blue-600" />} 
                                title="Text Input Option"
                                description="Prefer to type? Refine your responses in writing before you speak."
                            />
                            <FeatureCard
                                icon={<Brain className="h-10 w-10 text-blue-600" />} 
                                title="AI-Powered Feedback"
                                description="Get instant insights on your answer's relevance, structure, and effectiveness."
                            />
                            <FeatureCard
                                icon={<BarChart2 className="h-10 w-10 text-blue-600" />}  
                                title="Performance Analytics"
                                description="Review detailed reports on your answers, ratings, and areas for improvement."
                            />
                        </div>
                    </section>

                    <section className="text-center">
                        <h2 className="text-3xl font-bold text-blue-800 mb-4">How It Works</h2>
                        <p className="text-lg text-blue-900 leading-relaxed">
                            Simply select an interview topic, start your practice session, and answer questions as if you were in a real interview. Our advanced AI listens to your responses (or reads your typed answers) and provides comprehensive feedback to help you articulate your thoughts better and strengthen your weak points.
                        </p>
                    </section>

                    <div className="text-center pt-6">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                            onClick={() => navigate('/dashboard')} // Assuming '/dashboard' is where users start practicing
                        >
                            Start Your Practice Journey Now!
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Helper component for features
const FeatureCard = ({ icon, title, description }) => (
    <Card className="flex flex-col items-center p-6 text-center border-l-4 border-blue-400 hover:shadow-xl transition-shadow duration-300">
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-2xl font-semibold text-blue-800 mb-2">{title}</CardTitle>
        <CardDescription className="text-blue-700 leading-relaxed">{description}</CardDescription>
    </Card>
);
