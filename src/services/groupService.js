import api from './api';

export default {
  getGroups() {
    return api.get('/groups');
  },
  
  getGroup(id) {
    return api.get(`/groups/${id}`);
  },

  createGroup(groupData) {
    return api.post('/groups', groupData);
  },
  
  updateGroup(id, groupData) {
    return api.put(`/groups/${id}`, groupData);
  },
  
  deleteGroup(id) {
    return api.delete(`/groups/${id}`);
  },
  
  getGroupMembers(id) {
    return api.get(`/groups/${id}/members`);
  },
  
  addGroupMember(id, memberData) {
    return api.post(`/groups/${id}/members`, memberData);
  },
  
  removeGroupMember(groupId, memberId) {
    return api.delete(`/groups/${groupId}/members/${memberId}`);
  },
  
  getGroupBalances(id) {
    return api.get(`/groups/${id}/balances`);
  },
  getMembers(groupId) {
    return api.get(`/groups/${groupId}/members`);
  },
  getGroupBalances(groupId) {
    return api.get(`/groups/${groupId}/balances`);
  }
  
};
