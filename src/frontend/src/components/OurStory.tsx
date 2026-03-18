import { motion } from "motion/react";

const founders = ["Ilaa", "Ashwini", "Jemi", "Sadhana"];

export default function OurStory() {
  return (
    <section
      className="py-20 px-4 overflow-hidden"
      style={{ background: "oklch(var(--secondary))" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-4"
        >
          Our Story
        </motion.p>

        {/* Founders names */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {founders.map((name, i) => (
            <span
              key={name}
              className="text-sm font-semibold px-3 py-1 rounded-full border border-border text-foreground"
              style={{
                background: "oklch(var(--background))",
                opacity: 0.85 + i * 0.03,
              }}
            >
              {name}
            </span>
          ))}
          <span className="text-sm px-3 py-1 text-muted-foreground italic">
            Grade 11 · IBDP · Kerala
          </span>
        </motion.div>

        {/* Story paragraphs */}
        <div className="space-y-6 text-foreground">
          <StoryParagraph delay={0.1}>
            We&rsquo;re Ilaa, Ashwini, Jemi, and Sadhana — four Grade 11 IBDP
            students who somehow started a business in a free lesson.
          </StoryParagraph>

          <StoryParagraph delay={0.15}>
            We were just sitting around, some of us on our phones, when one of
            us suddenly slammed hers down and said,{" "}
            <span className="font-bold text-primary italic text-xl leading-none align-middle">
              &ldquo;thengha!&rdquo;
            </span>{" "}
            Malayalam for <em className="text-muted-foreground">coconut</em>.
            The phone was burning hot.
          </StoryParagraph>

          <StoryParagraph delay={0.2}>
            For some reason, that moment stuck.
          </StoryParagraph>

          <StoryParagraph delay={0.25}>
            Back home in Kerala, coconut husk gets thrown away in tonnes. At the
            same time, eco-friendly phone cases exist, but at ₹1,500,
            they&rsquo;re not really made for students like us. No one had
            connected those two things.
          </StoryParagraph>

          <motion.p
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl font-bold text-foreground leading-snug"
          >
            We did.{" "}
            <span className="text-muted-foreground font-normal text-base">
              In about forty-five minutes.
            </span>
          </motion.p>

          <StoryParagraph delay={0.35}>
            That&rsquo;s how CoirForm started — a{" "}
            <strong className="text-primary">₹399 phone case</strong> made from
            coconut husk waste that helps keep your phone cooler and biodegrades
            in 2 to 3 years.
          </StoryParagraph>

          <StoryParagraph delay={0.4}>
            A few weeks later, we pitched it at our school&rsquo;s mini Shark
            Tank.
          </StoryParagraph>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="text-xl font-semibold text-foreground"
          >
            And somehow, the room listened.
          </motion.p>

          <StoryParagraph delay={0.5}>
            We&rsquo;re not experts. Just four students who turned a random free
            lesson into something real, and now we&rsquo;re seeing where it
            goes.
          </StoryParagraph>
        </div>

        {/* Closing line */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="mt-16 border-t border-border pt-10 text-center"
        >
          <p
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: "oklch(var(--primary))" }}
          >
            One{" "}
            <span
              className="italic font-bold"
              style={{ color: "oklch(var(--foreground))" }}
            >
              thengha
            </span>{" "}
            at a time.
          </p>
          <p className="mt-3 text-sm text-muted-foreground tracking-widest uppercase">
            🥥 Coirform · Est. 2024 · Kerala, India
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function StoryParagraph({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-base md:text-lg leading-relaxed text-foreground/90"
    >
      {children}
    </motion.p>
  );
}
