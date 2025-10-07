import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function Events() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <div className="bg-news-gradient py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-4">Събития</h1>
          <p className="text-white/90 text-xl">
            Предстоящи и минали събития
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {events?.map((event) => (
              <Card key={event.id} className="group hover:shadow-hover transition-all">
                <CardContent className="pt-6">
                  {event.image_url && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(event.event_date), "dd MMMM yyyy, HH:mm", {
                          locale: bg,
                        })}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-foreground">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && events && events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Няма планирани събития в момента
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
