import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  IndianRupee, 
  Users, 
  UserCheck, 
  Calendar, 
  Briefcase
} from 'lucide-react';

export default function CampaignManager({ 
  campaigns, 
  onUpdateCampaign, 
  onCreateCampaign, 
  onDeleteCampaign 
}) {
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});

  const handleStartEdit = (campaign) => {
    setEditingCampaign(campaign.id);
    setFormData({ ...campaign });
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setFormData({
      id: `DIL-${Math.floor(10 + Math.random() * 90)}`,
      name: '',
      channel: 'Ambassadors',
      owner: 'Mohit (Growth APM)',
      budget: 50000,
      spend: 0,
      target_registrations: 600,
      target_attendees: 500,
      reach: 60000,
      sessions: 6000,
      registrations: 0,
      attendees: 0,
      status: 'active',
      start_date: '2027-01-15',
      end_date: '2027-03-14',
      objective: ''
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const spend = Number(formData.spend || 0);
    const regs = Number(formData.registrations || 0);
    const atts = Number(formData.attendees || 0);
    const cpr = regs > 0 ? (spend / regs).toFixed(2) : 0;
    const cpa = atts > 0 ? (spend / atts).toFixed(2) : 0;
    const show_up = regs > 0 ? ((atts / regs) * 100).toFixed(1) : 0;

    const payload = {
      ...formData,
      spend,
      registrations: regs,
      attendees: atts,
      budget: Number(formData.budget || 0),
      reach: Number(formData.reach || 0),
      sessions: Number(formData.sessions || 0),
      cpr: Number(cpr),
      cpa: Number(cpa),
      show_up_rate: Number(show_up)
    };

    if (isCreating) {
      onCreateCampaign(payload);
      setIsCreating(false);
    } else {
      onUpdateCampaign(payload);
      setEditingCampaign(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFFFF] border border-[#E4E7EC] p-5 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[12px] font-mono text-[#315B7D] font-medium bg-[#EBF0F5] px-2 py-0.5 rounded">
              Campaign Matrix
            </span>
            <span className="text-[12px] text-[#667085]">• {campaigns.length} Active Channels</span>
          </div>
          <h2 className="text-[20px] font-semibold text-[#172033]">Campaign Management & Allocations</h2>
          <p className="text-[14px] text-[#667085] mt-0.5">
            Modify campaign parameters. Changes immediately recalculate analytics and inform the AI copilot.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#315B7D] hover:bg-[#274B68] text-white rounded-lg text-[13px] font-medium transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Campaign
        </button>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {campaigns.map((c) => (
          <div 
            key={c.id} 
            className="bg-[#FFFFFF] rounded-xl p-5 border border-[#E4E7EC] flex flex-col justify-between hover:border-[#D0D5DD] transition shadow-sm"
          >
            <div>
              <div className="flex justify-between items-start mb-2.5">
                <span className="text-[11px] font-mono text-[#667085] bg-[#F2F4F7] px-2 py-0.5 rounded border border-[#E4E7EC]">
                  {c.id}
                </span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${
                  c.status === 'active' ? 'bg-[#EAF3F0] text-[#28745D]' : 'bg-[#F2F4F7] text-[#667085]'
                }`}>
                  {c.status}
                </span>
              </div>

              <h3 className="text-[16px] font-semibold text-[#172033] mb-1 leading-snug">
                {c.name}
              </h3>
              <p className="text-[13px] text-[#667085] mb-4 line-clamp-2 leading-relaxed">
                {c.objective || 'Growth channel for attendee acquisition.'}
              </p>

              {/* Data Card */}
              <div className="bg-[#F9FAFB] p-3.5 rounded-lg border border-[#E4E7EC] text-[12px] mb-4 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[#667085]">Spend / Budget</span>
                  <div className="text-right font-mono tnum">
                    <span className="font-semibold text-[#172033]">₹{Number(c.spend).toLocaleString('en-IN')}</span>
                    <span className="text-[#667085]"> / ₹{Number(c.budget).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-[#667085]">Attendees / Regs</span>
                  <div className="text-right font-mono tnum">
                    <span className="font-semibold text-[#28745D]">{c.attendees} att.</span>
                    <span className="text-[#667085]"> ({c.registrations} regs)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E4E7EC] flex justify-between items-baseline">
                  <span className="text-[#667085]">Cost Per Attendee (CPA)</span>
                  <span className={`font-semibold font-mono tnum ${c.cpa > 150 ? 'text-[#B54747]' : 'text-[#28745D]'}`}>
                    ₹{c.cpa}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-[#667085]">Show-up rate</span>
                  <span className="font-semibold text-[#172033] font-mono tnum">
                    {c.show_up_rate}%
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-[12px] text-[#667085]">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#667085]" />
                  {c.owner}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Calendar className="w-3 h-3 text-[#667085]" />
                  {c.end_date}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex justify-end gap-2">
              <button
                onClick={() => handleStartEdit(c)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F2F4F7] hover:bg-[#E4E7EC] text-[#172033] text-[12px] font-medium transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => onDeleteCampaign(c.id)}
                className="p-1.5 rounded-lg hover:bg-[#FFF4E5] text-[#667085] hover:text-[#B54747] text-xs transition cursor-pointer"
                title="Delete campaign"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {(editingCampaign || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setEditingCampaign(null); setIsCreating(false); }}
              className="absolute top-4 right-4 text-[#667085] hover:text-[#172033]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-[18px] font-semibold text-[#172033]">
                {isCreating ? 'Create New Campaign' : `Edit: ${formData.name}`}
              </h3>
              <p className="text-[13px] text-[#667085] mt-0.5">
                Modifications update the analytics dashboard and persistent storage.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-[13px]">
              <div>
                <label className="block text-[#172033] mb-1 font-medium">Campaign Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#172033] mb-1 font-medium">Channel</label>
                  <input
                    type="text"
                    value={formData.channel || ''}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                  />
                </div>
                <div>
                  <label className="block text-[#172033] mb-1 font-medium">Owner</label>
                  <input
                    type="text"
                    value={formData.owner || ''}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block text-[#172033] mb-1 font-medium font-sans">Budget (₹)</label>
                  <input
                    type="number"
                    value={formData.budget || 0}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                  />
                </div>
                <div>
                  <label className="block text-[#172033] mb-1 font-medium font-sans">Spend (₹)</label>
                  <input
                    type="number"
                    value={formData.spend || 0}
                    onChange={(e) => setFormData({ ...formData, spend: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block text-[#172033] mb-1 font-medium font-sans">Registrations</label>
                  <input
                    type="number"
                    value={formData.registrations || 0}
                    onChange={(e) => setFormData({ ...formData, registrations: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                  />
                </div>
                <div>
                  <label className="block text-[#172033] mb-1 font-medium font-sans">Verified Attendees</label>
                  <input
                    type="number"
                    value={formData.attendees || 0}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#172033] mb-1 font-medium">Status</label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#172033] mb-1 font-medium">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date || '2027-03-14'}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] font-mono focus:outline-none focus:border-[#315B7D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#172033] mb-1 font-medium">Objective</label>
                <textarea
                  rows="2"
                  value={formData.objective || ''}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                />
              </div>

              <div className="pt-3 border-t border-[#E4E7EC] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setEditingCampaign(null); setIsCreating(false); }}
                  className="px-4 py-2 rounded-lg bg-[#F2F4F7] text-[#172033] hover:bg-[#E4E7EC] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#315B7D] hover:bg-[#274B68] text-white font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
