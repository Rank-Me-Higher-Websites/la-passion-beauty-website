import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import aboutSalon from "@/assets/about-salon.jpg";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message || null,
          source: "contact_form",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast({
        title: "Couldn't send message",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
              Reach our beauty salon team in Lemont, IL
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="heading-hero text-foreground mb-6"
            >
              Contact Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-body max-w-2xl"
            >
              At La Passion Beauty Salon, we're here to make your beauty experience effortless and enjoyable. 
              Contact us today to schedule your appointment and let us bring out your natural beauty.
            </motion.p>
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-sm mt-6"
            >
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">Contact Us</span>
            </motion.nav>
          </div>
        </div>
      </section>

        {/* Contact Content */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="heading-section text-foreground mb-8">Visit La Passion Beauty Salon</h2>
                
                <div className="space-y-6 mb-10">
                  {/* Phone */}
                  <a
                    href="tel:+13313188113"
                    className="flex items-start gap-4 p-4 bg-card rounded-xl shadow-soft hover:shadow-card transition-shadow group border border-border"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground">Phone</h3>
                      <p className="text-primary font-medium">+1 331-318-8113</p>
                      <p className="text-sm text-muted-foreground">Call us to book your appointment</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:info@lapassionbeautysalon.com"
                    className="flex items-start gap-4 p-4 bg-card rounded-xl shadow-soft hover:shadow-card transition-shadow group border border-border"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground">Email</h3>
                      <p className="text-primary font-medium">info@lapassionbeautysalon.com</p>
                      <p className="text-sm text-muted-foreground">Send us your questions anytime</p>
                    </div>
                  </a>

                  {/* Address */}
                  <a
                    href="https://maps.app.goo.gl/rz34qNsMxhEowymC8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 bg-card rounded-xl shadow-soft hover:shadow-card transition-shadow group border border-border"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground">Address</h3>
                      <p className="text-primary font-medium">12420 Archer Ave, Suite C</p>
                      <p className="text-primary font-medium">Lemont, IL 60439</p>
                      <p className="text-sm text-muted-foreground">Click for directions</p>
                    </div>
                  </a>

                  {/* Hours */}
                  <div className="flex items-start gap-4 p-4 bg-card rounded-xl shadow-soft border border-border">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground">Hours</h3>
                      <div className="text-muted-foreground">
                        <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick CTA */}
                <Button variant="cta" size="xl" className="w-full sm:w-auto" asChild>
                  <a href="tel:+13313188113">
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now to Book
                  </a>
                </Button>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        rows={4}
                        required
                        className="mt-2"
                      />
                    </div>
                    <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map & About Section */}
        <section className="section-padding bg-cream-dark">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left - Content & Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="heading-section text-foreground mb-4">Find Us</h2>
                <p className="text-body mb-6">
                  Conveniently located at 12420 Archer Ave, Suite C, Lemont, IL 60439, serving the greater Chicago area. 
                  Visit our salon and experience the luxurious atmosphere that sets La Passion apart.
                </p>
                <div className="flex items-start gap-3 mb-6">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">12420 Archer Ave Suite C</p>
                    <p className="text-muted-foreground">Lemont, IL 60439</p>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-card border border-border">
                  <img
                    src={aboutSalon}
                    alt="Inside La Passion Beauty Salon"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </motion.div>

              {/* Right - Map */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl overflow-hidden shadow-elevated border border-border"
              >
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.5534534651215!2d-87.96842082403798!3d41.66221607126628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e384a230a083d%3A0xfd3d8f5449fd7b9c!2sLa%20Passion%20Beauty%20Salon!5e1!3m2!1sen!2slt!4v1769706988091!5m2!1sen!2slt" 
                  width="100%" 
                  height="350" 
                  style={{ border: 0 }}
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="La Passion Beauty Salon Location Map"
                  className="w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
  );
};

export default Contact;
