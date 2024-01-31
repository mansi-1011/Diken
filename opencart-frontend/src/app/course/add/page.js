"use client"
import Navbar from '@/src/component/navbar/Navbar'
import Pages from '@/src/component/pages/Pages'
import React, { useState } from 'react'

const page = () => {
    const list = ["Information", "Sources"];
    const [currentTab, setCurrentTab] = useState(0);
    return (
        <div>
            <Navbar logout="logout" />
            <Pages />
            
      <div className="page-title"> Add Course   </div>
      
      <div className="tab-container">
          {list.map((li, index) => {
            return (
              <div className={`tab ${index == currentTab ? "active" : null}`} key={li} onClick={() => setCurrentTab(index) } >
                {li}
              </div>
            )
          })}
        </div>
        </div>
    )
}

export default page