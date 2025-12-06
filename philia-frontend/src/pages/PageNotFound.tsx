import { Link } from "react-router-dom";
import Logo from "../assets/philia-dark-logo.png";
import { motion } from "framer-motion";

export default function PageNotFound() {
  return (
    <div className="h-[500px] mt-10 relative bottom-10 flex flex-col items-center justify-center  text-white p-6 overflow-hidden">
      <motion.img
        src={Logo}
        alt="philia-logo"
        className="w-40 mb-8 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />

      <motion.h1
        className="text-6xl font-bold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        404
      </motion.h1>

      <motion.p
        className="text-gray-300 text-lg max-w-md text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Oops! The page you're looking for doesn't exist. It may have been moved,
        deleted, or never existed in the first place.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition shadow-lg"
        >
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}
