
const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');

// @desc    Récupérer les tâches (Filtre par commission optionnel)
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.commission) {
    filter.commission = req.query.commission;
  }
  
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json({ data: tasks });
});

// @desc    Créer une tâche
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.body,
    createdBy: `${req.user.firstName} ${req.user.lastName}`
  });
  res.status(201).json(task);
});

// @desc    Mettre à jour une tâche
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Tâche non trouvée');
  }
});

// @desc    Supprimer une tâche
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    await task.deleteOne();
    res.json({ message: 'Tâche supprimée' });
  } else {
    res.status(404);
    throw new Error('Tâche non trouvée');
  }
});

module.exports = { getTasks, createTask, updateTask, deleteTask };
