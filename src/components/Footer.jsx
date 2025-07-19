import { FaTwitter, FaDiscord, FaGithub, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer({ userType }) {
  return (
    <motion.footer
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.6, ease: "backInOut" }}
  className="bg-surface text-textPrimary py-10 px-6 md:px-12"
>
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* App Info Section */}
      <div>
        <Link to="/" className="text-2xl font-bold text-primary">
          Youtube Karaoke
        </Link>
        <p className="mt-2 text-textSecondary">
          Sing your heart out with Youtube Karaoke — the easiest way to enjoy karaoke from your favorite YouTube videos. No downloads, no fuss — just pick a song and start singing!
        </p>
      </div>

      {/* Social Links */}
      <div className="md:flex md:items-end md:flex-col">
        <h4 className="text-lg font-semibold text-primary mb-3">Connect With Me</h4>
        <div className="flex space-x-4">
          <a href="https://www.facebook.com/johncarlcastrocueva/" target="_blank" rel="noreferrer" className="text-textSecondary hover:text-primary text-xl">
            <FaFacebook />
          </a>
          <a href="https://x.com/johncarlcueva_" target="_blank" rel="noreferrer" className="text-textSecondary hover:text-primary text-xl">
            <FaTwitter />
          </a>
          <a href="https://github.com/Fromundus" target="_blank" rel="noreferrer" className="text-textSecondary hover:text-primary text-xl">
            <FaGithub />
          </a>
        </div>
      </div>
    </div>

  {/* Footer Bottom */}
  <div className="text-sm text-textSecondary text-center mt-10 border-t border-border pt-6">
    &copy; {new Date().getFullYear()} Youtube Karaoke. All rights reserved. <br />
    Built and maintained by John Carl Cueva.
  </div>
</motion.footer>

  );
}
