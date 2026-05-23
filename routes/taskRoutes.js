const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/Task');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create task
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('status').isIn(['pending', 'in-progress', 'completed', 'on-hold']).withMessage('Invalid status'),
  body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, status, priority, type, dueDate, company, jobTitle, applicationStatus, tags } = req.body;

    const task = new Task({
      userId: req.userId,
      title,
      description,
      status,
      priority,
      type,
      dueDate,
      company,
      jobTitle,
      applicationStatus,
      tags
    });

    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all tasks with filters and search
router.get('/', async (req, res) => {
  try {
    const { status, priority, type, search, sortBy } = req.query;
    let query = { userId: req.userId };

    // Filter by status
    if (status) query.status = status;

    // Filter by priority
    if (priority) query.priority = priority;

    // Filter by type
    if (type) query.type = type;

    // Search in title, description, company, jobTitle
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } }
      ];
    }

    let tasks = Task.find(query);

    // Sort
    if (sortBy === 'dueDate') {
      tasks = tasks.sort({ dueDate: 1 });
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      tasks = tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else {
      tasks = tasks.sort({ createdAt: -1 });
    }

    const allTasks = await tasks.exec();
    res.json(allTasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, type, dueDate, company, jobTitle, applicationStatus, tags } = req.body;

    let task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (type) task.type = type;
    if (dueDate) task.dueDate = dueDate;
    if (company) task.company = company;
    if (jobTitle) task.jobTitle = jobTitle;
    if (applicationStatus) task.applicationStatus = applicationStatus;
    if (tags) task.tags = tags;
    task.updatedAt = new Date();

    await task.save();
    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get dashboard stats
router.get('/stats/dashboard', async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ userId: req.userId });
    const completedTasks = await Task.countDocuments({ userId: req.userId, status: 'completed' });
    const pendingTasks = await Task.countDocuments({ userId: req.userId, status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ userId: req.userId, status: 'in-progress' });
    const jobApplications = await Task.countDocuments({ userId: req.userId, type: 'job-application' });
    const acceptedApplications = await Task.countDocuments({ userId: req.userId, type: 'job-application', applicationStatus: 'accepted' });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      jobApplications,
      acceptedApplications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
