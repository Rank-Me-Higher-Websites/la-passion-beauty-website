import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Scissors, Palette, Cable, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import CTASection from "@/components/sections/CTASection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import hairExtensionsImage from "@/assets/hair-extensions.jpg";
import hairColoringImage from "@/assets/hair-coloring.jpg";
import hairTreatmentImage from "@/assets/hair-treatment.jpg";
import permanentMakeupImage from "@/assets/permanent-makeup.jpg";

const services = [
  {
    id: "hair",
    title: "Hair Services",
    icon: Scissors,
    image: hairExtensionsImage,
    description: "Our professional stylists specialize in personalized haircuts that enhance your natural beauty. Whether you're looking for a fresh new style or a simple trim, we make sure your hair looks flawless and feels its best.",
    items: [
      { name: "Haircut", price: "$45+" },
    ],
  },
  {
    id: "coloring",
    title: "Hair Coloring",
    icon: Palette,
    image: hairColoringImage,
    description: "From subtle highlights to bold, vibrant shades, our hair coloring services are tailored to your style and personality. Using professional techniques and quality products, we create colors that look fresh, natural, and keep your hair healthy and radiant.",
    items: [
      { name: "Root Touch-Up", price: "$85+" },
      { name: "Full Color", price: "$110+" },
      { name: "Full Color + Cut", price: "$140+" },
      { name: "Partial Highlights", price: "$120+" },
      { name: "Full Highlights", price: "$160+" },
      { name: "Highlights + Cut + Toner", price: "$190+" },
    ],
  },
  {
    id: "extensions",
    title: "Hair Extensions",
    icon: Cable,
    image: hairExtensionsImage,
    description: "Looking for instant length or volume? Our high-quality hair extensions blend seamlessly with your natural hair, giving you a fuller, longer look that feels comfortable and effortless. Available with Kamila Janik and Veronika Dadek.",
    items: [
      { name: "Extensions", price: "Quote" },
    ],
  },
];

const Services = () => {
  return (
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
              What We Offer
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="heading-hero text-foreground mb-6"
            >
              Our Beauty Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-body max-w-2xl"
            >
              Whether it's a new color, a fresh cut, or extensions for instant length, our stylists 
              use techniques and products that keep your hair healthy and styled just for you.
            </motion.p>
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-sm mt-6"
            >
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">Services</span>
            </motion.nav>
          </div>
        </div>
      </section>

        {/* Services List */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="space-y-12">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  id={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="relative rounded-2xl overflow-hidden shadow-elevated border border-border">
                      <img
                        src={service.image}
                        alt={`${service.title} at La Passion Beauty Salon`}
                        className="w-full h-80 object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <service.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h2 className="heading-section text-foreground">{service.title}</h2>
                    </div>
                    <p className="text-body mb-6">{service.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {service.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border-2 border-black bg-card">
                          <div>
                            <span className="text-foreground font-medium">{item.name}</span>
                            {item.note && (
                              <p className="text-sm text-muted-foreground">{item.note}</p>
                            )}
                          </div>
                          <span className="text-primary font-semibold">{item.price}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="gold" asChild>
                      <Link to="/pricing">
                        View Full Pricing
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="section-padding bg-cream-dark">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="heading-section text-foreground mb-6">What to Expect</h2>
              <p className="text-body mb-6">
                At La Passion Beauty Salon, every visit is designed to be personal, relaxing, and uplifting. 
                We start with a friendly consultation to understand your goals — whether it's a fresh haircut, 
                new hair color, highlights, or extensions for instant length and volume.
              </p>
              <p className="text-body">
                Our stylists use professional techniques and high-quality products to keep your hair healthy 
                while creating a style that truly fits you. More than just a salon appointment, we 
                want your time with us to feel like self-care.
              </p>
            </motion.div>
          </div>
        </section>

        <CTASection />
      </Layout>
  );
};

export default Services;
