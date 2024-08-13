// hooks/useUserProfile.js
import { useState, useEffect } from 'react'
import axios from 'axios'
import { MEMBER_PROFILE } from '@/configs/api-path'

export const useUserProfile = (authId) => {
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const source = axios.CancelToken.source()

    const fetchUserProfile = async () => {
      if (!authId) return

      setLoading(true)
      setError(null)

      try {
        const response = await axios.get(
          `${MEMBER_PROFILE}?member_id=${authId}`,
          {
            cancelToken: source.token,
          }
        )
        console.log('User profile response:', response.data)
        if (response.data.status && response.data.rows.length > 0) {
          setUserProfile(response.data.rows[0])
        } else {
          setUserProfile(null)
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message)
        } else {
          console.error(
            'Error fetching user profile:',
            err.response?.data || err.message
          )
          setError(err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()

    return () => {
      source.cancel('Component unmounted')
    }
  }, [authId])

  return { userProfile, loading, error }
}
