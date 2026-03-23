import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import CTASection from "@/components/sections/CTASection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const pricingCategories = [
  {
    title: "Hair Services",
    items: [
      { service: "Haircut", price: "$45+" },
    ],
  },
  {
    title: "Hair Coloring",
    items: [
      { service: "Root Touch-Up", price: "$85+" },
      { service: "Full Color", price: "$110+" },
      { service: "Full Color + Cut", price: "$140+" },
      { service: "Partial Highlights", price: "$120+" },
      { service: "Full Highlights", price: "$160+" },
      { service: "Highlights + Cut + Toner", price: "$190+" },
    ],
  },
  {
    title: "Extensions",
    items: [
      { service: "Extensions", price: "Quote" },
    ],
  },
];

const Pricing = () => {
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
              La Passion Beauty Salon
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="heading-hero text-foreground mb-6"
            >
              Our Pricing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-body max-w-2xl"
            >
              We're proud to offer high-quality hair and beauty services at fair, transparent pricing. 
              From coloring and cuts to extensions, our pricing reflects the care 
              and expertise that go into every appointment.
            </motion.p>
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-sm mt-6"
            >
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">Pricing</span>
            </motion.nav>
          </div>
        </div>
      </section>

        {/* Hair Services Pricing */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="heading-section text-foreground text-center mb-12"
            >
              Hair Services Pricing
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {pricingCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col shadow-card border border-border">
                    <CardHeader className="bg-primary/5 border-b border-border">
                      <CardTitle className="font-serif text-xl text-foreground text-center">
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 p-6">
                      <div className="space-y-4 flex-1">
                        {category.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                            <span className="text-foreground">{item.service}</span>
                            <span className="text-primary font-semibold whitespace-nowrap ml-4">{item.price}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="gold" className="w-full mt-auto" asChild>
                        <a href="tel:+13313188113">Book Now</a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </Layout>
  );
};

export default Pricing;
