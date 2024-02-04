"use client";
import React from 'react'
import style from './navbar.module.css'
import Image from 'next/image'
import navlogo from "@/src/assets/logo.png"
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Navbar = ({ logout }) => {
  const router = useRouter()
  const handleLogout = async () => {
    Cookies.remove('authToken')
    router.replace("/login");
  }
  return (
    <div className={style.navbar}>
      <div>
        <Image src={navlogo} alt='nav_logo' priority="true" />
      </div>
      {logout == "logout" && <div className={style.logout} onClick={() => handleLogout()} >
      logout
      </div>}

    </div>
  )
}

export default Navbar 