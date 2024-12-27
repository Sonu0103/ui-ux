import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Pricing = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const plans = [
    {
      name: "Standard Delivery",
      price: "NPR.100",
      duration: "3-5 business days",
      features: ["Up to 5kg", "Track & Trace"],
      color: "from-blue-500 to-blue-400",
    },
    {
      name: "Express Delivery",
      price: "NPR.200",
      duration: "1-2 business days",
      features: ["Up to 10kg", "Priority handling"],
      color: "from-blue-500 to-blue-400",
    },
    {
      name: "Same Day Delivery",
      price: "NPR.300",
      duration: "Today",
      features: ["Up to 15kg", "Express handling"],
      color: "from-blue-500 to-blue-400",
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
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className="min-h-screen flex items-center py-20 bg-white"
      id="pricing"
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
              Simple and Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your delivery needs
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
              >
                <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div
                    className={`bg-gradient-to-r ${plan.color} w-16 h-16 rounded-xl mb-6 flex items-center justify-center text-white font-bold text-xl`}
                  >
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-2 text-blue-600">
                    {plan.price}
                  </div>
                  <p className="text-gray-500 mb-8">{plan.duration}</p>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <span className="mr-2 text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 px-6 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-400 transform transition-transform hover:scale-105 hover:shadow-lg`}
                  >
                    Choose Plan
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
