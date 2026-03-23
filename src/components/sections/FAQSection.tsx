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
    answer: "We offer expert haircuts, a full range of hair coloring services including highlights, full color, root touch-ups, and combo packages with cuts and toner. We also offer premium hair extensions with select stylists.",
  },
  {
    question: "Do I need an appointment or do you accept walk-ins?",
    answer: "While we do accept walk-ins when availability allows, we highly recommend scheduling an appointment to ensure you get your preferred time slot and stylist. You can book by calling us at +1 331-318-8113 or visiting our contact page.",
  },
  {
    question: "What hair care products do you use?",
    answer: "Healthy, beautiful hair starts with the right products. That's why we work exclusively with Kérastase, a luxury haircare brand trusted by professionals worldwide. Each formula is crafted with high-performance ingredients to strengthen, nourish, and protect every strand.",
  },
  {
    question: "Who does hair extensions?",
    answer: "Hair extensions are available with Kamila Janik and Veronika Dadek. Contact us for a consultation to discuss the best options for your desired look.",
  },
  {
    question: "Where is La Passion Beauty Salon located?",
    answer: "We are conveniently located in Lemont, IL, serving the greater Chicago area. Our salon offers a relaxing, modern atmosphere where you can unwind and enjoy your beauty treatment. Visit our contact page for detailed directions.",
  },
  {
    question: "What should I expect during my first visit?",
    answer: "During your first visit, we'll start with a friendly consultation to understand your goals and preferences. Whether it's a haircut, color, or extensions, we'll discuss options that work best for you. Our goal is for you to leave feeling confident, refreshed, and truly yourself.",
  },
];

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-custom max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">FAQ</p>
          <h2 className="heading-section text-foreground mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-body">
            Have questions about our services? Here are answers to the most common ones.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-lg px-5 border border-black/15 shadow-soft"
              >
                <AccordionTrigger className="text-left font-serif text-base hover:text-primary hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
