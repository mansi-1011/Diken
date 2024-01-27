import Navbar from '@/src/component/navbar/Navbar'
import Pages from '@/src/component/pages/Pages'
import React from 'react'

const home = () => {
  return (
    <div>
      <Navbar  logout="logout"  />
      <Pages />
    </div>
  )
}

export default home