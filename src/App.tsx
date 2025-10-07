import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import News from "./pages/News";
import Events from "./pages/Events";
import Team from "./pages/Team";
import Awards from "./pages/Awards";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/awards" element={<Awards />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
