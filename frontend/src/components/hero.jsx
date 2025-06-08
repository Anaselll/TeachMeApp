import { motion } from "framer-motion";
import lamp from "../assets/lamp.svg";
import star from "../assets/star.png";

const text =
  "Join Teach Me and connect with experts, enhance your skills, and unlock endless learning opportunities in a collaborative environment.";

const TypingEffect = ({ text }) => {
  return (
    <motion.p
      className="text-white text-sm md:text-base mt-4 max-w-xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 }, // Start opacity from 0
        visible: {
          opacity: 1, // Fade in to opacity 1
          transition: {
            staggerChildren: 0.05, // Speed of typing effect
          },
        },
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 }, // Each character starts from opacity 0
            visible: { opacity: 1 }, // Fade each character to opacity 1
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};

const Hero = () => {
  return (
    <section className="text-center bottom-5 pt-12 b-15 pb-8 relative overflow-hidden">
      {/* Static star background element */}
      <div
        className="absolute top-10 left-[59%] transform -translate-x-1/2 -z-10"
        style={{
          zIndex:5,
          backgroundImage: `url(${star})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "150px",
          height: "150px",
          rotate:"45deg"
        }}
      />

      {/* Floating lamp */}
      <motion.img
        src={lamp}
        width="90"
        height="90"
        className="absolute ml-15 rotate-[-45deg]"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles effect */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#A7E629] bg-opacity-20"
          style={{
            width: Math.random() * 20 + 10 + "px",
            height: Math.random() * 20 + 10 + "px",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: 1,
            y: -100,
          }}
          transition={{
            y: {
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 2.5,
            },
            opacity: {
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 2.5,
            },
          }}
        />
      ))}

      {/* Hero content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Empower Your Learning, Anytime, Anywhere.
        </motion.h1>

        {/* Typing effect paragraph */}
        <TypingEffect text={text} />

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            type="button"
            className="bg-[#A7E629] px-8 py-3 rounded-xl text-[#191A2C] font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Get started
          </motion.button>

          <motion.span
            className="ml-5 text-white font-bold italic inline-block"
            whileHover={{ scale: 1.05, x: 3 }}
          >
            Try it for free
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
