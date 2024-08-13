import { useState, useEffect } from 'react'

const useIntersectionObserver = (refs = []) => {
  const [isVisible, setIsVisible] = useState(refs.map(() => false))

  useEffect(() => {
    const observers = refs.map((ref, index) => {
      return new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => {
              const newVisible = [...prev]
              newVisible[index] = true
              return newVisible
            })
          } else {
            setIsVisible((prev) => {
              const newVisible = [...prev]
              newVisible[index] = false
              return newVisible
            })
          }
        })
      })
    })

    refs.forEach((ref, index) => {
      if (ref.current) {
        observers[index].observe(ref.current)
      }
    })

    return () => {
      refs.forEach((ref, index) => {
        if (ref.current) {
          observers[index].unobserve(ref.current)
        }
      })
    }
  }, [])

  return isVisible
}

export default useIntersectionObserver
