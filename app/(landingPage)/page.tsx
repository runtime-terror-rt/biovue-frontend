import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import ProfessionalsSection from "@/components/ProfessionalsSection";
import FAQSection from "@/components/FAQSection";
import DownloadSection from "@/components/DownloadSection";
import TransformSection from "@/components/TransformSection";
import PartnersSection from "@/components/PartnersSection";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <HeroSection />

      <main className="relative bg-landing">
        <FeaturesSection />
        <HowItWorks />
        <ProfessionalsSection />
        <FAQSection />
        <DownloadSection />
        <TransformSection />
        <PartnersSection />
        <Footer />
      </main>
    </div>
  );
}
