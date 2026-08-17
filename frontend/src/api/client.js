// TaskFlow API Client

const BASE_URL = '/api';

export const getStoredToken = () => localStorage.getItem('taskflow_token');
export const setStoredToken = (token) => localStorage.setItem('taskflow_token', token);
export const removeStoredToken = () => localStorage.removeItem('taskflow_token');

export const getStoredUser = () => {
  const u = localStorage.getItem('taskflow_user');
  try {
    return u ? JSON.parse(u) : null;
  } catch (e) {
    return null;
  }
};
export const setStoredUser = (user) => localStorage.setItem('taskflow_user', JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem('taskflow_user');

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      removeStoredToken();
      removeStoredUser();
      window.dispatchEvent(new CustomEvent('taskflow_unauthorized'));
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  // Auth
  register: (name, email, password) => 
    request('/auth/register', { method: 'POST', body: { name, email, password } }),
    
  login: (email, password) => 
    request('/auth/login', { method: 'POST', body: { email, password } }),
    
  getProfile: () => 
    request('/auth/me'),
    
  updateProfile: (name) => 
    request('/auth/profile', { method: 'PUT', body: { name } }),
    
  changePassword: (current_password, new_password) => 
    request('/auth/password', { method: 'PUT', body: { current_password, new_password } }),

  // Tasks
  getTasks: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
    if (params.category_id && params.category_id !== 'all') query.append('category_id', params.category_id);
    if (params.search) query.append('search', params.search);
    if (params.sort_by) query.append('sort_by', params.sort_by);
    if (params.order) query.append('order', params.order);
    
    const qs = query.toString();
    return request(`/tasks${qs ? `?${qs}` : ''}`);
  },

  getTaskById: (id) => 
    request(`/tasks/${id}`),

  createTask: (taskData) => 
    request('/tasks', { method: 'POST', body: taskData }),

  updateTask: (id, taskData) => 
    request(`/tasks/${id}`, { method: 'PUT', body: taskData }),

  patchTaskStatus: (id, status) => 
    request(`/tasks/${id}/status`, { method: 'PATCH', body: { status } }),

  deleteTask: (id) => 
    request(`/tasks/${id}`, { method: 'DELETE' }),

  // Subtasks
  getSubtasks: (taskId) => 
    request(`/tasks/${taskId}/subtasks`),

  addSubtask: (taskId, title) => 
    request(`/tasks/${taskId}/subtasks`, { method: 'POST', body: { title } }),

  toggleSubtask: (subtaskId) => 
    request(`/subtasks/${subtaskId}/toggle`, { method: 'PATCH' }),

  updateSubtask: (subtaskId, data) => 
    request(`/subtasks/${subtaskId}`, { method: 'PUT', body: data }),

  deleteSubtask: (subtaskId) => 
    request(`/subtasks/${subtaskId}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => 
    request('/categories'),

  createCategory: (name, color) => 
    request('/categories', { method: 'POST', body: { name, color } }),

  deleteCategory: (id) => 
    request(`/categories/${id}`, { method: 'DELETE' }),

  // Analytics
  getStats: () => 
    request('/analytics/stats'),
};
