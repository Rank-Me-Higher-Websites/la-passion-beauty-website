import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Clock } from "lucide-react";

const MapSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-10 md:py-16 lg:py-20 px-5 md:px-8 bg-primary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-5 md:mb-6"
        >
          <p className="text-white/80 uppercase tracking-[0.2em] text-xs md:text-sm mb-2 md:mb-3">Location</p>
          <h2 className="heading-section text-white mb-3 md:mb-4 text-2xl md:text-3xl lg:text-4xl">Visit Our Salon</h2>
          <p className="text-white/80 text-sm md:text-base">
            Conveniently located in Lemont, IL, our salon offers a relaxing atmosphere 
            where you can unwind and feel your best.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 md:gap-6"
          >
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-soft border border-white/30">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-base md:text-lg font-semibold text-foreground mb-1">Address</h3>
                  <p className="text-sm text-muted-foreground">Lemont, IL</p>
                  <a
                    href="https://maps.app.goo.gl/rz34qNsMxhEowymC8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xs md:text-sm hover:underline mt-1 inline-block"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-soft border border-white/30">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-base md:text-lg font-semibold text-foreground mb-1">Phone</h3>
                  <a
                    href="tel:+13313188113"
                    className="text-primary hover:underline text-sm"
                  >
                    +1 331-318-8113
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-soft border border-white/30">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-base md:text-lg font-semibold text-foreground mb-1">Hours</h3>
                  <div className="text-muted-foreground text-xs md:text-sm space-y-0.5">
                    <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-background rounded-2xl overflow-hidden shadow-card h-full min-h-[280px] md:min-h-[400px] border border-black/15">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.5534534651215!2d-87.96842082403798!3d41.66221607126628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e384a230a083d%3A0xfd3d8f5449fd7b9c!2sLa%20Passion%20Beauty%20Salon!5e1!3m2!1sen!2slt!4v1769706988091!5m2!1sen!2slt" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: "280px" }}
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
