import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  X, 
  CheckCircle2
} from 'lucide-react';

export default function EvaluatorWalkthroughModal({ 
  isOpen, 
  onClose, 
  onRunQuery, 
  setActiveTab 
}) {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: "1. Identify a Problem",
      prompt: "Which campaign is underperforming and why?",
      description: "Ask the AI copilot to identify weak channels using empirical data rather than general marketing theory.",
      actionText: "Send Query to AI Copilot",
      targetTab: "ai"
    },
    {
      step: 2,
      title: "2. AI Investigates & Diagnoses",
      prompt: null,
      description: "Observe the AI copilot dissecting top-of-funnel reach versus bottom-of-funnel show-up rates. It isolates Paid Social (50% show-up, ₹273.53 CPA) and contrasts it with College Partnerships (85.6% show-up, ₹80.52 CPA).",
      actionText: "View AI Response",
      targetTab: "ai"
    },
    {
      step: 3,
      title: "3. AI Recommends Prescriptive Action",
      prompt: "What data-backed actions do you recommend to hit our 10,000 attendee target?",
      description: "The AI advises cutting cold paid ad sets and shifting ₹50,000 to Campus Ambassadors and Viral Squad Passes.",
      actionText: "Request Recommendation",
      targetTab: "ai"
    },
    {
      step: 4,
      title: "4. User Approves Action (Insight-to-Execution)",
      prompt: null,
      description: "The AI prepares an execution task card inside the chat thread with Owner (Meera Iyer), Deadline, and Priority. Click 'Approve & Create Task in Task Manager'.",
      actionText: "Approve Task in Chat",
      targetTab: "ai"
    },
    {
      step: 5,
      title: "5. Verify Task Creation in Task Manager",
      prompt: null,
      description: "Switch to the Task Manager. Notice the new task has been instantiated with status 'Pending', linked to the ambassador campaign, tagged as 'AI Created', and saved to storage.",
      actionText: "Open Task Manager",
      targetTab: "tasks"
    },
    {
      step: 6,
      title: "6. Modify Campaign Data & Observe Live Dashboard",
      prompt: null,
      description: "In the Campaign Manager, edit any campaign's spend or attendee numbers. Switch to the Analytics Dashboard to watch all funnel conversions, CPA, and charts update immediately in real time.",
      actionText: "Open Campaign Manager",
      targetTab: "campaigns"
    },
    {
      step: 7,
      title: "7. Test a Follow-Up Scenario",
      prompt: "What if we reduce the advertising budget by 20%?",
      description: "Ask the AI copilot to model the exact financial and attendee impact of reducing ad budgets by 20%. The AI calculates net attendee gains if reallocated to ambassadors.",
      actionText: "Simulate -20% Ad Budget",
      targetTab: "ai"
    },
    {
      step: 8,
      title: "8. Test Uncertainty Handling",
      prompt: "How many attendees will come from Mumbai next year?",
      description: "Ask an unanswerable question. The AI copilot explicitly refuses to hallucinate, stating that the dataset only covers Delhi NCR campuses and multi-year external forecasts are ungrounded.",
      actionText: "Test Uncertainty Query",
      targetTab: "ai"
    }
  ];

  const current = steps[currentStep - 1];

  const handleExecute = () => {
    setActiveTab(current.targetTab);
    if (current.prompt) {
      onRunQuery(current.prompt);
    }
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl max-w-xl w-full p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#667085] hover:text-[#172033]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1 rounded bg-[#EBF0F5] text-[#315B7D]">
            <Play className="w-4 h-4 fill-[#315B7D]" />
          </span>
          <span className="text-[12px] font-mono font-medium text-[#315B7D]">
            Evaluation Requirement • Module 5
          </span>
        </div>

        <h3 className="text-[18px] font-semibold text-[#172033] mb-1">
          Complete 8-Step Workflow Demonstration
        </h3>
        <p className="text-[13px] text-[#667085] mb-5 leading-relaxed">
          Demonstrating identification of problems, investigation, recommendations, task execution, live recalculations, scenario testing, and uncertainty handling.
        </p>

        {/* Stepper Pills */}
        <div className="grid grid-cols-8 gap-1.5 mb-5">
          {steps.map((s) => (
            <div
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`h-2 rounded-full cursor-pointer transition ${
                s.step === currentStep 
                  ? 'bg-[#315B7D]' 
                  : s.step < currentStep 
                  ? 'bg-[#28745D]' 
                  : 'bg-[#E4E7EC]'
              }`}
              title={`Step ${s.step}: ${s.title}`}
            />
          ))}
        </div>

        {/* Step Card Content */}
        <div className="bg-[#F9FAFB] border border-[#E4E7EC] rounded-lg p-5 mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-mono text-[#315B7D] font-semibold">
              STEP {current.step} OF 8
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#E4E7EC] text-[#475467]">
              Tab: {current.targetTab.toUpperCase()}
            </span>
          </div>

          <h4 className="text-[15px] font-semibold text-[#172033] mb-1.5">{current.title}</h4>
          <p className="text-[13px] text-[#667085] leading-relaxed mb-3">
            {current.description}
          </p>

          {current.prompt && (
            <div className="p-3 bg-[#FFFFFF] border border-[#E4E7EC] rounded-md text-[12px] font-mono text-[#172033]">
              <span className="text-[#667085] block text-[10px] font-sans mb-0.5">Query to trigger:</span>
              "{current.prompt}"
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F2F4F7] text-[#172033] hover:bg-[#E4E7EC] disabled:opacity-40 text-[12px] font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          <button
            onClick={handleExecute}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#315B7D] hover:bg-[#274B68] text-white text-[12px] font-medium transition cursor-pointer"
          >
            {current.actionText} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
