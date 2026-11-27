import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  User, 
  Calendar, 
  X,
  Filter
} from 'lucide-react';

export default function TaskManager({ 
  tasks, 
  campaigns, 
  onCreateTask, 
  onUpdateTask, 
  onDeleteTask 
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  
  const [formData, setFormData] = useState({
    title: '',
    owner: 'Meera Iyer',
    deadline: '2027-02-28',
    priority: 'High',
    status: 'Pending',
    campaign_id: campaigns[0]?.id || '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const linkedCampaign = campaigns.find(c => c.id === formData.campaign_id);
    const newTask = {
      ...formData,
      id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
      campaign_name: linkedCampaign ? linkedCampaign.name : 'General Growth'
    };
    onCreateTask(newTask);
    setIsCreating(false);
    setFormData({
      title: '',
      owner: 'Meera Iyer',
      deadline: '2027-02-28',
      priority: 'High',
      status: 'Pending',
      campaign_id: campaigns[0]?.id || '',
      notes: ''
    });
  };

  const handleStatusChange = (task, newStatus) => {
    onUpdateTask({ ...task, status: newStatus });
  };

  const filteredTasks = tasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FDE8E8] text-[#B54747]">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#A15C00]">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#EBF0F5] text-[#315B7D]">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFFFF] border border-[#E4E7EC] p-5 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[12px] font-mono text-[#315B7D] font-medium bg-[#EBF0F5] px-2 py-0.5 rounded">
              Task Execution
            </span>
            <span className="text-[12px] text-[#667085]">• {tasks.length} Action Items</span>
          </div>
          <h2 className="text-[20px] font-semibold text-[#172033]">Growth Execution & Task Manager</h2>
          <p className="text-[14px] text-[#667085] mt-0.5">
            Assign accountability, track deadlines, and execute growth playbooks.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#315B7D] hover:bg-[#274B68] text-white rounded-lg text-[13px] font-medium transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] bg-[#FFFFFF] p-3 rounded-lg border border-[#E4E7EC]">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#667085]" />
          <span className="text-[#667085] font-medium">Status:</span>
          <div className="flex gap-1">
            {['all', 'Pending', 'In Progress', 'Completed'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded text-[12px] transition cursor-pointer ${
                  filterStatus === st 
                    ? 'bg-[#315B7D] text-white font-medium' 
                    : 'text-[#667085] hover:text-[#172033] hover:bg-[#F2F4F7]'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#667085] font-medium">Priority:</span>
          <div className="flex gap-1">
            {['all', 'High', 'Medium', 'Low'].map(pr => (
              <button
                key={pr}
                onClick={() => setFilterPriority(pr)}
                className={`px-2.5 py-1 rounded text-[12px] transition cursor-pointer ${
                  filterPriority === pr 
                    ? 'bg-[#315B7D] text-white font-medium' 
                    : 'text-[#667085] hover:text-[#172033] hover:bg-[#F2F4F7]'
                }`}
              >
                {pr === 'all' ? 'All' : pr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-[#FFFFFF] rounded-xl overflow-hidden border border-[#E4E7EC] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-[#667085] uppercase text-[11px] font-medium tracking-wider">
                <th className="py-3 px-4">Task Details</th>
                <th className="py-3 px-4">Linked Campaign</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {filteredTasks.map(t => (
                <tr key={t.id} className="hover:bg-[#F9FAFB] transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-mono text-[#667085]">{t.id}</span>
                      {t.ai_suggested && (
                        <span className="flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded bg-[#EBF0F5] text-[#315B7D]">
                          <Sparkles className="w-3 h-3 text-[#315B7D]" /> AI Created
                        </span>
                      )}
                    </div>
                    <div className="text-[#172033] font-medium">{t.title}</div>
                    {t.notes && <div className="text-[12px] text-[#667085] mt-0.5 max-w-lg">{t.notes}</div>}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#F2F4F7] text-[#475467] text-[12px]">
                      {t.campaign_name || t.campaign_id}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#172033]">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#667085]" />
                      {t.owner}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#667085] text-[12px]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#667085]" />
                      {t.deadline}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {getPriorityBadge(t.priority)}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t, e.target.value)}
                      className={`rounded-md px-2 py-1 text-[12px] font-medium focus:outline-none cursor-pointer border ${
                        t.status === 'Completed'
                          ? 'bg-[#EAF3F0] text-[#28745D] border-[#28745D]/20'
                          : t.status === 'In Progress'
                          ? 'bg-[#EBF0F5] text-[#315B7D] border-[#315B7D]/20'
                          : 'bg-[#F2F4F7] text-[#667085] border-[#E4E7EC]'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onDeleteTask(t.id)}
                      className="p-1.5 rounded-lg hover:bg-[#F2F4F7] text-[#667085] hover:text-[#B54747] transition cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-[#667085] text-[13px]">
                    No tasks match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-[#FFFFFF] border border-[#E4E7EC] rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <button
              onClick={() => setIsCreating(false)}
              className="absolute top-4 right-4 text-[#667085] hover:text-[#172033]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-[18px] font-semibold text-[#172033]">Create New Task</h3>
              <p className="text-[13px] text-[#667085] mt-0.5">
                Assign accountability and execution milestones.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
              <div>
                <label className="block text-[#172033] mb-1 font-medium">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Recruit 30 North Campus ambassadors"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                />
              </div>

              <div>
                <label className="block text-[#172033] mb-1 font-medium">Linked Campaign</label>
                <select
                  value={formData.campaign_id}
                  onChange={(e) => setFormData({ ...formData, campaign_id: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#172033] mb-1 font-medium">Owner</label>
                  <input
                    type="text"
                    required
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                  />
                </div>
                <div>
                  <label className="block text-[#172033] mb-1 font-medium">Deadline</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] font-mono focus:outline-none focus:border-[#315B7D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#172033] mb-1 font-medium">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#172033] mb-1 font-medium">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#172033] mb-1 font-medium">Notes</label>
                <textarea
                  rows="2"
                  placeholder="Key milestones or deliverables..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#315B7D]"
                />
              </div>

              <div className="pt-3 border-t border-[#E4E7EC] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-lg bg-[#F2F4F7] text-[#172033] hover:bg-[#E4E7EC] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#315B7D] hover:bg-[#274B68] text-white font-medium"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
