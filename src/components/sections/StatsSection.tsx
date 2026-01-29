import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Users, Star, Sparkles } from "lucide-react";

const stats = [
  { value: "1K+", label: "Happy Clients", icon: Users },
  { value: "10+", label: "Years Experience", icon: Award },
  { value: "5.0", label: "Star Rating", icon: Star },
  { value: "100%", label: "Certified Stylists", icon: Sparkles },
];

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 bg-foreground text-primary-foreground">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="font-serif text-3xl md:text-4xl font-semibold text-primary-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-primary-foreground/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
