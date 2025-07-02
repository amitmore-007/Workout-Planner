import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import PropTypes from "prop-types";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// Import icons
import { 
  ChevronDown, Dumbbell, Users, Award, Clock, ArrowRight, Zap, Heart, 
  Camera, MessageCircle, ChefHat, Video, Scan, Bot, Play, Star,
  Target, TrendingUp, Shield, Sparkles, Flame, CheckCircle
} from "lucide-react";

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const [currentSection, setCurrentSection] = useState(0);
  const sections = ["home", "features", "services", "pricing", "testimonials", "contact"];
  
  // Optimized parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Optimized scroll handler
  const scrollToSection = useCallback((index) => {
    const element = document.getElementById(sections[index]);
    element?.scrollIntoView({ behavior: "smooth" });
  }, [sections]);

  // Section tracking with Intersection Observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-10% 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = sections.indexOf(entry.target.id);
          if (sectionIndex !== -1) {
            setCurrentSection(sectionIndex);
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="relative bg-black text-white overflow-hidden">
      <Navbar />
      
      {/* Optimized Background - Reduced particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-red-900/20" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {sections.map((section, index) => (
          <motion.div
            key={section}
            className="cursor-pointer group"
            onClick={() => scrollToSection(index)}
          >
            <motion.div 
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                currentSection === index ? 'bg-red-500 border-red-500 scale-125' : 'border-white/50 hover:border-red-500'
              }`}
            />
            <motion.span 
              className="absolute right-6 top-0 text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ whiteSpace: 'nowrap' }}
            >
              {section}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Hero Section with Image */}
      <motion.section
        id="home"
        className="min-h-screen relative flex items-center justify-center overflow-hidden"
        style={{ y }}
      >
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/photo1.avif" 
            alt="Fitness Hero" 
            className="w-full h-full object-cover opacity-40"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, #ff006e15 0%, transparent 60%)",
                "radial-gradient(circle at 80% 20%, #8338ec15 0%, transparent 60%)",
                "radial-gradient(circle at 40% 40%, #ff006e15 0%, transparent 60%)",
              ]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
        
        <div className="relative z-10 text-center px-8 max-w-6xl mx-auto">
          {/* Optimized Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
              style={{ 
                backgroundSize: "200% 200%",
                animation: "gradient 4s ease infinite"
              }}
            >
              FITFORGE
            </motion.h1>
            <motion.div 
              className="text-2xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Your AI-Powered Fitness Universe
            </motion.div>
            <motion.p 
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Transform your body and mind with personalized workouts, nutrition plans, 
              AI-powered food scanning, recipe generation, and live training sessions.
            </motion.p>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {[
              { icon: <Dumbbell />, text: "AI Workouts" },
              { icon: <Scan />, text: "Food Scanner" },
              { icon: <ChefHat />, text: "Recipe AI" },
              { icon: <Video />, text: "Live Training" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-red-500 mb-2 flex justify-center">
                  {item.icon}
                </div>
                <p className="text-sm font-semibold">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-purple-600 rounded-full font-bold text-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative flex items-center gap-2">
                Start Your Journey <Sparkles size={20} />
              </span>
            </motion.button>
            
            <motion.button
              className="px-8 py-4 border-2 border-white/30 rounded-full font-bold text-lg backdrop-blur-sm hover:border-red-500 hover:bg-red-500/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <Play size={20} /> Watch Demo
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={() => scrollToSection(1)}
        >
          <ChevronDown size={32} className="text-white/70" />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="min-h-screen py-20 relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="/photo3.avif" 
            alt="About Us" 
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        </div>
        <div className="relative z-10">
          <FeatureShowcase />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="min-h-screen py-20 relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="/photo2.avif" 
            alt="Services" 
            className="w-full h-full object-cover opacity-30"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-purple-900/50 to-black/90" />
        </div>
        <div className="relative z-10">
          <ServicesGrid />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="min-h-screen py-20 relative bg-black">
        <PricingCards />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="min-h-screen py-20 relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="/photo4.avif" 
            alt="Testimonials" 
            className="w-full h-full object-cover opacity-25"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-red-900/40 to-black/90" />
        </div>
        <div className="relative z-10">
          <TestimonialCarousel />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-20 relative bg-black">
        <ContactSection />
      </section>

      <Footer />
      
      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

// Optimized Feature Showcase Component
const FeatureShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: <Target className="w-12 h-12" />,
      title: "AI-Powered Workouts",
      description: "Personalized training programs that adapt to your progress",
      color: "from-red-500 to-pink-500",
      delay: 0.1
    },
    {
      icon: <Scan className="w-12 h-12" />,
      title: "Smart Food Scanner",
      description: "Instant nutrition analysis with camera-based food recognition",
      color: "from-blue-500 to-cyan-500",
      delay: 0.2
    },
    {
      icon: <ChefHat className="w-12 h-12" />,
      title: "Recipe Generator",
      description: "AI creates healthy recipes from your available ingredients",
      color: "from-green-500 to-emerald-500",
      delay: 0.3
    },
    {
      icon: <Bot className="w-12 h-12" />,
      title: "Fitness Chatbot",
      description: "24/7 AI assistant for fitness and nutrition guidance",
      color: "from-purple-500 to-violet-500",
      delay: 0.4
    },
    {
      icon: <Video className="w-12 h-12" />,
      title: "Live Training",
      description: "Connect with trainers and community through video sessions",
      color: "from-orange-500 to-red-500",
      delay: 0.5
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Progress Tracking",
      description: "Advanced analytics to monitor your transformation journey",
      color: "from-indigo-500 to-blue-500",
      delay: 0.6
    }
  ];

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
          Revolutionary Features
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Experience the future of fitness with our cutting-edge AI technology
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="group relative"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: feature.delay }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 h-full overflow-hidden hover:bg-white/15 transition-all duration-300">
              <div className={`text-transparent bg-gradient-to-br ${feature.color} bg-clip-text mb-6`}>
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              
              {/* Simplified hover effect */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Optimized Services Grid Component
const ServicesGrid = () => {
  const services = [
    {
      title: "For Users",
      description: "Complete fitness ecosystem for your personal transformation",
      features: ["Personalized Workouts", "Nutrition Tracking", "AI Food Scanner", "Recipe Generator"],
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-600 to-purple-600"
    },
    {
      title: "For Creators",
      description: "Build and monetize your fitness content with powerful tools",
      features: ["Content Creation Tools", "Monetization Options", "Analytics Dashboard", "Community Building"],
      icon: <Sparkles className="w-8 h-8" />,
      color: "from-green-600 to-blue-600"
    },
    {
      title: "For Admins",
      description: "Complete platform management and oversight capabilities",
      features: ["User Management", "Content Moderation", "Analytics", "System Controls"],
      icon: <Shield className="w-8 h-8" />,
      color: "from-red-600 to-pink-600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-5xl font-black mb-6 text-white">Three Powerful Roles</h2>
        <p className="text-xl text-gray-300">Choose your path in the fitness ecosystem</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            className="group relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{ y: -5 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
            <div className="relative bg-black/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 h-full">
              <div className={`text-transparent bg-gradient-to-br ${service.color} bg-clip-text mb-4`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">{service.title}</h3>
              <p className="text-gray-300 mb-6">{service.description}</p>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Pricing Cards Component
const PricingCards = () => {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for fitness beginners",
      features: ["Basic Workouts", "Nutrition Tracking", "Food Scanner", "Community Access"],
      color: "from-blue-500 to-purple-500",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month", 
      description: "For serious fitness enthusiasts",
      features: ["All Starter Features", "AI Recipe Generator", "Live Training Sessions", "Priority Support"],
      color: "from-red-500 to-pink-500",
      popular: true
    },
    {
      name: "Elite",
      price: "$39",
      period: "/month",
      description: "Ultimate fitness transformation",
      features: ["All Pro Features", "1-on-1 Coaching", "Custom Meal Plans", "Advanced Analytics"],
      color: "from-green-500 to-emerald-500",
      popular: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-5xl font-black mb-6 text-white">Choose Your Plan</h2>
        <p className="text-xl text-gray-300">Start your transformation today</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className={`relative group ${plan.popular ? 'scale-105' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{ scale: plan.popular ? 1.05 : 1.05 }}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                Most Popular
              </div>
            )}
            
            <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
            <div className="relative bg-black/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 h-full">
              <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>
              <p className="text-gray-300 mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <motion.button
                className={`w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r ${plan.color} text-white`}>
                Get Started
              </motion.button>
            </div>
          </motion.div>
          
        ))}
      </div>
    </div>
  );
};

// Testimonial Carousel Component
const TestimonialCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      avatar: "/api/placeholder/80/80",
      text: "FitForge completely transformed my approach to fitness. The AI recommendations are spot-on!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Personal Trainer", 
      avatar: "/api/placeholder/80/80",
      text: "As a creator, the monetization tools and analytics have helped me grow my fitness business exponentially.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Nutritionist",
      avatar: "/api/placeholder/80/80", 
      text: "The food scanner and recipe generator are game-changers for my clients' nutrition tracking.",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
      >
        <h2 className="text-5xl font-black mb-6">What Our Community Says</h2>
      </motion.div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center"
          >
            <div className="flex justify-center mb-4">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
              ))}
            </div>
            <p className="text-xl mb-8 italic">&ldquo;{testimonials[activeIndex].text}&rdquo;</p>
            <div className="flex items-center justify-center gap-4">
              <img 
                src={testimonials[activeIndex].avatar} 
                alt={testimonials[activeIndex].name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h4 className="font-bold">{testimonials[activeIndex].name}</h4>
                <p className="text-gray-400">{testimonials[activeIndex].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                activeIndex === index ? 'bg-red-500' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Contact Section Component
const ContactSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
      >
        <h2 className="text-5xl font-black mb-6">Ready to Transform?</h2>
        <p className="text-xl text-gray-300">Join thousands who have already started their journey</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
       <motion.div
  initial={{ opacity: 0, x: -50 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: false }}
  className="space-y-8"
>
  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
    <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
    <div className="space-y-4">
      {[
        { icon: <MessageCircle />, text: "support@fitforge.com" },
        { icon: <Video />, text: "Book a Demo Call" },
        { icon: <Users />, text: "Join Our Community" }
      ].map((item, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-red-500">{item.icon}</div>
          <span>{item.text}</span>
        </motion.div>
      ))}
    </div>
  </div>
</motion.div>


        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="First Name"
                className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <textarea
              placeholder="Tell us about your fitness goals..."
              rows={4}
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl py-4 font-bold text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Journey
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

// PropTypes
FeatureShowcase.propTypes = {};
ServicesGrid.propTypes = {};
PricingCards.propTypes = {};
TestimonialCarousel.propTypes = {};
ContactSection.propTypes = {};

export default LandingPage;