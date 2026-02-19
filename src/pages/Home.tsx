import { Features } from "../components/landing/Features"
import { Hero } from "../components/landing/Hero"
import { HowItWorks } from "../components/landing/HowItWorks"
import { Stats } from "../components/landing/Stats"
export const HomePage = () => {
    return (
        <main className="container mx-auto px-4">
            <Hero />
            <Stats />
            <Features />
            <HowItWorks />
        </main>
    )
}