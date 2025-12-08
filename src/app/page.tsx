import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import Services from '@/components/services'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Services />
      </main>
      <Footer />
    </div>
  )
}
