import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  IndianRupee, 
  Target, 
  Layers, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid,
  Legend
} from 'recharts';

export default function AnalyticsDashboard({ 
  campaigns, 
  mode, 
  timeSeries = [],
  onOpenCampaignManager,
  onOpenAIWithPrompt
}) {
  const [reallocAmount, setReallocAmount] = useState(50000);

  // Overall Calculations
  const totalSpend = campaigns.reduce((acc, c) => acc + Number(c.spend || 0), 0);
  const totalBudget = campaigns.reduce((acc, c) => acc + Number(c.budget || 0), 0);
  const totalRegistrations = campaigns.reduce((acc, c) => acc + Number(c.registrations || 0), 0);
  const totalAttendees = campaigns.reduce((acc, c) => acc + Number(c.attendees || 0), 0);
  const totalReach = campaigns.reduce((acc, c) => acc + Number(c.reach || 0), 0);
  const totalSessions = campaigns.reduce((acc, c) => acc + Number(c.sessions || 0), 0);

  const blendedCPR = totalRegistrations > 0 ? (totalSpend / totalRegistrations).toFixed(2) : '0';
  const blendedCPA = totalAttendees > 0 ? (totalSpend / totalAttendees).toFixed(2) : '0';
  const showUpRate = totalRegistrations > 0 ? ((totalAttendees / totalRegistrations) * 100).toFixed(1) : '0';

  // Target metrics
  const targetAttendees = mode === 'historical' ? 2200 : 10000;
  const targetRegistrations = mode === 'historical' ? 3200 : 12500;
  const targetBudget = mode === 'historical' ? 300000 : 1200000;
  const venueCapacity = 18000; // JLN Stadium licensed capacity
  
  const attendeeAttainment = ((totalAttendees / targetAttendees) * 100).toFixed(1);
  const budgetUtilization = ((totalSpend / targetBudget) * 100).toFixed(1);
  const venueUtilization = ((totalAttendees / venueCapacity) * 100).toFixed(1);

  // Funnel Data with conversion metrics
  const funnelData = [
    { stage: '1. Reach', count: totalReach, color: '#315B7D', sub: 'Targeted Student Reach' },
    { stage: '2. Sessions', count: totalSessions, color: '#475467', sub: 'Portal Engagements' },
    { stage: '3. Form Starts', count: Math.round(totalRegistrations * 1.35), color: '#667085', sub: 'Cart Initiations' },
    { stage: '4. Completed Regs', count: totalRegistrations, color: '#28745D', sub: 'Issued Passes' },
    { stage: '5. Verified Attendees', count: totalAttendees, color: '#315B7D', sub: 'Physical Admissions' }
  ];

  // Campaign Comparison Data
  const comparisonData = campaigns.map(c => ({
    name: c.name.length > 15 ? c.name.substring(0, 14) + '...' : c.name,
    fullName: c.name,
    registrations: Number(c.registrations || 0),
    attendees: Number(c.attendees || 0),
    cpa: Number(c.cpa || 0),
    showUpRate: Number(c.show_up_rate || 0),
    spend: Number(c.spend || 0)
  }));

  // Budget Allocation Palette
  const PALETTE = ['#315B7D', '#28745D', '#A15C00', '#53389E', '#175CD3', '#026AA2', '#667085'];
  const budgetPieData = campaigns.map((c, i) => ({
    name: c.name,
    value: Number(c.spend || 0),
    color: PALETTE[i % PALETTE.length]
  }));

  // Simulator Math
  const sortedByCPA = [...campaigns].sort((a, b) => (a.cpa || 999) - (b.cpa || 999));
  const bestCamp = sortedByCPA[0] || { name: 'Campus Ambassadors', cpa: 75 };
  const worstCamp = sortedByCPA[sortedByCPA.length - 1] || { name: 'Paid Social', cpa: 270 };
  
  const lostAttendeesFromCut = Math.round(reallocAmount / (worstCamp.cpa || 200));
  const gainedAttendeesFromAdd = Math.round(reallocAmount / (bestCamp.cpa || 80));
  const netAttendeeGain = Math.max(0, gainedAttendeesFromAdd - lostAttendeesFromCut);

  return (
    <div className="space-y-6">
      {/* Overview Context Card */}
      <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl p-6 shadow-sm flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[12px] font-mono text-[#315B7D] font-medium bg-[#EBF0F5] px-2 py-0.5 rounded">
              North Star Target
            </span>
            <span className="text-[12px] text-[#667085]">
              • Delhi NCR Campus Ecosystem
            </span>
          </div>
          <h2 className="text-[28px] font-semibold text-[#172033] tracking-tight">
            {mode === 'dilliverse' ? '10,000 Verified Student Attendees' : 'CampusFest 2025 Historical Baseline'}
          </h2>
          <p className="text-[14px] text-[#667085] max-w-2xl mt-1 leading-relaxed">
            Optimizing for physical check-in attendance rather than top-of-funnel registration volume.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#F9FAFB] p-4 rounded-lg border border-[#E4E7EC] shrink-0">
          <div>
            <div className="text-[11px] font-mono text-[#667085] uppercase tracking-wider">Target Attainment</div>
            <div className="text-[30px] font-semibold text-[#315B7D] leading-tight tnum font-mono">
              {attendeeAttainment}%
            </div>
            <div className="text-[11px] font-mono text-[#667085] mt-0.5">
              {totalAttendees.toLocaleString('en-IN')} / {targetAttendees.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="h-10 w-px bg-[#E4E7EC]" />

          <div>
            <div className="text-[11px] font-mono text-[#667085] uppercase tracking-wider">Venue Capacity (JLN 18K)</div>
            <div className="text-[30px] font-semibold text-[#172033] leading-tight tnum font-mono">
              {venueUtilization}%
            </div>
            <div className="text-[11px] font-mono text-[#28745D] mt-0.5">
              Safe crowd capacity
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Verified Attendees */}
        <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[12px] font-medium text-[#667085]">Verified Attendees</span>
              <span className="p-1 rounded bg-[#EBF0F5] text-[#315B7D]">
                <UserCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 text-[32px] font-semibold text-[#172033] tnum font-mono">
              {totalAttendees.toLocaleString('en-IN')}
            </div>
            <div className="text-[12px] text-[#667085] mt-1">
              Target: {targetAttendees.toLocaleString('en-IN')} admissions
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex justify-between items-center text-[12px]">
            <span className="text-[#667085]">Show-up rate:</span>
            <span className="font-semibold text-[#28745D] tnum font-mono">{showUpRate}%</span>
          </div>
        </div>

        {/* Card 2: Registrations */}
        <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[12px] font-medium text-[#667085]">Total Registrations</span>
              <span className="p-1 rounded bg-[#F2F4F7] text-[#475467]">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 text-[32px] font-semibold text-[#172033] tnum font-mono">
              {totalRegistrations.toLocaleString('en-IN')}
            </div>
            <div className="text-[12px] text-[#667085] mt-1">
              Goal: {targetRegistrations.toLocaleString('en-IN')} registrations
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex justify-between items-center text-[12px]">
            <span className="text-[#667085]">Registration conversion:</span>
            <span className="font-semibold text-[#172033] tnum font-mono">{showUpRate}%</span>
          </div>
        </div>

        {/* Card 3: Campaign Spending */}
        <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[12px] font-medium text-[#667085]">Campaign Spending</span>
              <span className="p-1 rounded bg-[#F2F4F7] text-[#475467]">
                <IndianRupee className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 text-[32px] font-semibold text-[#172033] tnum font-mono">
              ₹{totalSpend.toLocaleString('en-IN')}
            </div>
            <div className="text-[12px] text-[#667085] mt-1">
              Budget limit: ₹{targetBudget.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex justify-between items-center text-[12px]">
            <span className="text-[#667085]">Budget utilized:</span>
            <span className="font-semibold text-[#315B7D] tnum font-mono">{budgetUtilization}%</span>
          </div>
        </div>

        {/* Card 4: Unit Economics (CPA) */}
        <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[12px] font-medium text-[#667085]">Cost per Attendee (CPA)</span>
              <span className="p-1 rounded bg-[#EAF3F0] text-[#28745D]">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 text-[32px] font-semibold text-[#28745D] tnum font-mono">
              ₹{blendedCPA}
            </div>
            <div className="text-[12px] text-[#667085] mt-1">
              Base target limit: ₹120.00
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex justify-between items-center text-[12px]">
            <span className="text-[#667085]">Cost per reg (CPR):</span>
            <span className="font-semibold text-[#172033] tnum font-mono">₹{blendedCPR}</span>
          </div>
        </div>
      </div>

      {/* Reallocation Simulator Tool */}
      <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-3 border-b border-[#E4E7EC]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#EBF0F5] text-[#315B7D]">
                <Sliders className="w-4 h-4" />
              </span>
              <h3 className="text-[18px] font-semibold text-[#172033]">
                Budget Reallocation Modeling
              </h3>
            </div>
            <p className="text-[14px] text-[#667085] mt-0.5">
              Simulate shifting spend from higher-cost channels ({worstCamp.name} at ₹{worstCamp.cpa} CPA) to higher-efficiency channels ({bestCamp.name} at ₹{bestCamp.cpa} CPA).
            </p>
          </div>

          <button
            onClick={() => onOpenAIWithPrompt(`What if we reduce ${worstCamp.name} budget by 20%?`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EBF0F5] hover:bg-[#D9E2EC] text-[#315B7D] text-[12px] font-medium transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Model via AI Copilot
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Slider input */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-[#172033] font-medium">Reallocation amount:</span>
              <span className="text-[#315B7D] font-semibold font-mono text-[14px]">₹{reallocAmount.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="100000"
              step="5000"
              value={reallocAmount}
              onChange={(e) => setReallocAmount(Number(e.target.value))}
              className="w-full accent-[#315B7D] cursor-pointer h-2 bg-[#E4E7EC] rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-mono text-[#667085]">
              <span>₹10,000</span>
              <span>₹50,000 (Recommended)</span>
              <span>₹100,000</span>
            </div>
          </div>

          {/* Result card */}
          <div className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E4E7EC] text-[12px] space-y-2">
            <div className="text-[11px] font-mono text-[#667085] uppercase font-semibold">Simulated Net Impact</div>
            <div className="flex justify-between items-center">
              <span className="text-[#667085]">Reduce {worstCamp.name.split(' ')[0]}:</span>
              <span className="text-[#B54747] font-semibold font-mono">-{lostAttendeesFromCut} attendees</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#667085]">Increase {bestCamp.name.split(' ')[0]}:</span>
              <span className="text-[#28745D] font-semibold font-mono">+{gainedAttendeesFromAdd} attendees</span>
            </div>
            <div className="pt-2 border-t border-[#E4E7EC] flex justify-between items-baseline">
              <span className="font-semibold text-[#172033]">Net attendee gain:</span>
              <span className="text-[16px] font-semibold text-[#28745D] font-mono">+{netAttendeeGain} attendees</span>
            </div>
            <div className="text-[11px] text-[#667085]">
              *No increase in overall marketing expenditure.
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row: Funnel Pipeline & Spend Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pass-to-Gate Pipeline (2 Cols) */}
        <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl p-5 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#E4E7EC]">
            <div>
              <h3 className="text-[18px] font-semibold text-[#172033] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#315B7D]" />
                Growth Funnel & Conversion Stages
              </h3>
              <p className="text-[12px] text-[#667085]">Progression from student reach to verified turnstile check-ins</p>
            </div>
            <span className="text-[12px] font-mono px-2.5 py-1 rounded bg-[#F9FAFB] text-[#315B7D] border border-[#E4E7EC]">
              Overall conversion: <strong className="text-[#172033]">{((totalAttendees / (totalReach || 1)) * 100).toFixed(2)}%</strong>
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#F2F4F7" />
                <XAxis type="number" stroke="#98A2B3" tick={{ fontSize: 11, fill: '#667085' }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                <YAxis dataKey="stage" type="category" stroke="#98A2B3" tick={{ fontSize: 12, fill: '#172033' }} width={140} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E4E7EC', borderRadius: '8px', color: '#172033', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                  formatter={(val) => [Number(val).toLocaleString('en-IN'), 'People']}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spend Allocation Donut */}
        <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#E4E7EC]">
            <h3 className="text-[18px] font-semibold text-[#172033]">Spend Allocation</h3>
            <span className="text-[12px] font-mono text-[#667085]">₹{(totalSpend/1000).toFixed(0)}k total</span>
          </div>

          <div className="h-64 flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {budgetPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E4E7EC', borderRadius: '8px', color: '#172033', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Spend']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Campaign Performance Breakdown Table */}
      <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-[#E4E7EC]">
          <div>
            <h3 className="text-[18px] font-semibold text-[#172033]">Campaign Performance Matrix</h3>
            <p className="text-[13px] text-[#667085]">Underlying performance metrics driving the growth model</p>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <span className="flex items-center gap-1.5 text-[#28745D]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28745D]" /> High Show-up (≥75%)
            </span>
            <span className="flex items-center gap-1.5 text-[#B54747]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B54747]" /> High CPA (&gt;₹150)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-[#667085] uppercase text-[11px] font-medium tracking-wider">
                <th className="py-3 px-3">Campaign</th>
                <th className="py-3 px-3">Channel</th>
                <th className="py-3 px-3">Owner</th>
                <th className="py-3 px-3 text-right">Spend</th>
                <th className="py-3 px-3 text-right">Registrations</th>
                <th className="py-3 px-3 text-right">Attendees</th>
                <th className="py-3 px-3 text-right">Show-Up %</th>
                <th className="py-3 px-3 text-right">CPR</th>
                <th className="py-3 px-3 text-right">CPA</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {campaigns.map((c) => {
                const cpa = Number(c.cpa || 0);
                const showUp = Number(c.show_up_rate || 0);
                return (
                  <tr key={c.id} className="hover:bg-[#F9FAFB] transition">
                    <td className="py-3 px-3 font-medium text-[#172033]">
                      <div>{c.name}</div>
                      <div className="text-[11px] text-[#667085] font-mono">{c.id}</div>
                    </td>
                    <td className="py-3 px-3 text-[#667085]">{c.channel}</td>
                    <td className="py-3 px-3 text-[#667085]">{c.owner}</td>
                    <td className="py-3 px-3 text-right text-[#172033] font-mono tnum">₹{Number(c.spend).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-[#172033] font-medium font-mono tnum">{Number(c.registrations).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-[#28745D] font-medium font-mono tnum">{Number(c.attendees).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono tnum">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        showUp >= 75 ? 'bg-[#EAF3F0] text-[#28745D]' : 'bg-[#FFF4E5] text-[#A15C00]'
                      }`}>
                        {showUp}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-[#667085] font-mono tnum">₹{c.cpr}</td>
                    <td className="py-3 px-3 text-right font-mono tnum">
                      <span className={`font-semibold ${cpa > 150 ? 'text-[#B54747]' : 'text-[#28745D]'}`}>
                        ₹{cpa}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                        c.status === 'active' 
                          ? 'bg-[#EAF3F0] text-[#28745D]' 
                          : 'bg-[#F2F4F7] text-[#667085]'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
