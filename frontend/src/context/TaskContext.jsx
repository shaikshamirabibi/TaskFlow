import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters & View State
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create', // 'create' or 'edit'
    task: null,
    defaultStatus: 'pending',
    defaultCategory: null
  });

  // Toasts feedback
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch tasks with active filters
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.getTasks({
        status: statusFilter,
        priority: priorityFilter,
        category_id: categoryFilter,
        search: searchQuery,
        sort_by: sortBy,
        order: sortOrder
      });
      if (res.success) {
        setTasks(res.tasks);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  }, [isAuthenticated, statusFilter, priorityFilter, categoryFilter, searchQuery, sortBy, sortOrder]);

  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.getCategories();
      if (res.success) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, [isAuthenticated]);

  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.getStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, [isAuthenticated]);

  const refreshAll = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    await Promise.all([fetchTasks(), fetchCategories(), fetchStats()]);
    setLoading(false);
  }, [isAuthenticated, fetchTasks, fetchCategories, fetchStats]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshAll();
    } else {
      setTasks([]);
      setCategories([]);
      setStats(null);
    }
  }, [isAuthenticated, refreshAll]);

  // CRUD Actions
  const createTask = async (taskData) => {
    try {
      const res = await api.createTask(taskData);
      if (res.success) {
        addToast('Task created successfully!', 'success');
        refreshAll();
        return res.task;
      }
    } catch (err) {
      addToast(err.message || 'Failed to create task', 'error');
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const res = await api.updateTask(id, taskData);
      if (res.success) {
        addToast('Task updated successfully!', 'success');
        refreshAll();
        return res.task;
      }
    } catch (err) {
      addToast(err.message || 'Failed to update task', 'error');
      throw err;
    }
  };

  const patchTaskStatus = async (id, newStatus) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      const res = await api.patchTaskStatus(id, newStatus);
      if (res.success) {
        fetchStats(); // Update counters in background
      }
    } catch (err) {
      addToast(err.message || 'Failed to change status', 'error');
      fetchTasks(); // Revert on failure
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await api.deleteTask(id);
      if (res.success) {
        addToast('Task deleted', 'info');
        setTasks(prev => prev.filter(t => t.id !== id));
        fetchStats();
        fetchCategories();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete task', 'error');
    }
  };

  // Subtask handlers
  const addSubtask = async (taskId, title) => {
    try {
      const res = await api.addSubtask(taskId, title);
      if (res.success) {
        fetchTasks();
        fetchStats();
        return res.subtask;
      }
    } catch (err) {
      addToast(err.message || 'Failed to add subtask', 'error');
      throw err;
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    try {
      const res = await api.toggleSubtask(subtaskId);
      if (res.success) {
        fetchTasks();
        fetchStats();
        return res.subtask;
      }
    } catch (err) {
      addToast(err.message || 'Failed to toggle subtask', 'error');
    }
  };

  const deleteSubtask = async (taskId, subtaskId) => {
    try {
      const res = await api.deleteSubtask(subtaskId);
      if (res.success) {
        fetchTasks();
        fetchStats();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete subtask', 'error');
    }
  };

  // Category handlers
  const createCategory = async (name, color) => {
    try {
      const res = await api.createCategory(name, color);
      if (res.success) {
        addToast(`Category "${name}" created`, 'success');
        fetchCategories();
        return res.category;
      }
    } catch (err) {
      addToast(err.message || 'Failed to create category', 'error');
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await api.deleteCategory(id);
      if (res.success) {
        addToast('Category deleted', 'info');
        if (categoryFilter === String(id)) {
          setCategoryFilter('all');
        }
        fetchCategories();
        fetchTasks();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete category', 'error');
    }
  };

  // Modal helpers
  const openCreateModal = (defaults = {}) => {
    setModalState({
      isOpen: true,
      mode: 'create',
      task: null,
      defaultStatus: defaults.status || 'pending',
      defaultCategory: defaults.categoryId || null
    });
  };

  const openEditModal = (task) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      task: task,
      defaultStatus: task.status,
      defaultCategory: task.category_id
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false, task: null }));
  };

  const value = {
    tasks,
    categories,
    stats,
    loading,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    toasts,
    addToast,
    removeToast,
    modalState,
    openCreateModal,
    openEditModal,
    closeModal,
    refreshAll,
    createTask,
    updateTask,
    patchTaskStatus,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    createCategory,
    deleteCategory,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};
