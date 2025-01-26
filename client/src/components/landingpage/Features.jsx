import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Features = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const features = [
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Quick and efficient delivery service across Nepal",
      color: "bg-blue-800",
      iconBg: "bg-yellow-500",
    },
    {
      icon: "📱",
      title: "Real Time Tracking",
      description: "Track your parcels location with live updates",
      color: "bg-green-800",
      iconBg: "bg-orange-500",
    },
    {
      icon: "💰",
      title: "Affordable Pricing",
      description: "Best rates guaranteed for all delivery needs",
      color: "bg-blue-800",
      iconBg: "bg-yellow-500",
    },
    {
      icon: "🛡️",
      title: "Secure Handling",
      description: "Your parcels safety is our top priority",
      color: "bg-green-800",
      iconBg: "bg-orange-500",
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
    <section className="py-20 bg-gray-50" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          ref={ref}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Why Choose <span className="text-blue-800">NepXpress</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of parcel delivery with our innovative
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
            <motion.div key={index} variants={itemVariants} className="group">
              <div
                className={`relative rounded-xl p-6 ${feature.color} transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl`}
              >
                {/* Icon Container */}
                <div
                  className={`${feature.iconBg} w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6 transform transition-transform group-hover:scale-110 shadow-lg`}
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-white/90">{feature.description}</p>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-white/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 -mb-2 -ml-2 w-20 h-20 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-500 text-gray-900 font-semibold text-sm">
            🌟 Trusted by 1000+ customers across Nepal
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
