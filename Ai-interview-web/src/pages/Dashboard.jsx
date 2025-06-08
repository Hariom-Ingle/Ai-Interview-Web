import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { BrainCircuit, FileText, Quote, Settings2, Sparkles, Video } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {

     const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");

  // const filteredFeatures = features.filter((feature) =>
  //   feature.title.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white-200 p-6">
      <motion.h1
        className="text-4xl font-bold text-gray-800 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        🚀 Master every question with AI by your side
      </motion.h1>

      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="bg-white/80 shadow-xl rounded-2xl hover:scale-105 transition-transform border border-purple-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="text-purple-600" />
                <h2 className="text-xl font-semibold">AI-Powered Practice</h2>
              </div>
              <p className="text-sm text-gray-700">
                Practice with AI-driven mock interviews that adapt to your skills and career goals.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="bg-white/80 shadow-xl rounded-2xl hover:scale-105 transition-transform border border-indigo-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <BrainCircuit className="text-indigo-600" />
                <h2 className="text-xl font-semibold">Real-Time Feedback</h2>
              </div>
              <p className="text-sm text-gray-700">
                Get instant feedback and scoring to understand your strengths and areas for improvement.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="bg-white/80 shadow-xl rounded-2xl hover:scale-105 transition-transform border border-pink-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Quote className="text-pink-500" />
                <h2 className="text-xl font-semibold">Inspiring Quotes</h2>
              </div>
              <p className="text-sm italic text-gray-700">
                "Success is where preparation and opportunity meet." – Bobby Unser
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Card className="bg-white/80 shadow-xl rounded-2xl hover:scale-105 transition-transform border border-green-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Video className="text-green-600" />
                <h2 className="text-xl font-semibold">Video Interviews</h2>
              </div>
              <p className="text-sm text-gray-700">
                Simulate real video interviews and improve your confidence and communication skills.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <Card className="bg-white/80 shadow-xl rounded-2xl hover:scale-105 transition-transform border border-yellow-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-yellow-600" />
                <h2 className="text-xl font-semibold">Interview Resources</h2>
              </div>
              <p className="text-sm text-gray-700">
                Access curated articles, tips, and questions to prepare efficiently.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <Card className="bg-white/80 shadow-xl rounded-2xl hover:scale-105 transition-transform border border-blue-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Settings2 className="text-blue-600" />
                <h2 className="text-xl font-semibold">Personalized Settings</h2>
              </div>
              <p className="text-sm text-gray-700">
                Customize your mock interview experience to match your preferred difficulty, domain, and more.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div> */}


    <div className="flex flex-wrap gap-4 items-center justify-center max-w-5xl mx-auto mb-10">
        <Input
          type="text"
          placeholder="Job / Internship"
          className="p-3 rounded-xl shadow border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300 w-64"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Role"
          className="p-3 rounded-xl shadow border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300 w-64"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Experience (Years)"
          className="p-3 rounded-xl shadow border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300 w-64"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
        <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition-transform">
          Start
        </Button>
      </div>

      
    </div>
  );
}
