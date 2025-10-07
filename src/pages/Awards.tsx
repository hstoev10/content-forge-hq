import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Awards() {
  const { data: awards, isLoading } = useQuery({
    queryKey: ["public-awards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("awards")
        .select("*")
        .order("year", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <div className="bg-news-gradient py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-4">Награди</h1>
          <p className="text-white/90 text-xl">
            Признания за нашата журналистическа работа
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {awards?.map((award) => (
              <Card key={award.id} className="group hover:shadow-hover transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent p-3 rounded-lg transition-transform group-hover:scale-110">
                      <Award className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{award.title}</h3>
                        <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {award.year}
                        </span>
                      </div>
                      {award.description && (
                        <p className="text-muted-foreground">{award.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && awards && awards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Информация за награди скоро ще бъде добавена
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
