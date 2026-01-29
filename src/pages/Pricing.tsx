import { Helmet } from "react-helmet-async";
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
      { service: "Women's Haircut & Style", price: "$45+" },
      { service: "Men's Haircut", price: "$30+" },
      { service: "Blowout", price: "$35+" },
      { service: "Updo / Special Occasion Style", price: "$60+" },
      { service: "Hair Extensions (Consultation)", price: "Free" },
    ],
  },
  {
    title: "Hair Coloring",
    items: [
      { service: "Root Touch-Up", price: "$85+" },
      { service: "Full Color", price: "$110+" },
      { service: "Partial Highlights", price: "$120+" },
      { service: "Full Highlights", price: "$160+" },
      { service: "Balayage / Ombre", price: "$140+" },
      { service: "Toner / Gloss Treatment", price: "$45+" },
    ],
  },
  {
    title: "Hair Treatments",
    items: [
      { service: "Deep Conditioning Treatment", price: "$35+" },
      { service: "Keratin Smoothing Treatment", price: "$150+" },
      { service: "Botox BTX 2.0 Hair Treatment", price: "$100+" },
      { service: "Scalp Detox or Hair Repair Mask", price: "Consultation" },
    ],
  },
];

const permanentMakeup = [
  {
    title: "Ombre / Powder Brows",
    price: "$500",
    session: "1st Session",
    touchUp: "$100 (within 2 months)",
    description: "This technique uses a machine to achieve a natural soft powder look. By gently brushing the skin with a single nano needle, we build the pigment layer by layer, creating a gradient of color from dark to light.",
  },
  {
    title: "Combo Brows",
    price: "$500",
    session: "1st Session",
    touchUp: "$100 (within 2 months)",
    description: "The combo brow combines hair strokes with shading, achieving the most natural and 3D-effect look possible for your eyebrows. Ideal for individuals with sparse areas or patchy spots.",
  },
  {
    title: "Eyeliner Enhancement",
    price: "$400",
    session: "1st Session",
    touchUp: "$100 (within 2 months)",
    description: "This subtle technique provides your top lashes with a backdrop, making them appear fuller while also outlining and framing your eyes. Delivers a very natural look.",
  },
];

const Pricing = () => {
  return (
    <>
      <Helmet>
        <title>Pricing | Beauty Salon Prices in Lemont, IL - La Passion Beauty Salon</title>
        <meta 
          name="description" 
          content="View La Passion Beauty Salon's transparent pricing for haircuts, coloring, treatments, and permanent makeup. Fair prices for high-quality beauty services in Lemont, IL." 
        />
        <link rel="canonical" href="https://lapassionbeautysalon.com/pricing" />
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
                From coloring and cuts to treatments and permanent makeup, our pricing reflects the care 
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
                  <Card className="h-full flex flex-col shadow-card border-0">
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

        {/* Permanent Makeup Pricing */}
        <section className="section-padding bg-cream-dark">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="heading-section text-foreground mb-4">Permanent Makeup</h2>
              <p className="text-body max-w-2xl mx-auto">
                Enhance your natural beauty with our expertly applied permanent makeup services. 
                Each treatment is customized to your features for soft, long-lasting results.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {permanentMakeup.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col shadow-card border-0 overflow-hidden">
                    <CardHeader className="bg-foreground text-primary-foreground">
                      <CardTitle className="font-serif text-xl text-center">
                        {item.title}
                      </CardTitle>
                      <div className="text-center mt-2">
                        <span className="text-4xl font-bold text-primary">{item.price}</span>
                        <p className="text-sm text-primary-foreground/70">{item.session}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 p-6">
                      <p className="text-sm text-muted-foreground flex-1 mb-4">{item.description}</p>
                      <div className="bg-primary/10 rounded-lg p-3 mb-4">
                        <p className="text-sm text-center">
                          <span className="text-foreground font-medium">Touch-up:</span>{" "}
                          <span className="text-primary font-semibold">{item.touchUp}</span>
                        </p>
                      </div>
                      <Button variant="gold" className="w-full mt-auto" asChild>
                        <a href="tel:+13313188113">Book Consultation</a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm text-muted-foreground text-center mt-8 max-w-3xl mx-auto"
            >
              <strong>Note:</strong> For the first 10-12 days, eyebrows will appear darker, bolder, and thicker 
              due to scab formation and the natural skin healing process. This is common and expected for all 
              permanent makeup procedures. A touch-up is necessary 4-6 weeks after the initial procedure.
            </motion.p>
          </div>
        </section>

        <CTASection />
      </Layout>
    </>
  );
};

export default Pricing;
