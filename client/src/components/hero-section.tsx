export default function HeroSection() {
  const scrollToBooking = () => {
    const element = document.getElementById("booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen">
      {/* Hero background image - looking for common room-IMG_0083-HDR, fallback to terrace */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Unforgettable Escape<br />
            <span className="text-3xl md:text-5xl">in Verőce Hills</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            Mesmerizing panoramic views • Up to 11 guests • Perfect for retreats
          </p>
          <button 
            onClick={scrollToBooking}
            className="bg-airbnb-red hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            data-testid="hero-book-now"
          >
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
}
