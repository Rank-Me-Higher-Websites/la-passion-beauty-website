import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What services does La Passion Beauty Salon offer?",
    answer: "We offer a wide range of beauty services including haircuts, hair coloring, balayage, highlights, hair extensions, keratin treatments, deep conditioning, permanent makeup (ombre brows, combo brows, eyeliner), and more. Our stylists are trained in the latest techniques to deliver stunning results.",
  },
  {
    question: "Do I need an appointment or do you accept walk-ins?",
    answer: "While we do accept walk-ins when availability allows, we highly recommend scheduling an appointment to ensure you get your preferred time slot and stylist. You can book by calling us at +1 331-318-8113 or visiting our contact page.",
  },
  {
    question: "What hair care products do you use?",
    answer: "We work exclusively with Kérastase, the world's leading luxury haircare brand trusted by professionals worldwide. Each formula is crafted with high-performance ingredients to strengthen, nourish, and protect every strand.",
  },
  {
    question: "How long does permanent makeup last?",
    answer: "Permanent makeup typically lasts 1-3 years depending on your skin type, lifestyle, and aftercare. We recommend a touch-up 4-6 weeks after the initial procedure, with yearly touch-ups to maintain color richness and shape.",
  },
  {
    question: "Where is La Passion Beauty Salon located?",
    answer: "We are conveniently located in Lemont, IL, serving the greater Chicago area. Our salon offers a relaxing, modern atmosphere where you can unwind and enjoy your beauty treatment. Visit our contact page for detailed directions.",
  },
  {
    question: "What should I expect during my first visit?",
    answer: "During your first visit, we'll start with a friendly consultation to understand your goals and preferences. Whether it's a haircut, color, or treatment, we'll discuss options that work best for you. Our goal is for you to leave feeling confident, refreshed, and truly yourself.",
  },
];

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-cream-dark">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">FAQ</p>
            <h2 className="heading-section text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-body">
              Have questions about our services? We've compiled answers to the most common 
              questions to help you prepare for your visit to La Passion Beauty Salon.
            </p>
          </motion.div>

          {/* Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-lg px-6 border-0 shadow-soft"
                >
                  <AccordionTrigger className="text-left font-serif text-lg hover:text-primary hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
