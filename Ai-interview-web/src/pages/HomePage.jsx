import Footer from '@/components/common/Footer';
import InterviewFormDialog from '@/components/common/InterviewSetupForm';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { BarChart2, Bot, Brain, CheckCircle, Lightbulb, LogIn, MessageSquare, Mic, PlayCircle, Sparkles, ThumbsUp, TimerReset, TrendingUp, UserPlus, Users } from 'lucide-react';
import { useSelector } from 'react-redux'; // Import useSelector
import { NavLink, useNavigate } from 'react-router-dom';
import "../CSS/home.css";

export default function HomePage() {
    const navigate = useNavigate();
    const currentTheme = useSelector((state) => state.theme.theme);
    const isloggedin = useSelector((state) => state.auth.user);
   
    // Determine if dark mode is active
    const isDarkMode = currentTheme === 'dark';

    // Dynamically determine which custom pattern class to apply
    const patternClass = isDarkMode ? 'magicpattern' : 'magicpatternlight';


    const sectionClassName = `
    w-full h-screen flex justify-center items-center flex-col py-24 px-8 text-center shadow-sm
    ${patternClass}
    bg-white text-blue-700
    dark:bg-dark-background dark:text-blue-200
  `.trim(); // .trim() removes extra whitespace for cleaner HTML output

    const interviewCategories = [
        { name: "Technical Interview", icon: <Brain className="h-10 w-10 text-blue-600" />, description: "Coding, algorithms, system design." },
        { name: "Behavioral Interview", icon: <Users className="h-10 w-10 text-blue-600" />, description: "STAR method, teamwork, leadership." },
        { name: "Marketing Interview", icon: <TrendingUp className="h-10 w-10 text-blue-600" />, description: "Strategy, campaigns, analytics." },
        { name: "Sales Interview", icon: <Lightbulb className="h-10 w-10 text-blue-600" />, description: "Closing, prospecting, objection handling." },
        // Add more categories as needed
    ];

    return (
        <>

            {/* Hero Section */}
            {isloggedin ? (
                <section className="w-full min-h-[80vh] px-24 py-24 bg-gradient-to-br from-[#eef4ff] via-white to-[#dbeafe] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col lg:flex-row items-center justify-between gap-10 transition-all duration-300">

                    {/* Left Column - Content */}
                    <div className="lg:w-1/2 space-y-8 animate-fade-in-down">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-blue-600" />
                            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                                Conquer Your Next <br></br>
                                <span className='text-blue-600'>

                                Interview
                                </span>
                            </h1>
                        </div>

                        <p className="text-lg text-blue-800 dark:text-blue-200 max-w-xl">
                            Practice smarter with AI, real-time feedback, and realistic simulations. Build confidence and skills with our powerful preparation tools.
                        </p>

                        {/* Key Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Highlight icon={<Bot className="text-blue-600" />} title="AI Interviews" desc="Simulated real-world questions with smart follow-ups." />
                            <Highlight icon={<Mic className="text-pink-500" />} title="Voice Input" desc="Speak naturally and get instant voice-based feedback." />
                            <Highlight icon={<TimerReset className="text-green-600" />} title="Time-Based Rounds" desc="Mimic pressure with real-time timers." />
                            <Highlight icon={<ThumbsUp className="text-purple-600" />} title="Confidence Booster" desc="Track your improvement and grow stronger." />
                        </div>

                        <p className="italic text-sm text-gray-500 dark:text-gray-400 pt-4">
                            “Interviews are won by preparation. Start winning now.”
                        </p>
                    </div>

                    {/* Right Column - CTA Card */}
                    <div className="lg:w-1/2 animate-fade-in-up flex justify-center">
                        <div className="relative w-full max-w-md bg-white/90 dark:bg-slate-800/80 backdrop-blur-md border border-blue-100 dark:border-slate-700 rounded-3xl shadow-xl p-10 text-center">
                            <div className="absolute inset-0 z-[-1] bg-gradient-to-tr from-blue-300 via-purple-300 to-pink-300 dark:from-blue-900 dark:via-indigo-800 dark:to-purple-900 blur-3xl opacity-20 rounded-3xl" />

                            <h2 className="text-2xl font-semibold mb-3">Start Practicing Now</h2>
                            <p className="text-sm mb-6 text-gray-600 dark:text-gray-300">
                                Take the first step toward job-readiness. Launch your interview session below.
                            </p>

                            <InterviewFormDialog />
                        </div>
                    </div>
                </section>
            ) : (
                <section className="h-auto px-20 py-28 text-blue-800 dark:text-blue-200 flex flex-col lg:flex-row items-center justify-between ">

                    {/* Left Content */}
                    <div className="max-w-2xl animate-fade-in-down">

                        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                            Ace Every Interview with <br /> Confidence
                        </h1>
                        <p className="text-lg mb-8 max-w-xl v dark:text-white animate-fade-in text-black  ">
                            Build real confidence with AI-powered mock interviews, instant feedback, and expert-level preparation tools.
                        </p>

                        <div className="flex gap-4 flex-wrap animate-fade-in-up">
                            <NavLink to="/login" className="flex flex-row align-center justify-center gap-3 px-6 py-3 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition duration-300 shadow-md">
                                <LogIn /> Sign In
                            </NavLink>
                            <NavLink to="/register"  className="flex flex-row align-center justify-center gap-3 px-6 py-3 rounded-lg border border-blue-700 text-blue-700 dark:text-blue-300 dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition duration-300 shadow-sm">
                                <UserPlus /> Sign Up
                            </NavLink>
                        </div>

                    </div>

                    {/* Right Grid Cards */}
                    <div className="grid grid-cols-2 gap-4 max-w-md w-full animate-fade-in-up">
                        {/* Card 1 */}
                        <Card className="rounded-2xl shadow-lg bg-blue-100 dark:bg-blue-900 hover:scale-105 transition-transform duration-300  ">
                            <CardContent className="p-5 flex flex-col items-center text-center">
                                <Lightbulb className="w-8 h-8 text-yellow-500 mb-3" />
                                <h3 className="font-semibold text-lg mb-1">AI-Powered Insight</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Smart analysis of your answers with actionable feedback.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Card 2 */}
                        <Card className="rounded-2xl shadow-lg bg-pink-100 dark:bg-pink-900 hover:scale-105 transition-transform duration-300">
                            <CardContent className="p-5 flex flex-col items-center text-center">
                                <MessageSquare className="w-8 h-8 text-pink-600 mb-3" />
                                <h3 className="font-semibold text-lg mb-1">Real-time Feedback</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Instantly improve with tips after every mock interview.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Card 3 */}
                        <Card className="rounded-2xl shadow-lg bg-green-100 dark:bg-green-900 hover:scale-105 transition-transform duration-300">
                            <CardContent className="p-5 flex flex-col items-center text-center">
                                <PlayCircle className="w-8 h-8 text-green-600 mb-3" />
                                <h3 className="font-semibold text-lg mb-1">Mock Sessions</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Practice with realistic, timed interview simulations.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Card 4 */}
                        <Card className="rounded-2xl shadow-lg bg-purple-100 dark:bg-purple-900 hover:scale-105 transition-transform duration-300">
                            <CardContent className="p-5 flex flex-col items-center text-center">
                                <CheckCircle className="w-8 h-8 text-purple-600 mb-3" />
                                <h3 className="font-semibold text-lg mb-1">Get Job Ready</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Build the confidence and skills you need to succeed.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

            )}

            <div className="min-h-screen flex flex-col items-center font-poppins bg-gradient-to-br from-[#eef4ff] via-white to-[#dbeafe] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900   ">


                {/* How It Works Section */}
                <section className="w-full max-w-6xl py-16 px-8 text-center bg-white dark:bg-blue-900 dark:text-white rounded-xl shadow-xl border border-blue-100 dark:border-blue-800 my-12 animate-fade-in-up">

                    <h2 className="text-4xl font-extrabold text-blue-800 dark:text-white mb-10">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center p-6 bg-blue-50 dark:bg-dark-background rounded-lg shadow-md border border-blue-100 dark:border-blue-800">

                            <Mic className="h-16 w-16 text-blue-600 dark:text-blue-400 mb-4" />
                            <h3 className="text-2xl font-semibold text-blue-800 dark:text-white mb-2">1. Speak or Type Your Answer</h3>
                            <p className="text-gray-700 dark:text-gray-300">Engage naturally using your microphone, or choose to type your responses.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center p-6 bg-blue-50 dark:bg-dark-background rounded-lg shadow-md border border-blue-100 dark:border-blue-800">

                            <Brain className="h-16 w-16 text-blue-600 dark:text-blue-400 mb-4" />
                            <h3 className="text-2xl font-semibold text-blue-800 dark:text-white mb-2">2. Receive Instant AI Feedback</h3>
                            <p className="text-gray-700 dark:text-gray-300">Our AI analyzes your answers for clarity, relevance, and structure.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center p-6 bg-blue-50 dark:bg-dark-background rounded-lg shadow-md border border-blue-100 dark:border-blue-800">

                            <BarChart2 className="h-16 w-16 text-blue-600 dark:text-blue-400 mb-4" />
                            <h3 className="text-2xl font-semibold text-blue-800 dark:text-white mb-2">3. Track Progress & Improve</h3>
                            <p className="text-gray-700 dark:text-gray-300">Review detailed reports and see your skills grow over time.</p>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="w-full max-w-6xl py-16 px-8 bg-blue-100 dark:bg-gray-900 rounded-xl shadow-xl border border-blue-200 dark:border-gray-700 mb-12 animate-fade-in-up">
                    <h2 className="text-4xl font-extrabold text-blue-800 dark:text-white text-center mb-10">Explore Interview Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {interviewCategories.map((category, index) => (
                            <Card
                                key={index}
                                className="flex flex-col items-center p-6 text-center bg-white dark:bg-dark-background  rounded-lg shadow-md border border-blue-100 dark:border-gray-700 transition-transform duration-300 hover:scale-105 hover:shadow-lg animate-fade-in"
                            >
                                <div className="mb-4">{category.icon}</div>
                                <CardTitle className="text-xl font-semibold text-blue-800 dark:text-white mb-2">{category.name}</CardTitle>
                                <CardDescription className="text-gray-700 dark:text-gray-300">{category.description}</CardDescription>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="w-full max-w-6xl py-16 px-8 text-center bg-blue-700 text-white dark:bg-gray-900 dark:text-gray-100 rounded-xl shadow-xl mb-12 animate-fade-in-up">
                    <h2 className="text-4xl font-extrabold mb-6">Ready to Ace Your Interview?</h2>
                    <p className="text-xl mb-10 max-w-3xl mx-auto text-white dark:text-gray-300">
                        Join thousands of professionals improving their interview skills daily. Your dream job awaits!
                    </p>
                    <div><InterviewFormDialog /></div>
                </section>



            </div>
            <Footer />
        </>
    );
}

function Highlight({ icon, title, desc }) {
    return (
        <div className="flex gap-3 items-start">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-slate-700">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{desc}</p>
            </div>
        </div>
    );
}