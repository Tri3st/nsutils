// src/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

type User {
    username: string;
    email: string | null;
    role: string | null;
    // Add other user fields as needed
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,   // you can store user info here if needed
    isLoading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state: boolean) => !!state.user,
  },
  actions: {
    async login(username: string, password: string) {
      this.isLoading = true
      this.error = null
      try {
        // Send credentials to your Django REST login endpoint
        // Make sure to send cookies for session handling
        const response = await axios.post(
          'http://localhost:8000/api/login',
          { username, password },
          { withCredentials: true }
        )
        
        // Assuming successful login returns user info, adapt if needed
        this.user = response.data.user || { username }
        
      } catch (err) {
        this.error = 'Invalid username or password'
        this.user = null
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async logout() {
      this.isLoading = true
      this.error = null
      try {
        // Assuming you have a /api/logout endpoint that clears session
        await axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true })
        this.user = null
      } catch (err) {
        this.error = 'Logout failed'
      } finally {
        this.isLoading = false
      }
    },
    async checkAuth() {
      // You can add a session check e.g. a /api/user or /api/session endpoint to verify session
      try {
        const response = await axios.get('http://localhost:8000/api/session', { withCredentials: true })
        this.user = response.data.user || null
      } catch {
        this.user = null
      }
    }
  }
})