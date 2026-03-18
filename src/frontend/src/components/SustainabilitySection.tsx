import { Droplets, Leaf, Recycle, Zap } from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: Leaf,
    title: "Biodegradable TPU Shell",
    desc: "Our base shell uses biodegradable thermoplastic polyurethane that naturally decomposes, leaving no lasting waste.",
  },
  {
    icon: Recycle,
    title: "3D Printed Bioplastics",
    desc: "Custom design elements are printed on-demand using plant-based bioplastics, reducing waste from overproduction.",
  },
  {
    icon: Zap,
    title: "Precision Laser Printing",
    desc: "Our laser printing process uses zero ink — just light and precision — to etch textures and patterns with no chemicals.",
  },
  {
    icon: Droplets,
    title: "Safe Coloring",
    desc: "All dyes are non-toxic, water-based, and certified safe for people and planet.",
  },
];

export default function SustainabilitySection() {
  return (
    <section id="about" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-eco-green mb-3">
              Sustainability
            </p>
            <h2 className="text-3xl font-bold uppercase tracking-tight text-foreground mb-4">
              Made for Earth. Not Just for Style.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Every Coirform is crafted with intention. We believe your phone
              case shouldn't outlive your phone — or the planet. From
              biodegradable materials to chemical-free processes, sustainability
              is built into every step.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 rounded-xl bg-muted/40 border border-border"
                >
                  <f.icon className="w-5 h-5 text-eco-green mb-1.5" />
                  <p className="text-xs font-bold text-foreground mb-0.5">
                    {f.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-card-lg"
          >
            <img
              src="/assets/generated/case-preview-green.dim_400x500.png"
              alt="Eco-friendly phone case"
              className="w-full h-80 object-cover"
            />
            <div className="bg-eco-green/10 border border-eco-green/20 p-4">
              <p className="text-sm font-semibold text-foreground">
                100% Sustainable Materials
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every case is made to order, eliminating excess inventory waste.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
