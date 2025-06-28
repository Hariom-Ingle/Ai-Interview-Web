import React from 'react';
import { PhoneCall, Users, CalendarDays, History } from 'lucide-react'; // Importing relevant icons from lucide-react

export default function InterviewerDashboard() {
  // Define the data for each dashboard card
  const dashboardCards = [
    {
      id: 'new-call',
      icon: PhoneCall,
      title: 'New Call',
      description: 'Start an instant call',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverBgColor: 'hover:bg-green-100',
      borderColor: 'border-green-100',
    },
    {
      id: 'join-interview',
      icon: Users,
      title: 'Join Interview',
      description: 'Enter via invitation link',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverBgColor: 'hover:bg-purple-100',
      borderColor: 'border-purple-100',
    },
    {
      id: 'schedule',
      icon: CalendarDays,
      title: 'Schedule',
      description: 'Plan upcoming interviews',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverBgColor: 'hover:bg-blue-100',
      borderColor: 'border-blue-100',
    },
    {
      id: 'recordings',
      icon: History,
      title: 'Recordings',
      description: 'Access past interviews',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverBgColor: 'hover:bg-orange-100',
      borderColor: 'border-orange-100',
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center md:text-left">
          Interviewer Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon; // Get the Lucide icon component
            return (
              <div
                key={card.id}
                className={`
                  ${card.bgColor} ${card.hoverBgColor}
                  border ${card.borderColor}
                  rounded-xl shadow-md p-6
                  flex flex-col items-center text-center
                  transition-all duration-300 transform hover:scale-105
                  cursor-pointer
                  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700
                `}
              >
                <div className={`p-3 rounded-full ${card.bgColor} dark:bg-gray-700 mb-4`}>
                  <IconComponent className={`w-8 h-8 ${card.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}