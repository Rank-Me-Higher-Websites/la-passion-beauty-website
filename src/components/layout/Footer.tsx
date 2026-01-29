import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <span className="font-serif text-2xl font-semibold">La Passion</span>
              <p className="text-xs tracking-[0.2em] uppercase text-primary-foreground/60 mt-1">
                Beauty Salon
              </p>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Elevating beauty in Chicago. Expert hair care, nourishing treatments, and flawless 
              permanent makeup — all in one luxurious beauty salon experience.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Our Services", path: "/services" },
                { name: "Pricing", path: "/pricing" },
                { name: "Contact Us", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-primary-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Our Services</h4>
            <nav className="flex flex-col gap-3">
              {[
                "Hair Styling",
                "Hair Coloring",
                "Hair Extensions",
                "Hair Treatments",
                "Permanent Makeup",
              ].map((service) => (
                <Link
                  key={service}
                  to="/services"
                  className="text-primary-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {service}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <a
                href="tel:+13313188113"
                className="flex items-start gap-3 text-primary-foreground/70 hover:text-primary transition-colors group"
              >
                <Phone className="h-5 w-5 mt-0.5 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-medium text-primary-foreground">+1 331-318-8113</p>
                </div>
              </a>
              <a
                href="mailto:info@lapassionbeautysalon.com"
                className="flex items-start gap-3 text-primary-foreground/70 hover:text-primary transition-colors group"
              >
                <Mail className="h-5 w-5 mt-0.5 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm">info@lapassionbeautysalon.com</p>
                </div>
              </a>
              <a
                href="https://maps.app.goo.gl/rz34qNsMxhEowymC8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-primary-foreground/70 hover:text-primary transition-colors group"
              >
                <MapPin className="h-5 w-5 mt-0.5 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm">Lemont, IL</p>
                </div>
              </a>
              <div className="flex items-start gap-3 text-primary-foreground/70">
                <Clock className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <p className="text-sm">Mon - Sat: 9AM - 7PM</p>
                  <p className="text-sm">Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/50 text-center md:text-left">
              © {currentYear} La Passion Beauty Salon. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-primary-foreground/50">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
