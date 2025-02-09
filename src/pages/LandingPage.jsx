import logo from '../assets/landingLogo.png';
import aboutlogo from '../assets/Logo.png';
import bg from '../assets/BackgroundImage.png'
import abao from '../assets/members/abao.png'
import acuisa from '../assets/members/acuisa.png'
import cleo from '../assets/members/cleo.png'
import dayrit from '../assets/members/dayrit.png'
import flores from '../assets/members/flores.png'
import libiran from '../assets/members/libiran.png'
import navarro from '../assets/members/navarro.png'
import trias from '../assets/members/trias.png' 
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../styles.css';

export default function LandingPage() {
  return (
    <div id="home" className="min-h-screen bg-white font-sans">
      {/* Header - No Changes */}
      <header className="w-full bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-2 flex justify-between items-center">
          <img className="h-14" src={logo} alt="LocalLingua Logo" />
          <nav>
            <ul className="flex space-x-12 items-center">

            <li>
                <a href="#home" className="text-[#002D70] text-lg font-medium border-b-2 border-transparent hover:font-semibold hover:border-[#FFD200] transition-all">
                Home
                </a>
            </li>
            <li>
                <a href="#about" className="text-[#002D70] text-lg font-medium border-b-2 border-transparent hover:font-semibold hover:border-[#FFD200] transition-all">
                About
                </a>
            </li>
            <li>
                <a href="#our-team" className="text-[#002D70] text-lg font-medium border-b-2 border-transparent hover:font-semibold hover:border-[#FFD200] transition-all">
                Our Team
                </a>
            </li>

            </ul>
          </nav>
          <button className="px-6 py-2 rounded-full bg-[#C0001A] text-white font-bold hover:bg-[#A00016] transition-all" onClick={() => window.location.href='/login'}>
            Book Now
          </button>
        </div>
      </header>

      {/* Hero Section - No Changes */}
      <section className="relative h-[675px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('https://gttp.images.tshiftcdn.com/311097/x/0/')` }}>
        <div className="w-full h-full absolute top-0 left-0 bg-black opacity-60 z-10"></div>
        <div className="text-center z-20">
          <h1 className="tagline text-4xl md:text-6xl font-[Barbara] leading-tight uppercase mb-6">
            “Explore with a local, like a local <br /> through local lingua”
          </h1>
          <button className="px-8 py-3 rounded-full bg-[#FFD200] text-[#002D70] font-bold hover:bg-[#D4A600] transition-all" onClick={() => window.location.href='/signup'}>
            Start Your Journey
          </button>
        </div>
      </section>

      {/* About Us - Modernized */}
      <section className="py-20 bg-gray-100 text-center" id="about">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center md:space-x-12">
          <img src={aboutlogo} alt="About Us" className="w-full md:w-1/2 rounded-xl shadow-lg" />
          <div className="text-gray-700 text-center md:text-left max-w-3xl mx-auto leading-relaxed p-6">
            <h2 className="text-4xl font-bold text-[#002D70] mb-6">About Us</h2>
            <p className="mb-6">
                Local Lingua, created by passionate third-year Tourism students at National University Baliwag. The website is designed for travelers who seek a deeper cultural experience through language. Our service not only provides foundational language skills through real-life interactions with native speakers but also offers—a specialized option for tourists who want a tour guide who can translate and serve as their driver. With features like conversational practice integrated into each itinerary, we make language learning an enjoyable and immersive part of every journey. By blending culture and communication, we empower travelers to navigate their destinations with confidence while fostering authentic connections with local communities. 
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="text-[#0043A8] text-3xl hover:text-[#ED1C24] transition-all">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 bg-[#002D70] text-white text-center" id="our-team">
      <h2 className="text-4xl font-bold mb-12">Meet the Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
        {[
          { name: 'Lovely Mae Abao', role: 'Member', img: abao },
          { name: 'Em Joy Acuisa', role: 'Member', img: acuisa },
          { name: 'Nicole Cleo', role: 'Member', img: cleo },
          { name: 'Jos Anne Dayrit', role: 'Member', img: dayrit },
          { name: 'Cherrilyn Flores', role: 'Member', img: flores },
          { name: 'Catalina Libiran', role: 'Member', img: libiran },
          { name: 'Allyza Navarro', role: 'Member', img: navarro },
          { name: 'Bernadette Trias', role: 'Member', img: trias },
        ].map((member, index) => (
          <div key={index} className="flex flex-col items-center">
            <img src={member.img} alt={member.name} className="w-36 h-36 rounded-2xl overflow-hidden shadow-lg mb-4" />
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-[#FFD200] text-sm">{member.role}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Call to Action - Modernized */}
    <section className="relative w-full py-20 text-white text-center">
        <div className="cta absolute top-0 left-0 w-full h-full object-cover z-0 bg-repeat" alt="" />
        <div className=" container relative mx-auto px-6 z-20">
            <h2 className="cta_text text-5xl uppercase mb-6">Discover the Wonders of Bulacan</h2>
            <p className=" text-xl max-w-3xl  mx-auto mb-6">
                Experience history, culture, and scenic beauty through expert-guided local tours designed for immersive and unforgettable adventures.
            </p>
            <button className="px-10 py-3 rounded-full bg-[#FFD200] text-[#002D70] font-bold hover:bg-[#D4A600] transition-all" onClick={() => window.location.href='/signup'}>
                Start Your Journey Now
            </button>
        </div>
    </section>


      {/* Footer - Modernized */}
      <footer className="bg-[#1A1A1A] text-gray-300 py-12 text-center">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2025 LocalLingua. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, i) => (
              <a key={i} href="#" className="text-gray-300 hover:text-[#FFD200] transition-all text-2xl">
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
