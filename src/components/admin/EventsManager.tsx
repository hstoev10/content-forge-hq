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
import { format } from "date-fns";

export const EventsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    image_url: "",
  });

  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("events").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      resetForm();
      toast({ title: "Събитието е добавено" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("events").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      resetForm();
      toast({ title: "Събитието е обновено" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Събитието е изтрито" });
    },
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", event_date: "", location: "", image_url: "" });
    setEditingId(null);
  };

  const handleEdit = (event: any) => {
    setFormData({
      title: event.title,
      description: event.description,
      event_date: format(new Date(event.event_date), "yyyy-MM-dd'T'HH:mm"),
      location: event.location || "",
      image_url: event.image_url || "",
    });
    setEditingId(event.id);
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
          <CardTitle>{editingId ? "Редактиране" : "Ново събитие"}</CardTitle>
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
              <Label htmlFor="description">Описание *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="event_date">Дата и час *</Label>
              <Input
                id="event_date"
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Локация</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
        {events?.map((event) => (
          <Card key={event.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-primary">
                    {format(new Date(event.event_date), "dd.MM.yyyy HH:mm")}
                  </p>
                  {event.location && (
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(event.id)}
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
