import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
// Import logo
import logoImg from "/images/logo.png";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 pt-16 pb-8">
      <div className="container-width">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImg} alt="Logo" className="h-10 w-auto" />
              <span className="font-display text-xl font-bold text-white">
                Rakesh<span className="text-primary">Premium</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your trusted destination for premium superbikes. We offer the best deals on new and pre-owned luxury motorcycles with comprehensive service and support.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.instagram.com/_rakesh_007x?igsh=ZXJ1b3IxcnRzeWdv" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="https://www.facebook.com/people/Rakesh-Rakesh/pfbid02517vV9vV9vV9vV9vV9vV9vV9vV9vV9vV9vV9vV9vV9vV9vV9vV9vV9vV9vV9/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/bikes" className="hover:text-primary transition-colors">All Bikes</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-white font-bold mb-6">Popular Brands</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/bikes?brand=Royal%20Enfield" className="hover:text-primary transition-colors">Royal Enfield</Link></li>
              <li><Link href="/bikes?brand=BMW" className="hover:text-primary transition-colors">BMW Motorrad</Link></li>
              <li><Link href="/bikes?brand=Ducati" className="hover:text-primary transition-colors">Ducati</Link></li>
              <li><Link href="/bikes?brand=Kawasaki" className="hover:text-primary transition-colors">Kawasaki</Link></li>
              <li><Link href="/bikes?brand=Harley-Davidson" className="hover:text-primary transition-colors">Harley-Davidson</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>miryalaguda near round nalgonda dist</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+91 93903 89606</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>rrakesh20235@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Rakesh Premium Bikes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
