import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Scissors, Palette, Cable, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import CTASection from "@/components/sections/CTASection";
import { Button } from "@/components/ui/button";
import salonImage from "@/assets/services-storefront.png";

const serviceCategories = [
  {
    id: "hair",
    title: "Hair Services",
    icon: Scissors,
    description: "Our professional stylists specialize in personalized haircuts that enhance your natural beauty. Whether you're looking for a fresh new style or a simple trim, we make sure your hair looks flawless and feels its best.",
    items: [
      { name: "Haircut", price: "$45+" },
    ],
  },
  {
    id: "coloring",
    title: "Hair Coloring",
    icon: Palette,
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
    description: "Looking for instant length or volume? Our high-quality hair extensions blend seamlessly with your natural hair, giving you a fuller, longer look that feels comfortable and effortless. Available with Kamila Janik and Veronika Dadek.",
    items: [
      { name: "Extensions", price: "Quote" },
    ],
  },
];

const Services = () => {
  return (
    <Layout>
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0">
          <img
            src={salonImage}
            alt="La Passion Beauty Salon"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/80 uppercase tracking-[0.2em] text-sm mb-3"
            >
              What We Offer
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="heading-hero text-white mb-6"
            >
              Our Beauty Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 max-w-2xl text-sm md:text-base leading-relaxed"
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
              <Link to="/" className="text-white/60 hover:text-white transition-colors">Home</Link>
              <span className="text-white/40">/</span>
              <span className="text-white">Services</span>
            </motion.nav>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="space-y-10">
              {serviceCategories.map((category, catIndex) => (
                <motion.div
                  key={category.id}
                  id={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h2 className="font-serif text-2xl font-semibold text-foreground">{category.title}</h2>
                  </div>
                  <p className="text-body mb-5">{category.description}</p>

                  <div className="rounded-xl border border-black/15 bg-card overflow-hidden">
                    {category.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-5 py-4 border-b border-black/10 last:border-b-0"
                      >
                        <span className="font-serif text-lg text-foreground">{item.name}</span>
                        <span className="text-sm font-semibold text-primary ml-4">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

            <div className="mt-8">
              <Button variant="gold" size="lg" asChild className="w-full max-w-md mx-auto block">
                <Link to="/booking">
                  Book an Appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

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
