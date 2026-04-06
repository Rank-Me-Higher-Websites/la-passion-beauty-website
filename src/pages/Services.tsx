import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Scissors, Palette, Cable, Sparkles, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import CTASection from "@/components/sections/CTASection";
import { Button } from "@/components/ui/button";
import salonImage from "@/assets/services-storefront.png";

const serviceCategories = [
  {
    id: "hair",
    title: "Hair Services",
    icon: Scissors,
    items: [
      { name: "Haircut", price: "$45+" },
    ],
  },
  {
    id: "coloring",
    title: "Hair Coloring",
    icon: Palette,
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
    items: [
      { name: "Extensions", price: "Quote" },
    ],
  },
  {
    id: "spmu",
    title: "Semi-Permanent Makeup",
    icon: Sparkles,
    items: [
      { name: "SPMU Brows", price: "$400+" },
      { name: "SPMU Eyeliner", price: "$350+" },
      { name: "SPMU Lips / Lip Blushing", price: "$450+" },
      { name: "BrowXenna Powder", price: "$40" },
    ],
  },
];

const Services = () => {
  return (
    <Layout>
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={salonImage}
            alt="La Passion Beauty Salon"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        </div>
        <div className="container-custom relative z-10 pb-8 md:pb-12 pt-28">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/80 uppercase tracking-[0.2em] text-sm mb-2"
          >
            What We Offer
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-hero text-white mb-3"
          >
            Our Services
          </motion.h1>
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-sm"
          >
            <Link to="/" className="text-white/60 hover:text-white transition-colors">Home</Link>
            <span className="text-white/40">/</span>
            <span className="text-white">Services</span>
          </motion.nav>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="container-custom max-w-3xl">
          {serviceCategories.map((category) => (
            <motion.div
              key={category.id}
              id={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 last:mb-0"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <category.icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">{category.title}</h2>
              </div>

              <div className="rounded-lg border-2 border-gray-300 bg-card overflow-hidden">
                {category.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 border-b border-gray-300 last:border-b-0"
                  >
                    <span className="font-serif text-base text-foreground">{item.name}</span>
                    <span className="text-sm font-semibold text-primary ml-4">{item.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <Button variant="gold" size="lg" asChild className="w-full mt-6">
            <Link to="/booking">
              Book an Appointment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Services;
