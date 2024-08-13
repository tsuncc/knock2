import { useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth'

export const firebaseConfig = {
  apiKey: 'AIzaSyAIUVfbZLVrjN8-tIWGXGBL4dOsEiax0lM',
  authDomain: 'knock2-project.firebaseapp.com',
  projectId: 'knock2-project',
  storageBucket: 'knock2-project.appspot.com',
  messagingSenderId: '521494842862',
  appId: '1:521494842862:web:0f3aecf28ff8bc71e852ff',
  measurementId: 'G-L83XG79X1X',
}

const getOAuth = async (callbackFunction) => {
  const auth = getAuth()

  try {
    const result = await getRedirectResult(auth)
    if (result) {
      const user = result.user
      if (!user) {
        return console.error('沒有登入資訊')
      }
      callbackFunction(user.providerData[0])
    } 

  } catch (ex) {
    console.error(ex, 'getOAuthError')
  }

  try {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        callbackFunction(user.providerData[0])
      }
    })
  } catch (ex) {
    console.error(ex, 'onAuthStateChangedError')
  }
}

const logoutFirebase = async () => {
  const auth = getAuth()

  try {
    // 登出成功
    await signOut(auth)
  } catch (ex) {
    // 登出失敗
    console.error(ex)
  }
}

const loginWithGooglePopup = async () => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()

  try {
    await signInWithPopup(auth, provider)
  } catch (ex) {
    console.error(ex)
  }
}

const loginWithGoogleRedirect = async () => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()

  signInWithRedirect(auth, provider)
}

export default function useFirebase() {
  useEffect(() => {
    initializeApp(firebaseConfig)
  }, [])

  return {
    getOAuth,
    logoutFirebase,
    loginWithGooglePopup,
    loginWithGoogleRedirect,
  }
}
