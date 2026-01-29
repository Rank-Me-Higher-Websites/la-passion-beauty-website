import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutSection from "@/components/sections/AboutSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import FAQSection from "@/components/sections/FAQSection";
import MapSection from "@/components/sections/MapSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>La Passion Beauty Salon | Top-Rated Hair & Beauty Salon in Lemont, IL</title>
        <meta 
          name="description" 
          content="La Passion Beauty Salon in Lemont, IL offers expert hair care, coloring, treatments, and permanent makeup. Experience luxury beauty services from certified professionals. Call +1 331-318-8113." 
        />
        <meta name="keywords" content="beauty salon Lemont IL, hair salon Chicago, permanent makeup, hair coloring, hair treatments, Kerastase, balayage, ombre brows" />
        <link rel="canonical" href="https://lapassionbeautysalon.com/" />
      </Helmet>
      <Layout>
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <AboutSection />
        <ReviewsSection />
        <FAQSection />
        <MapSection />
        <CTASection />
      </Layout>
    </>
  );
};

export default Index;
