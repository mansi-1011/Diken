"use client"
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import React from 'react'

const Pages = () => {
    const path = usePathname()
    const router = useRouter()
    const route = [
        { title: "Dashboard", path: "/home" },
        { title: "Orders", path: "/orders" },
        { title: "Products", path: "/product" },
        { title: "Customers", path: "/costumers" }
    ]
    console.log(path)
    return (
        <>
            <ul className="topnav">
                {route.map((i, j) => <li key={j}>
                        <a className={path == i.path && "active"} onClick={() => router.push(i.path)}>{i.title}</a>
                        </li>
                )}
                {/* <li><a className="active" href="#home">Home</a></li>
                <li><a href="#news">News</a></li>
                <li><a href="#contact">Contact</a></li>
                <li className="right"><a href="#about">About</a></li> */}
            </ul>


        </>
    )
}

export default Pages