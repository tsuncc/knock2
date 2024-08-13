import { createContext, useContext, useEffect, useState } from 'react'
import useFirebase from '@/hooks/useFirebase'
import {
  JWT_LOGIN_POST,
  VERIFY_OTP_POST,
  GOOGLE_LOGIN_POST,
  VERIFY_TOKEN_POST,
  REGISTER_POST,
  OTP_MAIL_POST,
} from '@/configs/api-path'

const AuthContext = createContext()
const storageKey = 'knock-knock-auth'
const emptyAuth = {
  id: 0,
  account: '',
  nickname: '',
  token: '',
}
// component
export function AuthContextProvider({ children }) {
  const { logoutFirebase } = useFirebase()
  const [auth, setAuth] = useState({ ...emptyAuth })
  const [authRefresh, setAuthRefresh] = useState(false)
  const [authIsReady, setAuthIsReady] = useState(false)

  const login = async (account, password) => {
    const output = {
      success: false,
      totp_enabled: false,
      user_id: 0,
      error: '',
    }
    try {
      const r = await fetch(JWT_LOGIN_POST, {
        method: 'POST',
        body: JSON.stringify({ account, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await r.json()
      if (result.success) {
        // 如果帳號密碼驗證成功，判斷是否有申請2步驟驗證
        output.success = true
        if (result.totp_enabled) {
          // 如果有申請 2 步驗證，回傳給視窗進行驗證
          output.totp_enabled = true
          output.user_id = result.data.id
        } else {
          // 如果沒有申請，變更狀態 + 儲存到 localStorage
          localStorage.setItem(storageKey, JSON.stringify(result.data))
          setAuth(result.data)
        }
        // 回傳給登入視窗
        return output
      } else {
        output.success = false
        output.error = result.error
        return output
      }
    } catch (ex) {
      return false
    }
  }

  const login2fa = async (id, token) => {
    const output = {
      success: false,
      error: '',
    }
    try {
      const r = await fetch(VERIFY_OTP_POST, {
        method: 'POST',
        body: JSON.stringify({ id, token }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await r.json()
      if (result.success) {
        output.success = true
        localStorage.setItem(storageKey, JSON.stringify(result.data))
        setAuth(result.data)
        return output
      } else {
        output.success = false
        output.error = result.error
        return output
      }
    } catch (ex) {
      console.error(ex)
      return false
    }
  }

  const googleLogin = async (providerData) => {
    const output = {
      success: false,
      error: '',
    }
    try {
      const r = await fetch(GOOGLE_LOGIN_POST, {
        method: 'POST',
        body: JSON.stringify(providerData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await r.json()
      if (result.success) {
        // token 和用戶的相關資料存到 localStorage
        localStorage.setItem(storageKey, JSON.stringify(result.data))
        // 變更狀態
        setAuth(result.data)

        // 回傳給登入視窗
        output.success = true
        return output
      } else {
        output.success = false
        output.error = result.error
        return output
      }
    } catch (ex) {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem(storageKey)
    logoutFirebase()
    setAuth(emptyAuth)
  }

  const register = async (data) => {
    const output = {
      success: false,
      error: '',
    }
    try {
      const r = await fetch(REGISTER_POST, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await r.json()
      if (result.success) {
        // 回傳給登入視窗
        output.success = true
        return output
      } else {
        output.success = false
        output.error = result.error
        return output
      }
    } catch (ex) {
      console.error(ex)
      output.error = ex
      return output
    }
  }

  const otpMail = async (account) => {
    const output = {
      success: false,
      error: '',
    }
    try {
      const r = await fetch(OTP_MAIL_POST, {
        method: 'POST',
        body: JSON.stringify({ account }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await r.json()
      if (result.success) {
        // 回傳給視窗
        output.success = true
        return output
      } else {
        output.success = false
        output.error = result.error
        return output
      }
    } catch (ex) {
      console.error(ex)
      output.success = false
      output.error = ex
      return output
    }
  }

  const getAuthHeader = () => {
    if (auth.token) {
      return { Authorization: 'Bearer ' + auth.token }
    } else {
      // 用戶如果在需要檢核登入狀態的地方重刷頁面，先檢查 localStorage
      const str = localStorage.getItem(storageKey)
      if (!str) return {} // 如果還是沒登入狀態就返回空值
      const { token } = JSON.parse(str)
      return { Authorization: 'Bearer ' + token }
    }
  }

  // 用戶如果重刷頁面，狀態可以由 localStorage 載入
  useEffect(() => {
    const str = localStorage.getItem(storageKey)
    if (!str) {
      setAuthIsReady(true)
      return
    } else {
      try {
        const data = JSON.parse(str)
        const { token } = data

        fetch(VERIFY_TOKEN_POST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })
          .then((r) => r.json())
          .then((result) => {
            if (result.success) {
              setAuth(result.data)
              setAuthIsReady(true)
            }
          })
      } catch (ex) {
        console.error(ex)
      }
    }
    setAuthRefresh(false)
  }, [authRefresh])

  return (
    <AuthContext.Provider
      value={{
        auth,
        authIsReady,
        setAuthRefresh,
        login,
        login2fa,
        googleLogin,
        logout,
        register,
        otpMail,
        getAuthHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext
