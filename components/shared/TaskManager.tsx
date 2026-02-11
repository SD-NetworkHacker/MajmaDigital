
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  CheckCircle, Circle, Clock, MoreHorizontal, Plus, 
  Trash2, User, AlertCircle, Edit, Calendar, ListTodo, X,
  MessageSquare, Lock, Hourglass, Send, AlertTriangle
} from 'lucide-react';
import { CommissionType, Task, TaskStatus, TaskPriority, TaskComment } from '../../types';
import { useData } from '../../contexts/DataContext';
// Fix: Corrected path for AuthContext
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
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  
  const [newComment, setNewComment] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    priority: 'medium',
    status: 'todo',
    commission: commission,
    comments: []
  });

  const commissionTasks = useMemo(() => 
    (tasks || []).filter(t => t.commission === commission).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), 
  [tasks, commission]);

  const todoTasks = commissionTasks.filter(t => t.status === 'todo');
  const inProgressTasks = commissionTasks.filter(t => ['in_progress', 'review', 'waiting', 'blocked'].includes(t.status));
  const doneTasks = commissionTasks.filter(t => t.status === 'done');

  useEffect(() => {
    if (showModal && editingTask) {
        setTimeout(() => {
            commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
  }, [showModal, editingTask, editingTask?.comments]);

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    if (editingTask) {
      updateTask(editingTask.id, newTask);
    } else {
      const task: Task = {
        id: '', 
        title: newTask.title!,
        description: newTask.description || '',
        assignedTo: newTask.assignedTo || '',
        dueDate: newTask.dueDate || '',
        priority: newTask.priority || 'medium',
        status: newTask.status || 'todo',
        commission: commission,
        createdBy: user?.firstName || 'Admin', 
        createdAt: new Date().toISOString(),
        comments: []
      };
      addTask(task);
    }
    closeModal();
  };

  const handleAddComment = () => {
    if(!newComment.trim() || !editingTask) return;
    
    const comment: TaskComment = {
        id: Date.now().toString(),
        authorId: user?.id || 'unknown',
        authorName: user ? `${user.firstName} ${user.lastName}` : 'Utilisateur',
        text: newComment,
        date: new Date().toISOString()
    };

    const updatedComments = [...(editingTask.comments || []), comment];
    updateTask(editingTask.id, { comments: updatedComments });
    
    setEditingTask({ ...editingTask, comments: updatedComments });
    setNewTask({ ...newTask, comments: updatedComments });
    setNewComment('');
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setNewTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setNewTask({ priority: 'medium', status: 'todo', commission: commission, comments: [] });
    setNewComment('');
  };

  const handleDelete = (id: string) => {
    setTaskToDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (taskToDeleteId) {
      deleteTask(taskToDeleteId);
      if (editingTask?.id === taskToDeleteId) closeModal();
      setShowDeleteModal(false);
      setTaskToDeleteId(null);
    }
  };

  const moveTask = (task: Task, newStatus: TaskStatus) => {
    updateTask(task.id, { status: newStatus });
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
       updateTask(taskId, { status: newStatus });
    }
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case 'high': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
     switch(status) {
         case 'blocked': return <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase border bg-rose-100 text-rose-700 border-rose-200 flex items-center gap-1"><Lock size={10}/> Bloqué</span>;
         case 'waiting': return <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase border bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1"><Hourglass size={10}/> Attente</span>;
         case 'review': return <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase border bg-purple-100 text-purple-700 border-purple-200">Revue</span>;
         default: return null;
     }
  };

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const assignee = (members || []).find(m => m.id === task.assignedTo);
    
    return (
      <div 
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onClick={() => openEditModal(task)}
        className={`bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all group cursor-grab active:cursor-grabbing ${task.status === 'blocked' ? 'border-rose-200 bg-rose-50/10' : 'border-slate-100 hover:border-blue-200'}`}
      >
        <div className="flex justify-between items-start mb-2">
           <div className="flex gap-1 flex-wrap">
             <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getPriorityColor(task.priority)}`}>
               {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Normal' : 'Faible'}
             </span>
             {getStatusBadge(task.status)}
           </div>
        </div>
        
        <h4 className={`text-sm font-bold text-slate-800 mb-1 leading-tight ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>{task.title}</h4>
      </div>
    );
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
