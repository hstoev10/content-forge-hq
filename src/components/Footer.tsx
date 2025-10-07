import { Link } from "react-router-dom";
import { Newspaper, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary p-2 rounded-lg">
                <Newspaper className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Новини БГ</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Вашият надежден източник на актуална информация
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/news" className="text-muted-foreground hover:text-primary transition-colors">
                  Новини
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors">
                  Събития
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-muted-foreground hover:text-primary transition-colors">
                  Екип
                </Link>
              </li>
              <li>
                <Link to="/awards" className="text-muted-foreground hover:text-primary transition-colors">
                  Награди
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Информация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  За нас
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Администрация
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Контакти</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@novini-bg.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+359 2 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>София, България</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Новини БГ. Всички права запазени.</p>
        </div>
      </div>
    </footer>
  );
};
