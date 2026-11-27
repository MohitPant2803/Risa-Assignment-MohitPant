import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';

export default function SlideViewerModal({ isOpen, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(1);

  if (!isOpen) return null;

  const slides = [
    { num: 1, title: "Slide 1: How High Can You Aim?", src: "/slide_1.png" },
    { num: 2, title: "Slide 2: Where Will You Place Your Bets?", src: "/slide_2.png" },
    { num: 3, title: "Slide 3: How Will You Know What's Working?", src: "/slide_3.png" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl max-w-5xl w-full flex flex-col shadow-2xl relative overflow-hidden max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-3.5 bg-[#FFFFFF] border-b border-[#E4E7EC] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-lg bg-[#EBF0F5] text-[#315B7D]">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-[16px] font-semibold text-[#172033]">
                RISA Strategy Deck: DILLIVERSE 2027 (Exactly 3 Slides)
              </h3>
              <p className="text-[12px] text-[#667085]">Candidate: Mohit • Challenge A: Attendee Growth</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/RISA_Growth_APM_Strategy_Mohit.pdf"
              download="RISA_Growth_APM_Strategy_Mohit.pdf"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#315B7D] hover:bg-[#274B68] text-white font-medium text-[12px] shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#F2F4F7] text-[#667085] hover:text-[#172033] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Image Preview Container */}
        <div className="flex-1 bg-[#F9FAFB] flex items-center justify-center p-4 overflow-hidden relative">
          <img
            src={slides[currentSlide - 1].src}
            alt={slides[currentSlide - 1].title}
            className="max-h-[72vh] max-w-full object-contain rounded-lg border border-[#E4E7EC] shadow-md"
          />

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
            disabled={currentSlide === 1}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#FFFFFF] hover:bg-[#F9FAFB] border border-[#E4E7EC] text-[#172033] shadow-md disabled:opacity-30 transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide(Math.min(3, currentSlide + 1))}
            disabled={currentSlide === 3}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#FFFFFF] hover:bg-[#F9FAFB] border border-[#E4E7EC] text-[#172033] shadow-md disabled:opacity-30 transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Bar with thumbnails */}
        <div className="px-6 py-3 bg-[#FFFFFF] border-t border-[#E4E7EC] flex justify-between items-center">
          <div className="flex gap-2">
            {slides.map(s => (
              <button
                key={s.num}
                onClick={() => setCurrentSlide(s.num)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition cursor-pointer ${
                  currentSlide === s.num
                    ? 'bg-[#315B7D] text-white'
                    : 'bg-[#F2F4F7] text-[#667085] hover:text-[#172033]'
                }`}
              >
                Slide {s.num}
              </button>
            ))}
          </div>

          <span className="text-[12px] text-[#667085] font-medium">
            {slides[currentSlide - 1].title}
          </span>
        </div>
      </div>
    </div>
  );
}
