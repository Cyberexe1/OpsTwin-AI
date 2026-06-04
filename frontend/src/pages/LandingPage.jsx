import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import ProblemSection from '../components/landing/ProblemSection'
import SolutionSection from '../components/landing/SolutionSection'
import HowItWorks from '../components/landing/HowItWorks'
import ArchitectureSection from '../components/landing/ArchitectureSection'
import SplunkIntegration from '../components/landing/SplunkIntegration'
import ImpactMetrics from '../components/landing/ImpactMetrics'
import TechStackStrip from '../components/landing/TechStackStrip'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <ArchitectureSection />
      <SplunkIntegration />
      <ImpactMetrics />
      <TechStackStrip />
      <Footer />
    </>
  )
}
