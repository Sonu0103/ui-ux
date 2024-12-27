import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Features = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const features = [
    {
      icon: "⚡",
      title: "Fast Delivery",
      description: "Quick and efficient delivery service you can rely on",
      color: "bg-gradient-to-br from-blue-500 to-blue-400",
    },
    {
      icon: "🎯",
      title: "Real Time Tracking",
      description: "Track Your Parcels Location in real-time",
      color: "bg-gradient-to-br from-green-500 to-green-400",
    },
    {
      icon: "💎",
      title: "Affordable Pricing",
      description: "Competitive rates for all your delivery needs",
      color: "bg-gradient-to-br from-orange-500 to-orange-400",
    },
    {
      icon: "🛡️",
      title: "Secure and Reliable",
      description: "Your parcels safety is our top priority",
      color: "bg-gradient-to-br from-blue-500 to-blue-400",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section
      className="min-h-screen flex items-center py-20 bg-white"
      id="services"
    >
      <div className="w-full px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
            ref={ref}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of parcel delivery with our cutting-edge
              services
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group h-[280px]"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
                <div className="relative h-full p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
                  <div>
                    <div
                      className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6 text-2xl text-white`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
