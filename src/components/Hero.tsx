import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-news.jpg";

export const Hero = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-hero-gradient bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Вашият източник на новини
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-foreground/80 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
          Актуална информация, експертни анализи и репортажи от България и света
        </p>
        <div className="flex gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
          <Link to="/news">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Последни новини
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline">
              За нас
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
