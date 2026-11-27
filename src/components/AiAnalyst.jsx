import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  Settings, 
  Key, 
  Zap,
  Cpu,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { processChatQuery } from '../utils/aiAnalystEngine';

function FormattedMessage({ text, isUser }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <div key={i} className={line.trim() === '' ? 'h-2' : ''}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={j} className={isUser ? 'font-semibold text-white' : 'font-semibold text-[#172033]'}>
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function AiAnalyst({ 
  campaigns, 
  historicalCampaigns, 
  tasks, 
  mode, 
  targets,
  onApproveTask,
  messages,
  setMessages
}) {
  // Environment-configured Groq API key (configured in .env or Settings UI)
  const envGroqKey = import.meta.env.VITE_GROQ_API_KEY || '';

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('festgrowth_llm_api_key') || 
           localStorage.getItem('festgrowth_groq_api_key') || 
           localStorage.getItem('festgrowth_gemini_api_key') || 
           envGroqKey;
  });
  const [keyInput, setKeyInput] = useState(apiKey);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSaveApiKey = (newKey) => {
    const trimmed = (newKey || '').trim();
    setApiKey(trimmed);
    setKeyInput(trimmed);
    localStorage.setItem('festgrowth_llm_api_key', trimmed);
    setShowSettings(false);
  };

  const handleRestoreDefaultGroq = () => {
    handleSaveApiKey(envGroqKey);
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await processChatQuery({
        query,
        campaigns,
        historicalCampaigns,
        tasks,
        mode,
        targets,
        apiKey: apiKey
      });

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.text,
        proposedTask: response.proposedTask,
        taskApproved: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Error processing query: ${err.message}. Running fallback telemetry analysis.`,
        proposedTask: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApprove = (msgId, task) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    onApproveTask({
      ...task,
      ai_suggested: true
    });

    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return { ...m, taskApproved: true };
      }
      return m;
    }));
  };

  const quickPrompts = [
    { label: "Which campaign is underperforming?", prompt: "Which campaign is underperforming and why?" },
    { label: "Compare Meera and Arjun's campaigns", prompt: "Compare the campaigns managed by Meera versus Arjun" },
    { label: "Recommend scale actions", prompt: "What data-backed actions do you recommend to hit our 10,000 attendee target?" },
    { label: "Scenario: -20% Ad Budget", prompt: "What if we reduce the advertising budget by 20%?" },
    { label: "Test Uncertainty: Mumbai Attendees?", prompt: "How many attendees will come from Mumbai next year?" }
  ];

  const isGroqActive = apiKey.trim().startsWith('gsk_');
  const isGeminiActive = !isGroqActive && apiKey.trim().length > 10;
  const isLLMActive = isGroqActive || isGeminiActive;

  return (
    <div className="h-[780px] flex flex-col bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl overflow-hidden shadow-sm">
      {/* Copilot Header */}
      <div className="px-5 py-4 bg-[#FFFFFF] border-b border-[#E4E7EC] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EBF0F5] text-[#315B7D] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-semibold text-[#172033]">AI Growth Analyst & Copilot</h3>
              {isGroqActive ? (
                <span className="text-[11px] font-mono text-[#28745D] bg-[#EAF3F0] px-2 py-0.5 rounded font-medium flex items-center gap-1.5 border border-[#28745D]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28745D] animate-pulse" />
                  ⚡ Groq LPU Live (Qwen-3.8 / GPT-OSS)
                </span>
              ) : isGeminiActive ? (
                <span className="text-[11px] font-mono text-[#28745D] bg-[#EAF3F0] px-2 py-0.5 rounded font-medium flex items-center gap-1.5 border border-[#28745D]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28745D] animate-pulse" />
                  Gemini 2.5 Flash Live
                </span>
              ) : (
                <span className="text-[11px] font-mono text-[#315B7D] bg-[#EBF0F5] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-[#315B7D]" /> Embedded Telemetry Engine
                </span>
              )}
            </div>
            <p className="text-[12px] text-[#667085]">
              {isGroqActive
                ? 'High-speed cloud inference on Groq LPUs (~200ms latency) evaluating live event metrics.'
                : 'Real-time calculations grounded in current campaigns and task telemetry.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setKeyInput(apiKey);
            setShowSettings(!showSettings);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition cursor-pointer ${
            isLLMActive 
              ? 'bg-[#EAF3F0] border-[#28745D]/30 text-[#28745D]' 
              : 'bg-[#F2F4F7] border-[#E4E7EC] text-[#667085] hover:text-[#172033]'
          }`}
          title="Engine Configuration"
        >
          <Key className="w-3.5 h-3.5" />
          <span>{isGroqActive ? '⚡ Groq Connected' : isGeminiActive ? 'Gemini API Connected' : 'Configure LLM'}</span>
        </button>
      </div>

      {/* Settings Drawer */}
      {showSettings && (
        <div className="bg-[#F9FAFB] p-4 border-b border-[#E4E7EC] text-[13px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-[#172033] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#315B7D]" /> AI Engine Configuration (Groq Cloud / Google Gemini)
            </span>
            <span className="text-[11px] font-mono text-[#667085]">
              {isGroqActive ? 'Status: ⚡ Groq Cloud LPU Active' : isGeminiActive ? 'Status: Google Gemini Active' : 'Status: Embedded Telemetry Engine'}
            </span>
          </div>
          <p className="text-[#667085] text-[12px] mb-2 leading-relaxed">
            Connected to <strong>Groq Cloud</strong> with your provided API key (<span className="font-mono text-[#315B7D]">gsk_...</span>). Groq executes real-time inference on custom LPUs with sub-second latency. You can also paste a Google Gemini API key (<span className="font-mono">AIzaSy...</span>) or clear the key to use the embedded deterministic engine.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Paste Groq (gsk_...) or Gemini (AIzaSy...) key"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="flex-1 bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-1.5 text-[#172033] font-mono text-[12px] focus:outline-none focus:border-[#315B7D]"
            />
            <button
              onClick={() => handleSaveApiKey(keyInput)}
              className="px-4 py-1.5 rounded-lg bg-[#315B7D] hover:bg-[#274B68] text-white font-medium text-[12px] cursor-pointer"
            >
              Save Key
            </button>
            <button
              onClick={handleRestoreDefaultGroq}
              className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F2F4F7] text-[#315B7D] border border-[#E4E7EC] font-medium text-[12px] cursor-pointer"
              title="Restore user-provided Groq Key"
            >
              Reset Groq
            </button>
            {isLLMActive && (
              <button
                onClick={() => handleSaveApiKey('')}
                className="px-3 py-1.5 rounded-lg bg-[#F2F4F7] hover:bg-[#E4E7EC] text-[#B54747] font-medium text-[12px] cursor-pointer"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      )}

      {/* Preset Action Chips */}
      <div className="px-5 py-2.5 bg-[#F9FAFB] border-b border-[#E4E7EC] flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-medium text-[#667085] uppercase shrink-0">Prompts:</span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp.prompt)}
            className="shrink-0 text-[12px] px-3 py-1 rounded-md bg-[#FFFFFF] hover:bg-[#F2F4F7] text-[#172033] border border-[#E4E7EC] transition cursor-pointer font-medium"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FDFDFD]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-[#EBF0F5] text-[#315B7D] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-xl p-4 text-[13px] leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-[#315B7D] text-white rounded-br-none shadow-xs font-normal'
                : 'bg-[#F9FAFB] border border-[#E4E7EC] text-[#172033] rounded-bl-none shadow-xs'
            }`}>
              <div className="leading-relaxed">
                <FormattedMessage text={msg.text} isUser={msg.sender === 'user'} />
              </div>

              {/* Proposed Task Card */}
              {msg.proposedTask && (
                <div className="mt-4 p-4 rounded-lg bg-[#FFFFFF] border border-[#D0D5DD] shadow-sm">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#E4E7EC]">
                    <span className="flex items-center gap-1.5 font-medium text-[#315B7D] text-[11px] uppercase tracking-wide">
                      <Zap className="w-3.5 h-3.5 text-[#315B7D]" />
                      Proposed Execution Task
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#FFF4E5] text-[#A15C00]">
                      {msg.proposedTask.priority} Priority
                    </span>
                  </div>

                  <div className="font-semibold text-[#172033] text-[14px] mb-1">
                    {msg.proposedTask.title}
                  </div>
                  <div className="text-[12px] text-[#667085] mb-3">
                    {msg.proposedTask.notes}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#667085] font-mono mb-3 bg-[#F9FAFB] p-2.5 rounded border border-[#E4E7EC]">
                    <div>Owner: <strong className="text-[#172033] font-sans font-medium">{msg.proposedTask.owner}</strong></div>
                    <div>Deadline: <strong className="text-[#172033] font-medium">{msg.proposedTask.deadline}</strong></div>
                  </div>

                  {msg.taskApproved ? (
                    <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-[#EAF3F0] text-[#28745D] font-medium text-[12px]">
                      <CheckCircle2 className="w-4 h-4" />
                      Task Approved & Added to Task Manager
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApprove(msg.id, msg.proposedTask)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-[#315B7D] hover:bg-[#274B68] text-white font-medium text-[12px] transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve & Create Task in Task Manager
                    </button>
                  )}
                </div>
              )}

              <div className="mt-2 text-[11px] text-[#98A2B3] text-right font-mono">
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-[#E4E7EC] text-[#475467] flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-lg bg-[#EBF0F5] text-[#315B7D] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#F9FAFB] border border-[#E4E7EC] rounded-xl rounded-bl-none px-4 py-2 text-[12px] text-[#667085] flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#315B7D] animate-ping" />
              {isGeminiActive ? "Calling Google Gemini 2.5 Flash model..." : "Analyzing live telemetry across campaigns and tasks..."}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-[#FFFFFF] border-t border-[#E4E7EC]">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2.5"
        >
          <input
            type="text"
            placeholder="Ask anything: 'Compare Meera and Arjun', 'What is the spend on C01?', 'What tasks are pending?'..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-4 py-2.5 text-[13px] text-[#172033] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#315B7D]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-lg bg-[#315B7D] hover:bg-[#274B68] disabled:opacity-40 text-white transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
