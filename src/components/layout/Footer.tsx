import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-custom py-8 md:py-12 px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4">
              <img 
                src={logo} 
                alt="La Passion Beauty Salon" 
                className="h-14 md:h-20 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-primary-foreground/70 text-xs md:text-sm leading-relaxed mb-4">
              Elevating beauty in Chicago. Expert haircuts, stunning color, and premium 
              extensions — all in one luxurious beauty salon experience.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-sm md:text-lg font-semibold mb-3 md:mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-2 md:gap-3">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Our Services", path: "/services" },
                { name: "Book Now", path: "/booking" },
                { name: "Contact Us", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-primary-foreground/70 hover:text-primary transition-colors text-xs md:text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-serif text-sm md:text-lg font-semibold mb-3 md:mb-6">Contact Us</h4>
            <div className="space-y-3 md:space-y-4">
              <a
                href="tel:+13313188113"
                className="flex items-center gap-2 md:gap-3 text-primary-foreground/70 hover:text-primary transition-colors group"
              >
                <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary group-hover:scale-110 transition-transform shrink-0" />
                <p className="text-xs md:text-sm font-medium text-primary-foreground">+1 331-318-8113</p>
              </a>
              <a
                href="mailto:info@lapassionbeautysalon.com"
                className="flex items-center gap-2 md:gap-3 text-primary-foreground/70 hover:text-primary transition-colors group"
              >
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary group-hover:scale-110 transition-transform shrink-0" />
                <p className="text-xs md:text-sm break-all">info@lapassion.com</p>
              </a>
              <a
                href="https://maps.app.goo.gl/rz34qNsMxhEowymC8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 md:gap-3 text-primary-foreground/70 hover:text-primary transition-colors group"
              >
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary group-hover:scale-110 transition-transform shrink-0" />
                <p className="text-xs md:text-sm">Lemont, IL</p>
              </a>
              <div className="flex items-center gap-2 md:gap-3 text-primary-foreground/70">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs md:text-sm">Mon - Sat: 9AM - 7PM</p>
                  <p className="text-xs md:text-sm">Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-4 md:py-6 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <p className="text-xs md:text-sm text-primary-foreground/50 text-center md:text-left">
              © {currentYear} La Passion Beauty Salon
            </p>
            <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-primary-foreground/50">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link to="/admin" className="hover:text-primary transition-colors">
                Staff
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
