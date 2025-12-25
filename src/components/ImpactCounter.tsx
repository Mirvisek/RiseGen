"use client";

import { motion } from "framer-motion";
import { Award, Zap, Heart, Users } from "lucide-react";

interface Stat {
    id: string;
    label: string;
    value: string;
}

export function ImpactCounter({ stats }: { stats: Stat[] }) {
    if (stats.length === 0) return null;

    return (
        <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-6xl mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="text-center space-y-2 border-r last:border-0 border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center p-4 group"
                        >
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-2xl text-indigo-600 dark:text-indigo-400 mb-2 transition-transform group-hover:scale-110 shadow-sm">
                                <Award className="h-6 w-6" />
                            </div>
                            <span className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tighter">
                                {stat.value}
                            </span>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest px-2">
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
