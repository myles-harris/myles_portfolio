import NavLogo from '@/components/NavLogo';
import Image from 'next/image';
import TickerBorder from './TickerBorder';

export default function Contact() {
  return (
    <>
      <NavLogo />
      <main className="min-h-screen max-w-6xl mx-auto py-16 px-4 text-white font-serif flex flex-col">
        <h1 className="text-4xl mb-8 font-bold tracking-tight text-[#e2c48d] font-[var(--font-cinzel)] italic text-center">Connect With Me</h1>
        
        <div className="flex-grow flex flex-col md:flex-row gap-24 md:gap-48 justify-center items-center mt-24">
          {/* LinkedIn QR Code */}
          <div className="flex flex-col items-center space-y-4">
            <TickerBorder text="LinkedIn">
              <div className="relative w-64 h-64 bg-white p-4 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
                <Image
                  src="/contact/social/linkedin.jpg"
                  alt="LinkedIn QR Code"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </TickerBorder>
            <div className="flex flex-col items-center text-center">
              <p className="text-xl opacity-90">Scan to Connect</p>
              <a 
                href="https://www.linkedin.com/in/myles~harris"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl text-[#e2c48d] hover:underline"
              >
                Myles Harris
              </a>
            </div>
          </div>

          {/* Instagram QR Code */}
          <div className="flex flex-col items-center space-y-4">
            <TickerBorder text="Instagram">
              <div className="relative w-64 h-64 bg-white p-4 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
                <Image
                  src="/contact/social/ig.jpg"
                  alt="Instagram QR Code"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </TickerBorder>
            <div className="flex flex-col items-center text-center">
              <p className="text-xl opacity-90">Scan to Follow</p>
              <p className="text-xl text-[#e2c48d]">@millennium_myles</p>
            </div>
          </div>
        </div>

        <p className="text-xl opacity-80 mt-24 text-center">
          Or send me an email at{' '}
          <a 
            href="mailto:mylesharris18@gmail.com" 
            className="text-[#e2c48d] hover:underline"
          >
            mylesharris18@gmail.com
          </a>
        </p>
      </main>
    </>
  );
}

export const metadata = {
  title: "Contact | Myles Harris",
  description: "Get in touch with Myles Harris",
};