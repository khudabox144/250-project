"use client";

import React, { useState, useEffect, useRef } from "react";

export default function HeroSliderClient({ tourData }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playing, setPlaying] = useState(true);
    const intervalRef = useRef(null);
    const hoverRef = useRef(false);

    const AUTO_MS = 4500;

    useEffect(() => {
        if (!playing) return;
        intervalRef.current = setInterval(() => {
            if (!hoverRef.current) {
                setCurrentIndex((prev) => (prev + 1) % tourData.length);
            }
        }, AUTO_MS);
        return () => clearInterval(intervalRef.current);
    }, [playing]);

    return (
        <div
            className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-r from-[#2b6cb0] to-[#e53e3e]"
            onMouseEnter={() => (hoverRef.current = true)}
            onMouseLeave={() => (hoverRef.current = false)}
            style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${tourData[currentIndex].imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="relative z-10 p-10 text-white">
                <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4">
                    Book the Best Tours & River Cruises
                </h1>

                <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-white text-black text-sm font-bold px-3 py-1 rounded-full">
                        {tourData[currentIndex].title}
                    </span>
                    <p className="text-lg">{tourData[currentIndex].saleText}</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center space-x-3 z-10">

                <button
                    onClick={() => setCurrentIndex((i) => (i - 1 + tourData.length) % tourData.length)}
                    className="p-3 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full"
                >
                    ◀
                </button>

                <button
                    onClick={() => setCurrentIndex((i) => (i + 1) % tourData.length)}
                    className="p-3 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full"
                >
                    ▶
                </button>

                <button
                    onClick={() => setPlaying((p) => !p)}
                    className="p-3 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full"
                >
                    {playing ? "❚❚" : "►"}
                </button>
            </div>
        </div>
    );
}
