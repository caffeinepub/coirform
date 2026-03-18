import { Eye, Globe, Package, Palette, Smartphone } from "lucide-react";
import { motion } from "motion/react";

const STEPS = [
  { icon: Globe, label: "Visit", desc: "Open Coirform Studio in your browser" },
  { icon: Smartphone, label: "Select", desc: "Choose your phone model" },
  { icon: Palette, label: "Customize", desc: "Pick color, texture & pattern" },
  { icon: Eye, label: "Preview", desc: "See your design live" },
  { icon: Package, label: "Order", desc: "We mold & ship in 5–7 days" },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold uppercase tracking-tight text-center text-foreground mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-eco-green/10 border border-eco-green/20 flex items-center justify-center mb-3">
                <step.icon className="w-6 h-6 text-eco-green" />
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute w-12 h-0.5 bg-eco-green/20 translate-x-16 translate-y-7" />
              )}
              <p className="text-xs font-bold uppercase tracking-widest text-eco-green mb-1">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
