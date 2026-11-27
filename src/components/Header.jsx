import React from 'react';
import { 
  Play, 
  FileText, 
  Download, 
  RotateCcw, 
  MapPin, 
  Calendar,
  Sparkles,
  BarChart2
} from 'lucide-react';

export default function Header({ 
  mode, 
  setMode, 
  onResetData, 
  onExportData, 
  onOpenWalkthrough, 
  onOpenSlides, 
  activeTab, 
  setActiveTab 
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E4E7EC]">
      {/* 1. Sleek Telemetry Bar (Reduced height & simplified spacing) */}
      <div className="bg-[#F9FAFB] border-b border-[#E4E7EC] px-4 sm:px-6 py-1.5 text-[11.5px] flex flex-wrap justify-between items-center text-[#667085]">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-[#28745D] font-medium font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#28745D]" />
            Live Telemetry
          </span>
          <span className="text-[#E4E7EC] hidden sm:inline">•</span>
          <div className="flex items-center gap-1 text-[#667085]">
            <MapPin className="w-3 h-3 text-[#667085]" />
            <span>Delhi NCR</span>
          </div>
          <span className="text-[#E4E7EC] hidden md:inline">•</span>
          <div className="flex items-center gap-1 text-[#667085] hidden md:flex">
            <Calendar className="w-3 h-3 text-[#667085]" />
            <span>12–14 March 2027 • JLN Stadium (18K Cap)</span>
          </div>
          <span className="text-[#E4E7EC] hidden lg:inline">•</span>
          <span className="text-[#667085] hidden lg:inline">
            Candidate: <strong className="text-[#172033] font-medium">Mohit</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenWalkthrough}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#315B7D] hover:bg-[#274B68] text-white text-[11px] font-medium transition cursor-pointer"
          >
            <Play className="w-2.5 h-2.5 fill-white" />
            <span>Evaluator Walkthrough</span>
          </button>

          <button
            onClick={onOpenSlides}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFFFFF] hover:bg-[#F9FAFB] text-[#172033] border border-[#E4E7EC] text-[11px] font-medium transition cursor-pointer"
          >
            <FileText className="w-3 h-3 text-[#667085]" />
            <span>Strategy Slides PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Main Navigation Bar with Breathing Room & Grouped Controls */}
      <div className="px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#315B7D] flex items-center justify-center text-white font-semibold text-xs shadow-xs">
            FG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-semibold text-[#172033] tracking-tight">FestGrowth</span>
              <span className="text-[10.5px] font-mono text-[#667085] bg-[#F2F4F7] px-1.5 py-0.5 rounded border border-[#E4E7EC]">
                v2.7
              </span>
            </div>
            <div className="text-[11.5px] text-[#667085]">
              {mode === 'dilliverse' ? 'DILLIVERSE 2027 • 10,000 Verified Attendee Target' : 'CampusFest 2025 • Historical Baseline Data'}
            </div>
          </div>
        </div>

        {/* Tab Navigation with Breathing Room */}
        <nav className="flex items-center bg-[#F2F4F7] p-1 rounded-lg border border-[#E4E7EC] gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#FFFFFF] text-[#172033] shadow-xs font-semibold'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-[#FFFFFF] text-[#172033] shadow-xs font-semibold'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-[#FFFFFF] text-[#172033] shadow-xs font-semibold'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            Task Manager
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[13px] font-medium transition cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-[#315B7D] text-white shadow-xs font-semibold'
                : 'text-[#315B7D] hover:text-[#274B68]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Growth Analyst
          </button>
        </nav>

        {/* 3. Grouped Controls (Reduced Visual Competition) */}
        <div className="flex items-center gap-2.5">
          {/* Dataset Switcher Group */}
          <div className="flex items-center bg-[#F2F4F7] p-0.5 rounded-lg border border-[#E4E7EC] text-[12px]">
            <button
              onClick={() => setMode('dilliverse')}
              className={`px-3 py-1 rounded-md transition cursor-pointer font-medium ${
                mode === 'dilliverse'
                  ? 'bg-[#FFFFFF] text-[#172033] shadow-xs font-semibold'
                  : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              DILLIVERSE 2027
            </button>
            <button
              onClick={() => setMode('historical')}
              className={`px-3 py-1 rounded-md transition cursor-pointer font-medium ${
                mode === 'historical'
                  ? 'bg-[#FFFFFF] text-[#172033] shadow-xs font-semibold'
                  : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              Historical (2025)
            </button>
          </div>

          {/* Utility Action Group (Unified Border Container) */}
          <div className="flex items-center border border-[#E4E7EC] rounded-lg bg-[#FFFFFF] overflow-hidden shadow-2xs">
            <button
              onClick={onExportData}
              className="p-1.5 text-[#667085] hover:text-[#172033] hover:bg-[#F9FAFB] transition cursor-pointer border-r border-[#E4E7EC]"
              title="Export JSON telemetry state"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onResetData}
              className="p-1.5 text-[#667085] hover:text-[#B54747] hover:bg-[#F9FAFB] transition cursor-pointer"
              title="Reset telemetry to baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
