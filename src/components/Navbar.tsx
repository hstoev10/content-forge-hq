import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Newspaper } from "lucide-react";
import { Button } from "./ui/button";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Начало", path: "/" },
    { name: "Новини", path: "/news" },
    { name: "Събития", path: "/events" },
    { name: "Екип", path: "/team" },
    { name: "Награди", path: "/awards" },
    { name: "За нас", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Newspaper className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-news-gradient bg-clip-text text-transparent">
              Новини БГ
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="transition-all"
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            <Link to="/auth">
              <Button variant="outline" className="ml-4">
                Вход
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
              >
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            <Link to="/auth" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full">
                Вход
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
