"use client";

import { Film, Heart, Globe, Share2, Send } from "lucide-react";
import Image from "next/image";

export default function Footer({ setActiveTab, setSelectedGenre }) {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#07090e] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div
              onClick={() => {
                setActiveTab("home");
                setSelectedGenre(null);
              }}
              className=""
            >

              <div>
                <div className="mx-[-25px]">
                  <Image src="/Logo.svg" alt="logo" width={230} height={100} />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore thousands of top-rated movies and popular TV series. Watch official trailers and high definition videos instantly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab("home");
                    setSelectedGenre(null);
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("movies");
                    setSelectedGenre(null);
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Movies
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("tv");
                    setSelectedGenre(null);
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  TV Series
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("genre");
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Genres
                </button>
              </li>
            </ul>
          </div>

          {/* Top Genres */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Popular Genres
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setSelectedGenre({ id: 28, name: "Action" });
                    setActiveTab("genre");
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Action & Adventure
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedGenre({ id: 35, name: "Comedy" });
                    setActiveTab("genre");
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Comedy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedGenre({ id: 878, name: "Sci-Fi" });
                    setActiveTab("genre");
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Science Fiction
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedGenre({ id: 27, name: "Horror" });
                    setActiveTab("genre");
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Horror & Mystery
                </button>
              </li>
            </ul>
          </div>

          {/* TMDB API Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Powered By TMDB
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              This product uses the TMDB API but is not endorsed or certified by TMDB. All movie content and artwork are property of their respective owners.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <Globe className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
              <Share2 className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
              <Send className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} CINEHUB. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for movie lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
