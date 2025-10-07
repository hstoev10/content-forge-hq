import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye } from "lucide-react";

export default function About() {
  const { data: aboutContent } = useQuery({
    queryKey: ["public-about"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <div className="bg-news-gradient py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-4">За нас</h1>
          <p className="text-white/90 text-xl">
            Нашата история и мисия
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {aboutContent && (
          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {aboutContent.content}
                </p>
              </CardContent>
            </Card>

            {aboutContent.mission && (
              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-3">Нашата мисия</h2>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {aboutContent.mission}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {aboutContent.vision && (
              <Card className="border-l-4 border-l-accent">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <Eye className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-3">Нашата визия</h2>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {aboutContent.vision}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!aboutContent && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Информация скоро ще бъде добавена
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
