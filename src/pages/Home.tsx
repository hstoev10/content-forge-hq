import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Hero } from "@/components/Hero";
import { ArticleCard } from "@/components/ArticleCard";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const navigate = useNavigate();

  const { data: articles, isLoading } = useQuery({
    queryKey: ["published-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <Hero />
      
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2 bg-news-gradient bg-clip-text text-transparent">
            Последни новини
          </h2>
          <p className="text-muted-foreground">
            Актуални събития и репортажи от България и света
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles?.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                subtitle={article.subtitle || ""}
                image_url={article.image_url || ""}
                category={article.category}
                created_at={article.created_at}
                onClick={() => navigate(`/news/${article.id}`)}
              />
            ))}
          </div>
        )}

        {!isLoading && articles && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Няма публикувани новини в момента
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
