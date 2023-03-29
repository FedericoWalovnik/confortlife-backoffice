// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'confort-life.firebaseapp.com',
  projectId: 'confort-life',
  storageBucket: 'confort-life.appspot.com',
  messagingSenderId: '912690734481',
  appId: '1:912690734481:web:29c2025c02d73a56e4a630',
  measurementId: 'G-XTZNN3MJTS'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

export default storage
