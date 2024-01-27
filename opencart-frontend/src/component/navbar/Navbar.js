import React from 'react'
import style from './navbar.module.css'
import Image from 'next/image'
import navlogo from "@/src/assets/logo.png"

const Navbar = () => {
  return (
    <div className={style.navbar}>
        <div>
        <Image src={navlogo} alt='nav_logo' />
        </div>
    </div>
  )
}

export default Navbar 