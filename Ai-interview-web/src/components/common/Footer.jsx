import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-blue-900 dark:bg-gray-900 text-white py-12 px-8 rounded-xl shadow-xl mt-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                {/* Brand Info */}
                <div>
                    <h3 className="text-2xl font-bold mb-4">AI Interview Coach</h3>
                    <p className="text-blue-200 dark:text-gray-400 text-sm">
                        Your ultimate partner in mastering job interviews. Practice smart, achieve more.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link to="/" className="text-blue-200 dark:text-gray-300 hover:text-white transition-colors duration-200">Home</Link></li>
                        <li><Link to="/about" className="text-blue-200 dark:text-gray-300 hover:text-white transition-colors duration-200">About Us</Link></li>
                        <li><Link to="/upgrade" className="text-blue-200 dark:text-gray-300 hover:text-white transition-colors duration-200">Upgrade Plan</Link></li>
                        <li><Link to="/" className="text-blue-200 dark:text-gray-300 hover:text-white transition-colors duration-200">Start Practice</Link></li>
                    </ul>
                </div>

                {/* Connect With Us */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
                    <div className="flex justify-center md:justify-start space-x-4">
                        <a href="https://github.com/Hariom-Ingle" className="text-blue-200 dark:text-gray-300 hover:text-white transition-colors duration-200">
                            <Github className="h-6 w-6" />
                        </a>
                        <a href="https://www.linkedin.com/in/hariom-ingle/" className="text-blue-200 dark:text-gray-300 hover:text-white transition-colors duration-200">
                            <Linkedin className="h-6 w-6" />
                        </a>
                        <a href="https://x.com/HariomIngle025" className="text-blue-200 dark:text-gray-300 hover:text-white transition-colors duration-200">
                            <Twitter className="h-6 w-6" />
                        </a>
                    </div>
                    <p className="text-blue-200 dark:text-gray-400 text-sm mt-4">
                        &copy; {new Date().getFullYear()} AI Interview Coach. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
