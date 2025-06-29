import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button'; // Assuming ShadCN Button
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // ShadCN Card components
import { ArrowLeft, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { useSelector } from 'react-redux'; // Import useSelector to get theme

// Helper component for animated 3D scenes
const AnimatedScene = ({ type }) => {
    const mountRef = useRef(null);
    const currentTheme = useSelector((state) => state.theme.theme); // Get current theme

    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);

        // Add ambient light for better visibility in dark mode, if using Phong/Standard materials
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
        scene.add(ambientLight);

        // Add a directional light for shadows and definition
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        let object;
        let pulseInterval; // Define pulseInterval outside animate for cleanup

        const animate = () => {
            requestAnimationFrame(animate);
            if (object) {
                // Ensure rotation continues for all types
                object.rotation.x += 0.005;
                object.rotation.y += 0.005;
            }
            renderer.render(scene, camera);
        };

        // Cleanup function
        const cleanup = () => {
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
                renderer.dispose();
            }
            if (pulseInterval) {
                clearInterval(pulseInterval); // Clear the interval on cleanup
            }
            // Dispose of Three.js objects to prevent memory leaks
            scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            renderer.renderLists.dispose(); // Clear render lists
            scene.clear(); // Clear scene objects
        };

        // Function to determine material color based on theme
        const getMaterialColor = (lightColor, darkColor) => {
            return new THREE.Color(currentTheme === 'dark' ? darkColor : lightColor);
        };


        if (type === 'mic-keyboard') {
            // Microphone stand
            const standGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
            const standMaterial = new THREE.MeshPhongMaterial({ color: getMaterialColor(0x888888, 0x4A4A4A) }); // Darken in dark mode
            const stand = new THREE.Mesh(standGeometry, standMaterial);
            scene.add(stand);

            // Microphone head
            const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
            const headMaterial = new THREE.MeshPhongMaterial({ color: getMaterialColor(0x666666, 0x333333) }); // Darken in dark mode
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.y = 0.6;
            stand.add(head);

            // Simple keyboard keys
            const keyMaterial = new THREE.MeshPhongMaterial({ color: getMaterialColor(0xaaaaaa, 0x666666) }); // Darken in dark mode
            for (let i = 0; i < 3; i++) {
                const keyGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
                const key = new THREE.Mesh(keyGeometry, keyMaterial);
                key.position.set((i - 1) * 0.7, -0.8, 0);
                stand.add(key);
            }

            object = stand; // Group them under 'stand' for rotation
            camera.position.z = 2;

            // Simple pulse animation for the microphone
            const pulse = () => {
                if (head) {
                    head.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.1; // Pulsate y scale
                }
            };
            animate(); // Start main animation loop
            pulseInterval = setInterval(pulse, 50); // Start pulse interval

        } else if (type === 'ai-feedback') {
            // Central brain-like sphere
            const brainGeometry = new THREE.SphereGeometry(0.6, 32, 32);
            const brainMaterial = new THREE.MeshPhongMaterial({
                color: getMaterialColor(0x444cf7, 0x7A7AFF), // Brighter blue in dark mode
                transparent: true,
                opacity: 0.8
            });
            const brain = new THREE.Mesh(brainGeometry, brainMaterial);
            scene.add(brain);

            // Orbiting data points
            const dataPointGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const dataPointMaterial = new THREE.MeshPhongMaterial({ color: getMaterialColor(0xffffff, 0xDDDDDD) }); // Keep light in dark mode for contrast
            const dataPoint1 = new THREE.Mesh(dataPointGeometry, dataPointMaterial);
            const dataPoint2 = new THREE.Mesh(dataPointGeometry, dataPointMaterial);
            brain.add(dataPoint1);
            brain.add(dataPoint2);

            dataPoint1.position.x = 1;
            dataPoint2.position.x = -1;

            camera.position.z = 2;
            object = brain;

            const orbitAnimate = () => {
                requestAnimationFrame(orbitAnimate);
                if (dataPoint1 && dataPoint2) {
                    dataPoint1.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.02);
                    dataPoint2.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.02);
                }
                renderer.render(scene, camera);
            };
            orbitAnimate();

        } else if (type === 'progress-chart') {
            const barMaterial = new THREE.MeshPhongMaterial({ color: getMaterialColor(0x444cf7, 0x7A7AFF) }); // Brighter blue in dark mode
            const bars = [];
            for (let i = 0; i < 4; i++) {
                const barGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.3); // Initial height
                const bar = new THREE.Mesh(barGeometry, barMaterial);
                bar.position.set((i - 1.5) * 0.8, -0.5, 0);
                scene.add(bar);
                bars.push(bar);
            }
            object = new THREE.Group(); // Empty group to apply general rotation
            scene.add(object); // Add to scene
            bars.forEach(bar => object.add(bar)); // Add bars to the group

            camera.position.z = 2.5;

            // Bar growth animation
            let animationProgress = 0;
            const targetHeights = [0.2, 1.0, 0.6, 1.2]; // Target heights for bars
            const growAnimate = () => {
                requestAnimationFrame(growAnimate);
                animationProgress = (animationProgress + 0.01) % (Math.PI * 2); // Cycle smoothly
                bars.forEach((bar, i) => {
                    bar.scale.y = 1 + (Math.sin(animationProgress + i * 0.5) * 0.5 + 0.5) * targetHeights[i]; // Oscillating growth
                    bar.position.y = -0.5 + (bar.scale.y * 0.3) / 2; // Adjust position based on scale
                });
                renderer.render(scene, camera);
            };
            growAnimate();
        }

        // Return the cleanup function
        return cleanup;

    }, [type, currentTheme]); // Rerun effect if the type or theme changes

    return <div ref={mountRef} className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-md mb-4" style={{ minHeight: '192px' }}></div>;
};


