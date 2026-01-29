import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Award, Heart, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import StatsSection from "@/components/sections/StatsSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import CTASection from "@/components/sections/CTASection";
import { Button } from "@/components/ui/button";
import aboutImage from "@/assets/about-salon.jpg";

const commitments = [
  "Expert stylists with advanced training – always improving skills to give you the best results.",
  "Exclusive Kérastase haircare products – luxury formulas that keep your hair healthy and radiant.",
  "Personalized styles for every client – looks that reflect your personality and lifestyle.",
  "Restorative treatments for shine and strength – tailored care to revive and protect your hair.",
  "A modern, clean, and relaxing salon – a space designed for comfort and self-care.",
  "Honest advice and guidance – helping you choose what truly works for your hair.",
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | La Passion Beauty Salon - Expert Stylists in Lemont, IL</title>
        <meta 
          name="description" 
          content="Learn about La Passion Beauty Salon's team of certified expert stylists. We use Kérastase products and offer personalized hair care and permanent makeup services in Lemont, IL." 
        />
        <link rel="canonical" href="https://lapassionbeautysalon.com/about" />
      </Helmet>
      <Layout>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-cream-dark">
          <div className="container-custom">
            <div className="max-w-4xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary uppercase tracking-[0.2em] text-sm mb-3"
              >
                Confidence starts here, with care and creativity.
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="heading-hero text-foreground mb-6"
              >
                About Us
              </motion.h1>
              <motion.nav
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-sm"
              >
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
                <span className="text-muted-foreground">/</span>
                <span className="text-foreground">About Us</span>
              </motion.nav>
            </div>
          </div>
        </section>

        <StatsSection />

        {/* Masters Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                  <img
                    src={aboutImage}
                    alt="La Passion Beauty Salon interior"
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 border-4 border-primary/30 rounded-2xl -z-10" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="heading-section text-foreground mb-6">
                  Masters of Hair and Timeless Beauty
                </h2>
                <p className="text-body mb-6">
                  Every client at La Passion Beauty Salon receives more than just a service — they 
                  experience personalized care designed to highlight their unique beauty. Our team 
                  works exclusively with <strong className="text-foreground">Kérastase</strong>, the 
                  world's leading luxury haircare brand, to keep hair healthy, radiant, and full of life.
                </p>
                <p className="text-body mb-6">
                  With expert techniques, attention to detail, and a commitment to excellence, we 
                  create results that feel as good as they look.
                </p>
                <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg">
                  <Award className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Certifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Our technicians are certified and licensed to provide professional hair services and permanent makeup.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="section-padding bg-cream-dark">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">Your Trusted Beauty Experts</p>
              <h2 className="heading-section text-foreground mb-4">Our Commitment to Quality</h2>
              <p className="text-body">
                With years of experience and a passion for detail, we provide professional beauty 
                services you can trust for stunning, lasting results.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {commitments.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 bg-card rounded-lg p-4 shadow-soft"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Promise */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-8 shadow-card text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">Our Mission</h3>
                <p className="text-body">
                  To provide exceptional hair and beauty services that combine skill, creativity, 
                  and premium products, delivering results that leave every client feeling confident, 
                  radiant, and cared for.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-card text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">Our Promise</h3>
                <p className="text-body">
                  We are committed to offering a welcoming, relaxing environment where every client 
                  receives personalized attention, honest advice, and expert care — ensuring beauty 
                  that lasts long after you leave the salon.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <ReviewsSection />
        <CTASection />
      </Layout>
    </>
  );
};

export default About;
