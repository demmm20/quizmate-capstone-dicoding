import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 opacity-95">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">LearnCheck</h3>
            <p className="text-sm">
              Platform pembelajaran AI interaktif dengan quiz dan feedback
              personal.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Tautan</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Tentang
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Ikuti Kami</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {currentYear} LearnCheck. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
