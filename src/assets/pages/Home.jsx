import BenefitsSection from "../components/home/BenefitsSection"
import CTASection from "../components/home/CTASection"
import FAQSection from "../components/home/FAQSection"
import FlavorsSection from "../components/home/FlavorsSection"
import HeroSection from "../components/home/HeroSection"
import HowToOrderSection from "../components/home/HowToOrderSection"
import NutritionSection from "../components/home/NutritionSection"
import TestimonialsSection from "../components/home/TestimonialsSection"
import Footer from "../components/layout/Footer"
import Header from "../components/layout/Header"



const Home = () => {
  return (
    <>
        <Header />
        <HeroSection />
        <BenefitsSection />
        <NutritionSection />
        <FlavorsSection />
        <HowToOrderSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <Footer />
    </>
  )
}

export default Home
