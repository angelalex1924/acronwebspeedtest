"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  register: (name: string, surname: string, email: string, username: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithFacebook: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signInWithMicrosoft: () => Promise<void>
  signInWithTwitter: () => Promise<void>
  signInWithApple: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  signInWithGoogle: async () => {},
  signInWithFacebook: async () => {},
  signInWithGithub: async () => {},
  signInWithMicrosoft: async () => {},
  signInWithTwitter: async () => {},
  signInWithApple: async () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const register = async (name: string, surname: string, email: string, username: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile with display name
      await updateProfile(user, {
        displayName: `${name} ${surname}`,
      })

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        surname,
        email,
        username,
        createdAt: new Date().toISOString(),
      })

      router.push("/dashboard")
      return
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
      return
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      router.push("/")
      return
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  // Social login methods
  const handleSocialSignIn = async (provider: any, providerName: string) => {
    try {
      console.log(`Starting ${providerName} sign-in process`)
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log(`${providerName} sign-in successful`, user)

      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        console.log(`Creating new user document for ${user.uid}`)
        // Create user document if it doesn't exist
        const names = user.displayName ? user.displayName.split(" ") : ["", ""]
        const name = names[0] || ""
        const surname = names.slice(1).join(" ") || ""

        await setDoc(userDocRef, {
          uid: user.uid,
          name,
          surname,
          email: user.email,
          username: user.email?.split("@")[0] || "",
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          provider: providerName,
        })
      } else {
        console.log(`Updating existing user document for ${user.uid}`)
        // Update last login time
        await setDoc(
          userDocRef,
          {
            lastLogin: new Date().toISOString(),
            photoURL: user.photoURL,
          },
          { merge: true },
        )
      }

      console.log(`Redirecting to dashboard`)
      router.push("/dashboard")
    } catch (error) {
      console.error(`${providerName} sign-in error:`, error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    console.log("Google sign-in method called")
    const provider = new GoogleAuthProvider()
    return handleSocialSignIn(provider, "google")
  }

  const signInWithFacebook = async () => {
    console.log("Facebook sign-in method called")
    const provider = new FacebookAuthProvider()
    return handleSocialSignIn(provider, "facebook")
  }

  const signInWithGithub = async () => {
    console.log("GitHub sign-in method called")
    const provider = new GithubAuthProvider()
    return handleSocialSignIn(provider, "github")
  }

  const signInWithTwitter = async () => {
    console.log("Twitter sign-in method called")
    const provider = new TwitterAuthProvider()
    return handleSocialSignIn(provider, "twitter")
  }

  const signInWithMicrosoft = async () => {
    console.log("Microsoft sign-in method called")
    const provider = new OAuthProvider("microsoft.com")
    return handleSocialSignIn(provider, "microsoft")
  }

  const signInWithApple = async () => {
    console.log("Apple sign-in method called")
    const provider = new OAuthProvider("apple.com")
    return handleSocialSignIn(provider, "apple")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        signInWithGoogle,
        signInWithFacebook,
        signInWithGithub,
        signInWithMicrosoft,
        signInWithTwitter,
        signInWithApple,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

