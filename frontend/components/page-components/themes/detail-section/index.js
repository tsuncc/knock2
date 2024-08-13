import React, { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import MoreThemes from '@/components/page-components/themes/detail-section/more-themes'
import BookingBtn from './booking-btn'
import Game from './game'

const AnimatedSection = ({ children }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.div>
  )
}

export default function DetailSection({ Banner, Item, Step, Calendar }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const handleScroll = (e) => {
      const section = sectionRef.current
      if (section) {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 0 && rect.bottom > window.innerHeight) {
          e.preventDefault()
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: false })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={sectionRef}>
      {Banner}
      <AnimatedSection>{Item}</AnimatedSection>
      <AnimatedSection>
        <div id="step-section">{Step}</div>
      </AnimatedSection>
      <AnimatedSection>{Calendar}</AnimatedSection>

      <BookingBtn targetId="step-section" />

      <AnimatedSection>
        <Game />
      </AnimatedSection>
      <AnimatedSection>
        <MoreThemes />
      </AnimatedSection>
    </div>
  )
}
