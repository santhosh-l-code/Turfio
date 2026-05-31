import Navbar from "../components/Navbar"

import { Outlet, useLocation } from "react-router-dom"
import SportFilterBar from "../components/SportFilterbar"

export default function MainLayout() {

    const location = useLocation()

    const showSportBar = location.pathname.startsWith("/turfs")

    const isHome = location.pathname === "/"

    return (
        <div className="bg-gray-50 min-h-screen">

            <Navbar />


            {isHome ? (
                <Outlet />
            ) : (
                <div className="max-w-7xl mx-auto px-8 py-8">
                    <Outlet />
                </div>
            )}

        </div>
    )
}