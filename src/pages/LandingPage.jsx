import logo from '../assets/logo.png';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <span>
              <img className="h-16" src={logo} alt="TravelEase Logo" />
          </span>
          <nav>
            <ul className="flex space-x-6 items-center">
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                  Packages
                </a>
              </li>
              <li>
                <button className="cursor-pointer px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-300">Book Now</button>              
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px]">
        <img className="w-full h-full object-center object-cover brightness-75" src="https://gttp.images.tshiftcdn.com/311097/x/0/" alt="Hero Image" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center">“Explore with a local, like a local <br /> through LOCAL LINGUA”</h1>
          <button className="cursor-pointer px-8 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-300">Start Your Journey</button>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-semibold mb-12 text-center">Featured Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {["Paris", "Tokyo", "New York"].map((city, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                <img src="https://placehold.co/600x400" alt={`${city} Image`} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">{city}</h3>
                  <p className="text-gray-700 mb-6">
                    Experience the magic of {city} with our exclusive travel packages.
                  </p>
                  <button className="cursor-pointer w-full text-center px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-300">Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-semibold mb-12 text-center">About Us</h2>
          <div className="flex flex-col md:flex-row items-center md:space-x-12">
            <img src="https://placehold.co/400x300" alt="About Us Image" className="w-full md:w-1/2 rounded-lg shadow-lg mb-8 md:mb-0" />
            <div className="text-gray-700 text-center md:text-left max-w-3xl mx-auto leading-relaxed">
              <p className="mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="mb-6">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="#" className="text-blue-600 hover:text-blue-800 transition duration-300">
                  <FaFacebookF />
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-800 transition duration-300">
                  <FaTwitter />
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-800 transition duration-300">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-semibold mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-10">Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
          <button className="cursor-pointer px-8 py-3 rounded-full bg-white text-blue-600 hover:bg-gray-100 transition duration-300">Sign Up Now</button>        
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">About TravelEase</h3>
              <p className="text-gray-400 leading-relaxed">
                We're passionate about helping you discover the world's most amazing destinations.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                    Destinations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Follow Us</h3>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <FaFacebookF />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <FaTwitter />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-12 border-t border-gray-700 text-center">
            <p className="text-gray-400">&copy; 2023 TravelEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

