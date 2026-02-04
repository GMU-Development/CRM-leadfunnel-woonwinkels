import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [clientData, setClientData] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      (async () => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await checkUserRole(session.user)
        }
        setLoading(false)
      })()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await checkUserRole(session.user)
        } else {
          setIsAdmin(false)
          setClientData(null)
        }
      })()
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUserRole = async (user) => {
    const { data: adminData } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (adminData) {
      setIsAdmin(true)
      setClientData(null)
    } else {
      setIsAdmin(false)
      const { data: client } = await supabase
        .from('clients')
        .select('*')
        .eq('email', user.email)
        .maybeSingle()

      setClientData(client)
    }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    setIsAdmin(false)
    setClientData(null)
    return { error }
  }

  const value = {
    user,
    loading,
    isAdmin,
    clientData,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
