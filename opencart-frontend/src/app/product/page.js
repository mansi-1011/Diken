import Navbar from '@/src/component/navbar/Navbar'
import Pages from '@/src/component/pages/Pages'
import React from 'react'

const product = () => {
  return (
    <div>
      <Navbar   logout="logout"  />
      <Pages />
    </div>
  )
}

export default product