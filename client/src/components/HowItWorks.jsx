import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const HowItWorks = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const steps = [
    {
      icon: "💻",
      title: "Book Online",
      description: "Book your delivery in few clicks",
      color: "bg-gradient-to-br from-blue-500 to-blue-400",
    },
    {
      icon: "📦",
      title: "Pickup",
      description: "We collect from your doorstep",
      color: "bg-gradient-to-br from-green-500 to-green-400",
    },
    {
      icon: "🔍",
      title: "Track",
      description: "Monitor Your delivery",
      color: "bg-gradient-to-br from-orange-500 to-orange-400",
    },
    {
      icon: "✨",
      title: "Deliver",
      description: "Safe and timely delivery",
      color: "bg-gradient-to-br from-blue-500 to-blue-400",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className="min-h-screen flex items-center bg-white py-20"
      id="how-it-works"
    >
      <div className="w-full px-8">
        <div className="container mx-auto">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get your parcel delivered
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                <div className="text-center bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="relative inline-block">
                    <div
                      className={`w-24 h-24 ${step.color} rounded-2xl flex items-center justify-center text-4xl text-white shadow-lg mb-6 transform transition-transform hover:scale-110`}
                    >
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
