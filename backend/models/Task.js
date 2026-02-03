
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  authorName: String,
  text: String,
  date: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  commission: {
    type: String,
    required: true,
    index: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'review', 'done', 'blocked', 'waiting'],
    default: 'todo'
  },
  dueDate: Date,
  createdBy: String, // Nom pour affichage rapide
  comments: [commentSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
