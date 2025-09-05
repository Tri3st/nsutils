import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const user = ref<User | null>(null)
const loading = ref(true)

export const useAuth = () => {
  const isAuthenticated = computed(() => !!user.value)

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const initialize = async () => {
    loading.value = true
    
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      user.value = session?.user ?? null
      loading.value = false
    })
    
    loading.value = false
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    loading: computed(() => loading.value),
    signIn,
    signOut,
    initialize
  }
}