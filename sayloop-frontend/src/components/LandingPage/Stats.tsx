import React from "react";

const Stats = () => {
    const stats = [
        { label: "Active Learners", value: "30M+", icon: "👨‍🎓" },
        { label: "Countries", value: "190+", icon: "🌍" },
        { label: "Lessons Completed", value: "1B+", icon: "📚" },
        { label: "App Rating", value: "4.8", icon: "⭐" },
    ];

    return (
        <section className="py-20 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-2 group cursor-default">
                            <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">{stat.icon}</div>
                            <div className="text-3xl lg:text-4xl font-black text-gray-900">{stat.value}</div>
                            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
