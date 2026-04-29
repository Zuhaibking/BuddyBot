'use client'

import { SpiralAnimation } from "@/components/ui/spiral-animation"
import { useState, useEffect } from 'react'

const SpiralDemo = () => {
  const [startVisible, setStartVisible] = useState(false)
  
  const navigateToPersonalSite = () => {
    window.location.href = "https://xubh.top/"
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartVisible(true)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="fixed inset-0 h-full w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>
      
      <div 
        className={`
          absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2
          transition-all duration-1500 ease-out
          ${startVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}
      >
        <button 
          onClick={navigateToPersonalSite}
          className="
            animate-pulse text-2xl font-extralight uppercase tracking-[0.2em] text-white
            transition-all duration-700 hover:tracking-[0.3em]
          "
        >
          Enter
        </button>
      </div>
    </div>
  )
}

export { SpiralDemo }