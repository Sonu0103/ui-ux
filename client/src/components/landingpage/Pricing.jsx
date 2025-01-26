import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Pricing = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const plans = [
    {
      name: "Standard",
      tagline: "For small packages",
      price: "150",
      duration: "3-5 business days",
      color: "bg-blue-800",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
      popular: false,
      features: [
        { text: "Up to 5kg weight", included: true },
        { text: "Real-time tracking", included: true },
        { text: "Basic insurance coverage", included: true },
        { text: "Door-to-door delivery", included: true },
        { text: "SMS notifications", included: true },
        { text: "Priority support", included: false },
      ],
    },
    {
      name: "Express",
      tagline: "Most Popular",
      price: "300",
      duration: "1-2 business days",
      color: "bg-green-800",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
      popular: true,
      features: [
        { text: "Up to 10kg weight", included: true },
        { text: "Real-time tracking", included: true },
        { text: "Enhanced insurance coverage", included: true },
        { text: "Door-to-door delivery", included: true },
        { text: "SMS & Email notifications", included: true },
        { text: "Priority support", included: true },
      ],
    },
    {
      name: "Premium",
      tagline: "Same day delivery",
      price: "500",
      duration: "Within 12 hours",
      color: "bg-blue-800",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
      popular: false,
      features: [
        { text: "Up to 20kg weight", included: true },
        { text: "Real-time tracking", included: true },
        { text: "Premium insurance coverage", included: true },
        { text: "Door-to-door delivery", included: true },
        { text: "Priority notifications", included: true },
        { text: "24/7 VIP support", included: true },
      ],
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
    <section className="py-20 bg-gray-50" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Simple & Transparent <span className="text-blue-800">Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect delivery plan that suits your needs
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative group ${
                plan.popular ? "md:-mt-4 md:mb-4" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className={`relative rounded-2xl overflow-hidden ${plan.color} transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
              >
                {/* Header */}
                <div className="p-8 text-center text-white">
                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-white/80 mb-6">{plan.tagline}</p>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-lg">NPR</span>
                    <span className="text-5xl font-bold mx-2">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm">{plan.duration}</p>
                </div>

                {/* Features */}
                <div className="bg-white p-8 rounded-t-3xl">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span
                          className={`mr-2 ${
                            feature.included ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {feature.included ? "✓" : "×"}
                        </span>
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-4 px-6 rounded-xl text-center font-semibold transition-colors ${
                      plan.buttonColor
                    } ${plan.popular ? "text-white" : "text-gray-900"}`}
                  >
                    Choose {plan.name}
                  </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-white/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 -mb-2 -ml-2 w-20 h-20 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">
            All plans include basic features like real-time tracking and
            door-to-door delivery
          </p>
          <div className="flex justify-center space-x-4">
            <span className="inline-flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              Secure Payments
            </span>
            <span className="inline-flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
              24/7 Support
            </span>
            <span className="inline-flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Money Back Guarantee
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
