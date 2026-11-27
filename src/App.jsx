import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CampaignManager from './components/CampaignManager';
import TaskManager from './components/TaskManager';
import AiAnalyst from './components/AiAnalyst';
import EvaluatorWalkthroughModal from './components/EvaluatorWalkthroughModal';
import SlideViewerModal from './components/SlideViewerModal';
import festivalData from './data/festivalData.json';

export default function App() {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('festgrowth_mode') || 'dilliverse';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [isSlidesOpen, setIsSlidesOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Initialize Campaigns per mode
  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem(`festgrowth_campaigns_${mode}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return mode === 'dilliverse' ? festivalData.dilliverse_campaigns : festivalData.historical_campaigns;
  });

  // Initialize Tasks
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('festgrowth_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return festivalData.tasks;
  });

  // AI Chat Messages
  const [messages, setMessages] = useState(() => {
    return [
      {
        id: 1,
        sender: 'ai',
        text: `**Welcome to FestGrowth Growth Analyst.**\n\nI am connected to the live telemetry for **DILLIVERSE 2027** (10,000 Base Target in Delhi NCR) and the **CampusFest 2025 Baseline Dataset** (2,840 registrations, 2,050 verified visitors).\n\nKey capabilities:\n* **Diagnose Underperforming Campaigns** by comparing show-up rates against customer acquisition cost.\n* **Recommend Resource Reallocations** to achieve attendance goals within approved budget limits.\n* **Prepare Trackable Tasks** for immediate review and creation in the task manager.\n* **Simulate Scenarios** (e.g. modeling a 20% reduction in advertising spend).\n* **Maintain Empirical Boundaries** by acknowledging missing or out-of-scope data honestly.\n\nSelect a preset prompt above or enter a question below to begin.`,
        timestamp: '10:00 AM'
      }
    ];
  });

  // Switch mode listener
  useEffect(() => {
    localStorage.setItem('festgrowth_mode', mode);
    const saved = localStorage.getItem(`festgrowth_campaigns_${mode}`);
    if (saved) {
      try {
        setCampaigns(JSON.parse(saved));
      } catch (e) {
        setCampaigns(mode === 'dilliverse' ? festivalData.dilliverse_campaigns : festivalData.historical_campaigns);
      }
    } else {
      setCampaigns(mode === 'dilliverse' ? festivalData.dilliverse_campaigns : festivalData.historical_campaigns);
    }
  }, [mode]);

  // Persist Campaigns
  useEffect(() => {
    localStorage.setItem(`festgrowth_campaigns_${mode}`, JSON.stringify(campaigns));
  }, [campaigns, mode]);

  // Persist Tasks
  useEffect(() => {
    localStorage.setItem('festgrowth_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Campaign Handlers
  const handleUpdateCampaign = (updated) => {
    setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));
    showToast(`Updated campaign: ${updated.name}. Live analytics recalculated.`);
  };

  const handleCreateCampaign = (newCamp) => {
    setCampaigns(prev => [newCamp, ...prev]);
    showToast(`Created new campaign: ${newCamp.name}`);
  };

  const handleDeleteCampaign = (id) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    showToast(`Campaign removed.`);
  };

  // Task Handlers
  const handleCreateTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    showToast(`Task created: "${newTask.title}"`);
  };

  const handleUpdateTask = (updated) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    showToast(`Task updated.`);
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast(`Task deleted.`);
  };

  const handleApproveTask = (task) => {
    const newTask = {
      ...task,
      id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending'
    };
    setTasks(prev => [newTask, ...prev]);
    showToast(`Task approved: "${task.title}" added to Task Manager.`);
  };

  // Reset Data
  const handleResetData = () => {
    if (window.confirm("Reset dataset and tasks to default initial baseline?")) {
      localStorage.removeItem(`festgrowth_campaigns_${mode}`);
      localStorage.removeItem('festgrowth_tasks');
      setCampaigns(mode === 'dilliverse' ? festivalData.dilliverse_campaigns : festivalData.historical_campaigns);
      setTasks(festivalData.tasks);
      showToast("Data reset to initial RISA dataset baseline.");
    }
  };

  // Export Data
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      mode,
      campaigns,
      tasks,
      exportedAt: new Date().toISOString()
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `festgrowth_${mode}_state.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Exported JSON snapshot.");
  };

  // Direct trigger from Walkthrough
  const handleRunWalkthroughQuery = (query) => {
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setActiveTab('ai');
    
    setTimeout(() => {
      import('./utils/aiAnalystEngine').then(({ analyzeQuery }) => {
        const res = analyzeQuery({
          query,
          campaigns,
          historicalCampaigns: festivalData.historical_campaigns,
          tasks,
          mode,
          targets: festivalData.metadata.targets_summary
        });
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'ai',
          text: res.text,
          proposedTask: res.proposedTask,
          taskApproved: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#172033] flex flex-col font-sans">
      {/* Header */}
      <Header
        mode={mode}
        setMode={setMode}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
        onOpenSlides={() => setIsSlidesOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <AnalyticsDashboard
            campaigns={campaigns}
            mode={mode}
            timeSeries={festivalData.historical_time_series}
            onOpenCampaignManager={() => setActiveTab('campaigns')}
            onOpenAIWithPrompt={(prompt) => {
              setActiveTab('ai');
              handleRunWalkthroughQuery(prompt);
            }}
          />
        )}

        {activeTab === 'campaigns' && (
          <CampaignManager
            campaigns={campaigns}
            onUpdateCampaign={handleUpdateCampaign}
            onCreateCampaign={handleCreateCampaign}
            onDeleteCampaign={handleDeleteCampaign}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskManager
            tasks={tasks}
            campaigns={campaigns}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'ai' && (
          <AiAnalyst
            campaigns={campaigns}
            historicalCampaigns={festivalData.historical_campaigns}
            tasks={tasks}
            mode={mode}
            targets={festivalData.metadata.targets_summary}
            onApproveTask={handleApproveTask}
            messages={messages}
            setMessages={setMessages}
          />
        )}
      </main>

      {/* Modals */}
      <EvaluatorWalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
        onRunQuery={handleRunWalkthroughQuery}
        setActiveTab={setActiveTab}
      />

      <SlideViewerModal
        isOpen={isSlidesOpen}
        onClose={() => setIsSlidesOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#172033] text-white text-[13px] px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 font-medium border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-[#28745D]" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
