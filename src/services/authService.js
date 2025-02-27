import api from './api';

export default {
  login(credentials) {
    return api.post('/login', credentials);
  },
  
  register(userData) {
    return api.post('/register', userData);
  },
  
  logout() {
    return api.post('/logout');
  },
  
  getCurrentUser() {
    return api.get('/user');
  },
  
  loginWithGoogle(token) {
    return api.post('/google', { token });
  },
  
  loginWithFacebook(token) {
    return api.post('/facebook', { token });
  },
  
  updateProfile(userData) {
    return api.put('/profile', userData);
  },
  
  changePassword(passwordData) {
    return api.put('/password', passwordData);
  }
};
