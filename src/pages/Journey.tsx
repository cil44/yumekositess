import { motion } from "motion/react";
import { Milestone, Rocket, Star, Code2, Heart } from "lucide-react";

export function Journey() {
  const milestones = [
    {
      date: "11 March 2026",
      title: "The Beginning",
      description: "Yumeko was born out of a hobby and a little obsession. The first lines of code were written, and a new journey began.",
      icon: <Code2 className="w-5 h-5 text-blue-400" />
    },
    {
      date: "24 March 2026",
      title: "First Milestone",
      description: "13 days of continuous development. Yumeko is slowly becoming what it is today, driven by pure ambition and dedication.",
      icon: <Rocket className="w-5 h-5 text-primary" />
    },
    {
      date: "Future",
      title: "Waiting to be Known",
      description: "Believing that Yumeko will be known by many people someday. Keeping the passion strong and waiting for the right moment.",
      icon: <Star className="w-5 h-5 text-yellow-400" />
    }
  ];

  return (
    <div className="min-h-[85vh] max-w-4xl mx-auto px-6 py-16 relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20 relative z-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
          <Milestone className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Yumeko's Journey</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          The story of how a small hobby project is growing into something bigger, one step at a time.
        </p>
      </motion.div>

      <div className="relative border-l-2 border-white/10 ml-4 md:ml-12 space-y-16 pb-12 z-10">
        {milestones.map((milestone, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative pl-10 md:pl-16"
          >
            {/* Timeline Node */}
            <div className="absolute -left-[21px] top-1 w-10 h-10 rounded-full bg-surface border-2 border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-primary/50 transition-colors">
              {milestone.icon}
            </div>

            {/* Content */}
            <div className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-white/10 hover:bg-surface/60 transition-all duration-300 group">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 text-xs font-mono font-bold text-gray-400 mb-6 tracking-wider uppercase">
                {milestone.date}
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mb-4 group-hover:text-primary transition-colors">
                {milestone.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                {milestone.description}
              </p>
            </div>
          </motion.div>
        ))}

        {/* End Node */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute -left-[13px] bottom-0 w-6 h-6 rounded-full bg-surface border-2 border-white/10 flex items-center justify-center"
        >
          <Heart className="w-3 h-3 text-pink-500" />
        </motion.div>
      </div>
    </div>
  );
}
