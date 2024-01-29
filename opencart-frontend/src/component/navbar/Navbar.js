"use client";
import React from 'react'
import style from './navbar.module.css'
import Image from 'next/image'
import navlogo from "@/src/assets/logo.png"

const Navbar = ({ logout }) => {
  const handleLogout = async () => {
    const res = await getAPI("/users/logout");
    if (res.status === 1) {
      router.push("/login");
      console.log(res);
    }
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