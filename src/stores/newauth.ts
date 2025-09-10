// src/stores/newauth.ts
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'

export type User = {
    username: string;
    email: string | null;
    role: 'A' | 'U' | 'G' | null; // 'A' for Admin, 'U' for User, 'G' for Guest
    // Add other user fields as needed
}

export type State = {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    user: null,   // you can store user info here if needed
    isLoading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state: State): boolean => !!state.user,
  },
  actions: {
    async login(username: string, password: string) {
      this.isLoading = true
      this.error = null
      try {
        // Send credentials to your Django REST login endpoint
        // Make sure to send cookies for session handling
        const response = await axios.post<{ userinfo: User }>(
          'http://localhost:8000/api/login/',
          { username, password },
          { withCredentials: true }
        )
        
        this.user = response.data.userinfo
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
        await axios.post('http://localhost:8000/api/logout/', {}, { withCredentials: true })
        this.user = null
      } catch (err) {
        this.error = 'Logout failed'
      } finally {
        this.isLoading = false
      }
    },
    async checkAuth() {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.get<{ userinfo: User }>('http://localhost:8000/api/userinfo/', { withCredentials: true })
        this.user = response.data.userinfo || null
      } catch (err){
        this.user = null
      } finally {
        this.isLoading = false
      }
    }
  }
})