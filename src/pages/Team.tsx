import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Team() {
  const { data: members, isLoading } = useQuery({
    queryKey: ["public-team"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <div className="bg-news-gradient py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-4">Нашият екип</h1>
          <p className="text-white/90 text-xl">
            Професионалистите, които ви предоставят новините
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members?.map((member) => (
              <Card key={member.id} className="group hover:shadow-hover transition-all">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-24 w-24 ring-4 ring-primary/10 transition-all group-hover:ring-primary/30">
                      <AvatarImage src={member.image_url || ""} alt={member.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {member.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{member.name}</h3>
                      <p className="text-primary font-medium">{member.position}</p>
                    </div>
                    {member.bio && (
                      <p className="text-muted-foreground text-sm">{member.bio}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && members && members.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Информация за екипа скоро ще бъде добавена
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
