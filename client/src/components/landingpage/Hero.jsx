import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/images/delivery1.jpg",
      title: "Fast & Reliable",
      subtitle: "Courier Service",
      description:
        "Experience seamless delivery solutions with our nationwide network.",
    },
    {
      image: "/images/delivery2.jpg",
      title: "Track Your Parcels",
      subtitle: "Real-Time Updates",
      description:
        "Stay informed with real-time tracking and instant notifications.",
    },
    {
      image: "/images/delivery3.jpg",
      title: "Nationwide Coverage",
      subtitle: "Express Delivery",
      description: "Reaching every corner of Nepal with speed and reliability.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div
      id="hero"
      className="relative min-h-screen bg-gradient-to-r from-blue-600 to-green-500 overflow-hidden"
    >
      {/* Carousel */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {slides[currentSlide].title}
                <br />
                <span className="text-yellow-300">
                  {slides[currentSlide].subtitle}
                </span>
                <br />
                in Nepal
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                {slides[currentSlide].description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/signup"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  Get Started
                </Link>
                <Link
                  to="/pricing"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-8 mt-12 md:mt-0">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-2">24/7</h3>
                <p className="text-white/80">Support</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-2">98%</h3>
                <p className="text-white/80">On-time Delivery</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-2">1000+</h3>
                <p className="text-white/80">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? "bg-yellow-300" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white hover:text-yellow-300 transition-colors"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white hover:text-yellow-300 transition-colors"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default Hero;
