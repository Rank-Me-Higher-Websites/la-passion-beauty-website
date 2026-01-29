import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Clock } from "lucide-react";

const MapSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">Location</p>
          <h2 className="heading-section text-foreground mb-4">Visit Our Salon</h2>
          <p className="text-body">
            Conveniently located in Lemont, IL, our salon offers a relaxing atmosphere 
            where you can unwind and feel your best.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Address */}
            <div className="bg-card rounded-xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1">Address</h3>
                  <p className="text-muted-foreground">Lemont, IL</p>
                  <a
                    href="https://maps.app.goo.gl/rz34qNsMxhEowymC8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline mt-2 inline-block"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-card rounded-xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1">Phone</h3>
                  <a
                    href="tel:+13313188113"
                    className="text-primary hover:underline"
                  >
                    +1 331-318-8113
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-card rounded-xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1">Hours</h3>
                  <div className="text-muted-foreground text-sm space-y-1">
                    <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-card rounded-2xl overflow-hidden shadow-card h-full min-h-[400px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.5534534651215!2d-87.96842082403798!3d41.66221607126628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e384a230a083d%3A0xfd3d8f5449fd7b9c!2sLa%20Passion%20Beauty%20Salon!5e1!3m2!1sen!2slt!4v1769706988091!5m2!1sen!2slt" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="La Passion Beauty Salon Location"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
