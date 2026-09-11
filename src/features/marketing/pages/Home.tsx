import { Features } from "@/features/marketing/components/Features"
import { Hero } from "@/features/marketing/components/Hero"
import { HowItWorks } from "@/features/marketing/components/HowItWorks"

import { Stats } from "@/features/marketing/components/Stats"
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