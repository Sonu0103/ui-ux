import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="bg-cyan-400 text-white min-h-screen flex items-center">
      <div className="w-full px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.h1
              className="text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Fast, Reliable and
              <br />
              <span className="text-purple-200">Affordable Parcel</span>
              <br />
              Delivery Services
            </motion.h1>
            <motion.p
              className="text-xl mb-12 text-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              We deliver your parcels Safely and on time
            </motion.p>
            <motion.div
              className="flex gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <button className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg">
                Create Parcel
              </button>
              <button className="bg-purple-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-600 transform hover:scale-105 transition-all shadow-lg">
                Track your Parcel
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animated background elements */}
      <motion.div
        className="absolute right-0 top-1/4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute right-1/4 bottom-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-60"
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </section>
  );
};

export default Hero;
