import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const ArticlesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    image_url: "",
    category: "news",
    published: false,
  });

  const { data: articles } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("articles").insert({
        ...data,
        author_id: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      resetForm();
      toast({ title: "Новината е създадена успешно" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("articles").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      resetForm();
      toast({ title: "Новината е обновена успешно" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast({ title: "Новината е изтрита" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      content: "",
      image_url: "",
      category: "news",
      published: false,
    });
    setEditingId(null);
  };

  const handleEdit = (article: any) => {
    setFormData({
      title: article.title,
      subtitle: article.subtitle || "",
      content: article.content,
      image_url: article.image_url || "",
      category: article.category,
      published: article.published,
    });
    setEditingId(article.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Редактиране" : "Нова новина"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Заглавие *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Подзаглавие</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="content">Съдържание *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                required
              />
            </div>
            <div>
              <Label htmlFor="image_url">URL на изображение</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Категория</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Публикувана</Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "Обнови" : "Създай"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Отказ
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {articles?.map((article) => (
          <Card key={article.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{article.title}</h3>
                    {article.published ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  {article.subtitle && (
                    <p className="text-sm text-muted-foreground mb-2">{article.subtitle}</p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">{article.content}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(article)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(article.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
