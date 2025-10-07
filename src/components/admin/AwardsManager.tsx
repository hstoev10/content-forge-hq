import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";

export const AwardsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: new Date().getFullYear(),
    image_url: "",
  });

  const { data: awards } = useQuery({
    queryKey: ["awards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("awards")
        .select("*")
        .order("year", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("awards").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      resetForm();
      toast({ title: "Наградата е добавена" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("awards").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      resetForm();
      toast({ title: "Наградата е обновена" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("awards").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast({ title: "Наградата е изтрита" });
    },
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", year: new Date().getFullYear(), image_url: "" });
    setEditingId(null);
  };

  const handleEdit = (award: any) => {
    setFormData({
      title: award.title,
      description: award.description || "",
      year: award.year,
      image_url: award.image_url || "",
    });
    setEditingId(award.id);
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
          <CardTitle>{editingId ? "Редактиране" : "Нова награда"}</CardTitle>
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
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="year">Година *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
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
            <div className="flex gap-2">
              <Button type="submit">{editingId ? "Обнови" : "Добави"}</Button>
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
        {awards?.map((award) => (
          <Card key={award.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{award.title}</h3>
                  <p className="text-sm text-primary">Година: {award.year}</p>
                  {award.description && (
                    <p className="text-sm text-muted-foreground mt-2">{award.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(award)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(award.id)}
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