export default function HowItWork() {
    const navigate = useNavigate();

    return (
        <>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
                .font-poppins {
                    font-family: 'Poppins', sans-serif;
                }
                `}
            </style>
            {/* Main container: dark:bg-[#000336] for the primary dark background */}
            <div className="min-h-screen flex flex-col items-center font-poppins p-8 bg-blue-50 dark:bg-[#000336] transition-colors duration-300">
                <div className="w-full max-w-6xl space-y-10 animate-fade-in-up">
                    {/* Header Section */}
                    <div className="relative text-center bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl border border-blue-100 dark:border-gray-700 mb-8">
                        <Button
                            variant="outline"
                            className="absolute top-8 left-8 text-blue-700 border-blue-300 hover:bg-blue-100 flex items-center space-x-2 rounded-lg py-2 px-6
                                dark:text-blue-400 dark:border-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-300"
                            onClick={() => navigate(-1)} // Go back to the previous page
                        >
                            <ArrowLeft className="h-5 w-5 dark:text-blue-400" />
                            <span>Back</span>
                        </Button>
                        <h1 className="text-5xl font-extrabold text-blue-800 dark:text-blue-300 mb-4 mt-12 md:mt-0"> {/* Adjusted margin for button */}
                            How Our AI Interview Coach Works
                        </h1>
                        <p className="text-xl text-blue-600 dark:text-blue-400 max-w-3xl mx-auto">
                            A simple, step-by-step guide to mastering your interview skills.
                        </p>
                    </div>

                    {/* How It Works Steps with Animations */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Step 1: Speak or Type Your Answer */}
                        <Card className="flex flex-col items-center p-6 text-center bg-white dark:bg-gray-900 rounded-lg shadow-md border border-blue-100 dark:border-gray-700 transition-transform duration-300 hover:scale-105 hover:shadow-lg animate-fade-in">
                            <CardHeader>
                                {/* Pass the theme to AnimatedScene if its internal colors need to change based on it */}
                                <AnimatedScene type="mic-keyboard" />
                                <CardTitle className="text-2xl font-semibold text-blue-800 dark:text-blue-300 mb-2">1. Speak or Type Your Answer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-gray-700 dark:text-gray-300">
                                    Engage naturally using your microphone for voice recording, or choose the text input option to type your responses at your own pace.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        {/* Step 2: Receive Instant AI Feedback */}
                        <Card className="flex flex-col items-center p-6 text-center bg-white dark:bg-gray-900 rounded-lg shadow-md border border-blue-100 dark:border-gray-700 transition-transform duration-300 hover:scale-105 hover:shadow-lg animate-fade-in delay-100">
                            <CardHeader>
                                <AnimatedScene type="ai-feedback" />
                                <CardTitle className="text-2xl font-semibold text-blue-800 dark:text-blue-300 mb-2">2. Receive Instant AI Feedback</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-gray-700 dark:text-gray-300">
                                    Our advanced AI analyzes your recorded or typed answers, providing immediate insights on clarity, relevance, tone, and structure.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        {/* Step 3: Track Progress & Improve */}
                        <Card className="flex flex-col items-center p-6 text-center bg-white dark:bg-gray-900 rounded-lg shadow-md border border-blue-100 dark:border-gray-700 transition-transform duration-300 hover:scale-105 hover:shadow-lg animate-fade-in delay-200">
                            <CardHeader>
                                <AnimatedScene type="progress-chart" />
                                <CardTitle className="text-2xl font-semibold text-blue-800 dark:text-blue-300 mb-2">3. Track Progress & Improve</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-gray-700 dark:text-gray-300">
                                    Review detailed performance reports, identify areas for improvement, and track your progress over time to build confidence.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Final Call to Action */}
                    <section className="text-center bg-blue-700 dark:bg-gray-900 text-white dark:text-gray-100 p-8 rounded-xl shadow-xl mt-10 border border-blue-700 dark:border-gray-700"> {/* Added border */}
                        <h2 className="text-4xl font-extrabold mb-6 dark:text-blue-300">Ready to Experience It Yourself?</h2>
                        <p className="text-xl mb-10 max-w-3xl mx-auto dark:text-gray-300">
                            Start your personalized interview practice journey today and turn your aspirations into achievements.
                        </p>
                        <Button
                            className="bg-white text-blue-800 hover:bg-blue-100 px-10 py-5 text-xl rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105
                                dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                            onClick={() => navigate('/practice')}
                        >
                            <Play className="mr-3 h-7 w-7" />
                            Start Practicing Now
                        </Button>
                    </section>
                </div>
            </div>
        </>
    );
}