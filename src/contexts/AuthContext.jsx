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
        try {
          setUser(session?.user ?? null)
          if (session?.user) {
            await checkUserRole(session.user)
          }
        } catch (error) {
          console.error('Error checking user role:', error)
        } finally {
          setLoading(false)
        }
      })()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        try {
          setUser(session?.user ?? null)
          if (session?.user) {
            await checkUserRole(session.user)
          } else {
            setIsAdmin(false)
            setClientData(null)
          }
        } catch (error) {
          console.error('Error on auth state change:', error)
        }
      })()
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUserRole = async (user) => {
    let { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (adminError) {
      console.error('Error fetching admin by user_id:', adminError)
    }

    if (!adminData) {
      const { data: adminByEmail, error: emailError } = await supabase
        .from('admins')
        .select('*')
        .ilike('email', user.email)
        .maybeSingle()

      if (emailError) {
        console.error('Error fetching admin by email:', emailError)
      }

      if (adminByEmail && !adminByEmail.user_id) {
        const { error: updateError } = await supabase
          .from('admins')
          .update({ user_id: user.id })
          .eq('id', adminByEmail.id)

        if (updateError) {
          console.error('Error linking admin account:', updateError)
        }
        adminData = { ...adminByEmail, user_id: user.id }
      } else if (adminByEmail) {
        adminData = adminByEmail
      }
    }

    if (adminData) {
      setIsAdmin(true)
      setClientData(null)
    } else {
      setIsAdmin(false)
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .ilike('email', user.email)
        .maybeSingle()

      if (clientError) {
        console.error('Error fetching client data:', clientError)
      }

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

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
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
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
