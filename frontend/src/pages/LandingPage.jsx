import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  return (
    <div className="landing-container relative">
      <Navbar />

      {/* Landing Page Sections with Fixed Height and No Dividers */}
      <div className="pt-16"> {/* Push content below fixed navbar */}
        {/* Home Section */}
        <Section image="/Home.png" alt="Home" />
        
        {/* About Us Section */}
        <Section image="/About Us.png" alt="About Us" />
        
        {/* Services Section */}
        <Section image="/Services.png" alt="Services" />

           {/* Feature Section */}
           <Section image="/4.png" alt="Feature Section" />
        
        {/* Testimonials Section */}
        <Section image="/Testimonials.png" alt="Testimonials" />
        
     
        
        {/* Contact Section */}
        <Section image="/Contact.png" alt="Contact" />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};


const Section = ({ image, alt }) => {
  return (
    <motion.div
      
      whileInView={{ opacity: 2 }}
     
      viewport={{ once: false, amount: 0.3 }}
      className="h-screen w-full flex justify-center items-center mt--2"
    >
      <img 
        src={image} 
        alt={alt} 
        className="w-full h-screen " 
      />
    </motion.div>
  );
};

/** Add PropTypes Validation */
Section.propTypes = {
  image: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default LandingPage;