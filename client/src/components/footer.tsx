export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-airbnb-dark text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Verőce Hills Guest House</h3>
            <p className="text-gray-300 mb-4">
              An unforgettable escape in the beautiful hills of Verőce, Hungary. 
              Perfect for groups, retreats, and memorable experiences.
            </p>
            <p className="text-sm text-gray-400">Registration: MA24090618</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button 
                  onClick={() => scrollToSection("features")}
                  className="hover:text-white transition-colors"
                  data-testid="footer-features-link"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("gallery")}
                  className="hover:text-white transition-colors"
                  data-testid="footer-gallery-link"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("booking")}
                  className="hover:text-white transition-colors"
                  data-testid="footer-booking-link"
                >
                  Book Now
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Location & Contact</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>📍 Verőce Hills, Hungary</li>
              <li>🚊 35 minutes from Budapest Nyugati</li>
              <li>🚶‍♂️ 10-15 minutes walk from train station</li>
              <li>🚗 Parking for up to 3 cars</li>
              <li>✉️ valeriano.donzelli@gmail.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Verőce Hills Guest House. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
