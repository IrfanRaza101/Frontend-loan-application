import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube 
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">LoanPortal</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Your trusted partner for all financial needs. We provide fast, secure, and transparent lending solutions with competitive rates and excellent customer service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/apply" className="text-slate-300 hover:text-primary transition-colors">
                  Apply for Loan
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-300 hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Loan Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Loan Services</h4>
            <ul className="space-y-2">
              <li className="text-slate-300">Home Loans</li>
              <li className="text-slate-300">Personal Loans</li>
              <li className="text-slate-300">Auto Loans</li>
              <li className="text-slate-300">Education Loans</li>
              <li className="text-slate-300">Business Loans</li>
              <li className="text-slate-300">Debt Consolidation</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="text-slate-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="text-slate-300">info@loanportal.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-slate-300">
                  123 Financial Street<br />
                  New York, NY 10001<br />
                  United States
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © 2024 LoanPortal. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;