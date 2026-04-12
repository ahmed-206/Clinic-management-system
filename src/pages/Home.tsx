import { Features } from "../components/landing/Features"
import { Hero } from "../components/landing/Hero"
import { HowItWorks } from "../components/landing/HowItWorks"
import { Stats } from "../components/landing/Stats"
export const HomePage = () => {
    return (
         <>
            <Hero />
        <main className=" mx-auto px-4 bg-neutral-100">
            <Stats />
            <Features />
            <HowItWorks />
        </main>
         </>
    )
}