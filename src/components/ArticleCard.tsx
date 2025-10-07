import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { bg } from "date-fns/locale";

interface ArticleCardProps {
  title: string;
  subtitle?: string;
  image_url?: string;
  category: string;
  created_at: string;
  onClick: () => void;
}

export const ArticleCard = ({
  title,
  subtitle,
  image_url,
  category,
  created_at,
  onClick,
}: ArticleCardProps) => {
  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-hover animate-in fade-in slide-in-from-bottom-4"
      onClick={onClick}
    >
      {image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary">{category}</Badge>
          </div>
        </div>
      )}
      <CardHeader>
        <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
      </CardHeader>
      <CardContent>
        {subtitle && (
          <p className="text-muted-foreground line-clamp-3 mb-4">{subtitle}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDistanceToNow(new Date(created_at), {
                addSuffix: true,
                locale: bg,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
