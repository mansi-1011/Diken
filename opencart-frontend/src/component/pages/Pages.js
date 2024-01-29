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
    return (
        <>
            <ul className="topnav">
                {route.map((i, j) => <li key={j}>
                        <a className={path.includes(i.path) ? "active" : ""} onClick={() => router.push(i.path)}>{i.title}</a>
                        </li>
                )}
            </ul>
        </>
    )
}

export default Pages