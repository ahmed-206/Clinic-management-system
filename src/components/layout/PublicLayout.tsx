import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"

export const PublicLayout = () => {
    return(
        <div>

            <Navbar />
            <main>
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}