import React from 'react'
import style from './navbar.module.css'
import Image from 'next/image'
import navlogo from "@/src/assets/logo.png"

const Navbar = ({logout}) => {
  return (
    <div className={style.navbar}>
        <div>
        <Image src={navlogo} alt='nav_logo' />
        </div>
        {logout == "logout" && <div className={style.logout}>
        logout
        </div>}
        
    </div>
  )
}

export default Navbar 