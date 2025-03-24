import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdNXE6gh4ZQKxzxb1_MzOYsi7wccDU85w",
  authDomain: "acronweb-id.firebaseapp.com",
  projectId: "acronweb-id",
  storageBucket: "acronweb-id.firebasestorage.app",
  messagingSenderId: "13904399702",
  appId: "1:13904399702:web:f972d8a4adaecb1a329af7",
  measurementId: "G-H4Y33Q7DQS",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// Only initialize analytics on the client side
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null
const auth = getAuth(app)
const db = getFirestore(app)

console.log("Firebase initialized successfully")

export { app, auth, db, analytics }

