import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo-cropped.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-primary shadow-soft py-1.5 md:py-3"
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="La Passion Beauty Salon" 
              className="h-10 md:h-16 w-auto brightness-0 invert contrast-200"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors relative py-2",
                  isActive(link.path)
                    ? "text-white"
                    : "text-white/80 hover:text-white",
                  "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-white after:transition-all after:duration-300",
                  isActive(link.path) ? "after:w-full" : "after:w-0 hover:after:w-full"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Button size="lg" asChild className="bg-white text-primary border-2 border-white hover:bg-white/90 font-semibold">
              <a href="tel:+13313188113">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </a>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8 pt-2">
                    <img 
                      src={logo} 
                      alt="La Passion Beauty Salon" 
                      className="h-16 w-auto"
                    />
                  </div>
                  
                  <nav className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                          isActive(link.path)
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto pb-8">
                    <Button variant="gold" size="lg" className="w-full" asChild>
                      <a href="tel:+13313188113">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
