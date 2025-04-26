import React, { useState } from "react";
import { Dumbbell, Salad, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreatorDashboard = () => {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const navigate = useNavigate();

  const sections = [
    {
      id: "workout-plans",
      name: "Create Workout Plans",
      description:
        "Design structured and personalized workout plans for users based on their goals, fitness levels, and preferences.",
      icon: Dumbbell,
      color: "bg-gradient-to-br from-blue-500 to-indigo-500",
      hoverColor: "from-blue-600 to-indigo-600",
      route: "/creator-dashboard/create-workout",
    },
    {
      id: "diet-plans",
      name: "Build Diet Plans",
      description:
        "Craft balanced and goal-oriented meal plans, complete with nutrient breakdowns, images, and recipe instructions.",
      icon: Salad,
      color: "bg-gradient-to-br from-green-500 to-lime-500",
      hoverColor: "from-green-600 to-lime-600",
      route: "/creator/create-diet",
    },
    {
      id: "video-support",
      name: "Offer Support Sessions",
      description:
        "Connect with users who need guidance or motivation through real-time Google Meet video support.",
      icon: Video,
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
      hoverColor: "from-pink-600 to-rose-600",
      route: "/creator/video-meet",
    },
  ];

  const handleCardClick = (section) => {
    setSelectedSection(section.id);
    if (section.route) {
      navigate(section.route);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Dumbbell className="text-blue-500" size={48} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
            Creator Fitness Dashboard
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            As a creator, you empower users by crafting customized workout plans,
            diet strategies, and offering emotional or fitness support sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section) => {
            const Icon = section.icon;
            const isHovered = hoveredSection === section.id;
            const isSelected = selectedSection === section.id;

            return (
              <div
                key={section.id}
                className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                  isHovered ? "transform -translate-y-2 shadow-xl" : ""
                } ${isSelected ? "ring-4 ring-offset-2 ring-blue-400" : ""}`}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
                onClick={() => handleCardClick(section)}
              >
                <div
                  className={`${
                    section.color
                  } transition-all duration-300 cursor-pointer h-full flex flex-col ${
                    isHovered ? `bg-gradient-to-br ${section.hoverColor}` : ""
                  }`}
                >
                  <div className="p-8 flex items-center justify-center">
                    <Icon size={48} color="white" />
                  </div>

                  <div className="bg-white bg-opacity-90 p-6 flex-grow">
                    <h2 className="text-xl font-bold mb-3 text-slate-800">
                      {section.name}
                    </h2>
                    <p className="text-slate-600">{section.description}</p>

                    <div className="mt-6 flex justify-end">
                      <button
                        className={`px-4 py-2 rounded-full text-white font-medium text-sm transition-all ${
                          isHovered || isSelected
                            ? section.color
                            : "bg-slate-600"
                        }`}
                      >
                        Go
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>Begin your journey in transforming lives through fitness and support.</p>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
