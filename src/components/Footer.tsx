import React from "react";

// Footer global du site Sycelim Delivery
// Affiche le copyright et des liens utiles
const Footer = () => {
  return (
    <footer className="w-full bg-orange-100 text-gray-700 py-4 mt-10 shadow-inner">
      {/* Conteneur centré et responsive */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Copyright */}
        <div className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} Sycelim Delivery. Tous droits réservés.
        </div>
        {/* Liens externes */}
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="https://github.com/" className="hover:text-orange-600 transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="mailto:support@sycelim.com" className="hover:text-orange-600 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
