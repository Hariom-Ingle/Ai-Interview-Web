import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Crown, Star, TrendingUp } from 'lucide-react'; // Icons for features and plan types
import { useNavigate } from 'react-router-dom';

// Helper component for Plan Card - similar to FeatureCard but for pricing plans
const PlanCard = ({ plan, price, features, isPopular, onChoosePlan }) => (
    <Card className={`relative flex flex-col p-6 text-center rounded-xl shadow-lg border transition-all duration-300 transform hover:scale-105
        ${isPopular
            ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50 dark:bg-gray-800 dark:border-blue-700 dark:ring-blue-700' // Popular in dark mode
            : 'bg-white dark:bg-gray-900 dark:border-gray-700' // Regular in dark mode
        }`}>
        {isPopular && (
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl dark:bg-blue-700">
                MOST POPULAR
            </div>
        )}
        <CardHeader className="pb-4">
            <CardTitle className={`text-3xl font-bold mb-2 ${isPopular ? 'text-blue-800 dark:text-blue-300' : 'text-blue-700 dark:text-blue-400'}`}>
                {plan}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                <span className="text-4xl font-extrabold text-blue-900 dark:text-blue-200">${price}</span> / month
            </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
            <ul className="space-y-3 text-left mb-6 text-blue-800 dark:text-gray-200">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 dark:text-green-400" />
                        <span className="text-md">{feature}</span>
                    </li>
                ))}
            </ul>
            <Button
                className={`w-full py-3 text-lg font-semibold rounded-lg shadow-md
                    ${isPopular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-white'
                    }`}
                onClick={() => onChoosePlan(plan)}
            >
                Choose {plan} Plan
            </Button>
        </CardContent>
    </Card>
);

export default function Upgrade() {
    const navigate = useNavigate();

    const handleChoosePlan = (planName) => {
        // Implement logic for choosing a plan, e.g., redirect to checkout or show confirmation
        console.log(`User chose ${planName} plan`);
        alert(`You've chosen the ${planName} plan! (This is a demo action)`);
        // navigate('/checkout', { state: { plan: planName, price: '...' } });
    };

    return (
        // Main container: dark:bg-[#000336] applies the specific dark blue
        <div className="min-h-screen bg-blue-50 dark:bg-[#000336] p-8 flex flex-col items-center transition-colors duration-300">
            <div className="w-full max-w-6xl space-y-10 animate-fade-in-up">
                {/* Header Section */}
                <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl border border-blue-100 dark:border-gray-700 mb-8">
                    <h1 className="text-5xl font-extrabold text-blue-800 dark:text-blue-300 mb-4">
                        Upgrade Your Interview Practice
                    </h1>
                    <p className="text-xl text-blue-600 dark:text-blue-400 max-w-3xl mx-auto mb-6">
                        Unlock advanced features, unlimited practice, and deeper insights to confidently land your dream job.
                    </p>
                    <Button
                        variant="outline"
                        className="text-blue-700 border-blue-300 hover:bg-blue-100 flex items-center space-x-2 rounded-lg py-2 px-6 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-gray-800"
                        onClick={() => navigate(-1)} // Go back to the previous page
                    >
                        <TrendingUp className="h-5 w-5 dark:text-blue-400" />
                        <span>Back to Dashboard</span>
                    </Button>
                </div>

                {/* Pricing Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PlanCard
                        plan="Basic"
                        price="0"
                        features={[
                            "Limited practice questions",
                            "Basic feedback",
                            "1 interview per week",
                            "Community support"
                        ]}
                        onChoosePlan={handleChoosePlan}
                    />
                    <PlanCard
                        plan="Pro"
                        price="19"
                        features={[
                            "Unlimited practice questions",
                            "Advanced AI feedback",
                            "5 interviews per week",
                            "Priority email support",
                            "Detailed performance analytics"
                        ]}
                        isPopular={true}
                        onChoosePlan={handleChoosePlan}
                    />
                    <PlanCard
                        plan="Premium"
                        price="49"
                        features={[
                            "Unlimited practice questions",
                            "Personalized AI coaching",
                            "Unlimited interviews",
                            "Live chat support",
                            "Video recording analysis",
                            "Custom interview paths"
                        ]}
                        onChoosePlan={handleChoosePlan}
                    />
                </div>

                {/* Call to Action / Info Section */}
                <div className="text-center bg-blue-100 dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-blue-200 dark:border-gray-700 mt-10">
                    <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-300 mb-4">Ready to take the next step?</h2>
                    <p className="text-lg text-blue-700 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                        Our premium plans offer an unparalleled advantage, providing you with all the tools and insights you need to excel.
                    </p>
                    <Button
                        className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 text-xl rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 dark:bg-blue-800 dark:hover:bg-blue-700 dark:text-white"
                        onClick={() => handleChoosePlan('Premium')}
                    >
                        GET STARTED WITH PREMIUM
                    </Button>
                </div>
            </div>
        </div>
    );
}