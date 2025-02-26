import api from './api';

export default {
  getGroupExpenses(groupId, params = {}) {
    return api.get(`/groups/${groupId}/expenses`, { params });
  },
  
  getExpense(id) {
    return api.get(`/expenses/${id}`);
  },
  
  createExpense(groupId, expenseData) {
    return api.post(`/groups/${groupId}/expenses`, expenseData);
  },
  
  updateExpense(id, expenseData) {
    return api.put(`/expenses/${id}`, expenseData);
  },
  
  deleteExpense(id) {
    return api.delete(`/expenses/${id}`);
  },
  
  getExpenseCategories() {
    return api.get('/expense-categories');
  },
  
  getExpenseStatistics(groupId, params = {}) {
    return api.get(`/groups/${groupId}/statistics`, { params });
  }
};
