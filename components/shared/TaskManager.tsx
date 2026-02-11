import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  CheckCircle, Circle, Clock, MoreHorizontal, Plus, 
  Trash2, User, AlertCircle, Edit, Calendar, ListTodo, X,
  MessageSquare, Lock, Hourglass, Send, AlertTriangle, Loader2
} from 'lucide-react';
import { CommissionType, Task, TaskStatus, TaskPriority, TaskComment } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/date';

interface TaskManagerProps {
  commission: CommissionType;
}

const TaskManager: React.FC<TaskManagerProps> = ({ commission }) => {
  const { tasks, members, addTask, updateTask, deleteTask } = useData();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');

  const [newTask, setNewTask] = useState<Partial<Task>>({
    priority: 'medium',
    status: 'todo',
    commission: commission,
    comments: []
  });

  const commissionTasks = useMemo(() => 
    (tasks || []).filter(t => t.commission === commission).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), 
  [tasks, commission]);

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    if (editingTask) {
      updateTask(editingTask.id, newTask);
    } else {
      const task: Task = {
        id: Date.now().toString(), 
        title: newTask.title!,
        description: newTask.description || '',
        assignedTo: newTask.assignedTo || '',
        dueDate: newTask.dueDate || '',
        priority: (newTask.priority as TaskPriority) || 'medium',
        status: (newTask.status as TaskStatus) || 'todo',
        commission: commission,
        createdBy: user?.firstName || 'Admin', 
        createdAt: new Date().toISOString(),
        comments: []
      };
      addTask(task);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setNewTask({ priority: 'medium', status: 'todo', commission: commission, comments: [] });
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case 'high': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in">
      <div className="flex justify-between items-center mb-4">
         <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <ListTodo size={22} className="text-blue-600" /> Tâches du Pôle
         </h3>
         <button 
           onClick={() => setShowModal(true)}
           className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2"
         >
           <Plus size={16}/> Nouvelle Tâche
         </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-200 flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-[2.5rem]">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm"><ListTodo size={20}/></div>
                 <div>
                    <h3 className="text-lg font-black text-slate-900">{editingTask ? 'Détails de la tâche' : 'Nouvelle Tâche'}</h3>
                 </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSaveTask} className="p-8 space-y-6 overflow-y-auto">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intitulé</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={newTask.title || ''}
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                  />
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priorité</label>
                     <select 
                       className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                       value={newTask.priority}
                       onChange={e => setNewTask({...newTask, priority: e.target.value as TaskPriority})}
                     >
                        <option value="low">Faible</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Urgente</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Échéance</label>
                     <input 
                       type="date" 
                       className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                       value={newTask.dueDate}
                       onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                     />
                  </div>
               </div>
               <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Enregistrer la tâche</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['todo', 'in_progress', 'done'].map(status => (
          <div key={status} className="space-y-4">
             <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                   {status === 'todo' ? 'À faire' : status === 'in_progress' ? 'En cours' : 'Terminé'}
                </span>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-black">
                   {commissionTasks.filter(t => t.status === status).length}
                </span>
             </div>
             <div className="space-y-3">
                {commissionTasks.filter(t => t.status === status).map(task => (
                  <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                     <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${getPriorityColor(task.priority)}`}>
                           {task.priority}
                        </span>
                        <button onClick={() => updateTask(task.id, { status: status === 'todo' ? 'in_progress' : status === 'in_progress' ? 'done' : 'todo' })}>
                           <MoreHorizontal size={16} className="text-slate-300" />
                        </button>
                     </div>
                     <h4 className="text-xs font-bold text-slate-800 leading-tight">{task.title}</h4>
                     <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[9px] font-bold text-slate-400">
                        <span className="flex items-center gap-1 uppercase"><Calendar size={10}/> {task.dueDate ? formatDate(task.dueDate) : 'Sans date'}</span>
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center uppercase">{task.createdBy[0]}</div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;