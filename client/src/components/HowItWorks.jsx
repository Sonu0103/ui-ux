import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const HowItWorks = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const steps = [
    {
      icon: "📝",
      title: "Place Order",
      description: "Fill in delivery details and get instant price quote",
      color: "bg-blue-800",
      iconBg: "bg-yellow-500",
      stepNumber: "01",
    },
    {
      icon: "🚚",
      title: "Pickup Service",
      description: "Our agent collects the parcel from your location",
      color: "bg-green-800",
      iconBg: "bg-orange-500",
      stepNumber: "02",
    },
    {
      icon: "🏢",
      title: "Warehouse Processing",
      description: "Package sorting and route optimization",
      color: "bg-blue-800",
      iconBg: "bg-yellow-500",
      stepNumber: "03",
    },
    {
      icon: "🚗",
      title: "Out for Delivery",
      description: "Last-mile delivery to recipient's address",
      color: "bg-green-800",
      iconBg: "bg-orange-500",
      stepNumber: "04",
    },
    {
      icon: "✅",
      title: "Confirmation",
      description: "Delivery confirmation and e-signature",
      color: "bg-blue-800",
      iconBg: "bg-yellow-500",
      stepNumber: "05",
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
    <section className="py-20 bg-gray-50" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            How <span className="text-blue-800">It Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience our streamlined delivery process from pickup to doorstep
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
              >
                {/* Step Card */}
                <div
                  className={`relative rounded-xl p-6 ${step.color} transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-sm font-bold text-gray-900">
                    {step.stepNumber}
                  </div>

                  {/* Icon */}
                  <div
                    className={`${step.iconBg} w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6 transform transition-transform group-hover:scale-110 shadow-lg`}
                  >
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {step.title}
                  </h3>
                  <p className="text-white/90 text-sm">{step.description}</p>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-white/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 -mb-2 -ml-2 w-20 h-20 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="/signup"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
          >
            Start Shipping Now
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
