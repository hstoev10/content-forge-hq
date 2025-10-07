import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Newspaper } from "lucide-react";
import { ArticlesManager } from "@/components/admin/ArticlesManager";
import { TeamManager } from "@/components/admin/TeamManager";
import { AwardsManager } from "@/components/admin/AwardsManager";
import { EventsManager } from "@/components/admin/EventsManager";
import { AboutManager } from "@/components/admin/AboutManager";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .single();

    if (!roles) {
      toast({
        title: "Достъп отказан",
        description: "Нямате администраторски права",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Зареждане...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Newspaper className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-news-gradient bg-clip-text text-transparent">
              Административен панел
            </h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Изход
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="articles">Новини</TabsTrigger>
            <TabsTrigger value="events">Събития</TabsTrigger>
            <TabsTrigger value="team">Екип</TabsTrigger>
            <TabsTrigger value="awards">Награди</TabsTrigger>
            <TabsTrigger value="about">За нас</TabsTrigger>
          </TabsList>
          
          <TabsContent value="articles">
            <ArticlesManager />
          </TabsContent>
          
          <TabsContent value="events">
            <EventsManager />
          </TabsContent>
          
          <TabsContent value="team">
            <TeamManager />
          </TabsContent>
          
          <TabsContent value="awards">
            <AwardsManager />
          </TabsContent>
          
          <TabsContent value="about">
            <AboutManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
