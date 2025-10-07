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

export const TeamManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    image_url: "",
    order_index: 0,
  });

  const { data: members } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("team_members").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      resetForm();
      toast({ title: "Членът на екипа е добавен" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("team_members").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      resetForm();
      toast({ title: "Информацията е обновена" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({ title: "Членът е изтрит" });
    },
  });

  const resetForm = () => {
    setFormData({ name: "", position: "", bio: "", image_url: "", order_index: 0 });
    setEditingId(null);
  };

  const handleEdit = (member: any) => {
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio || "",
      image_url: member.image_url || "",
      order_index: member.order_index,
    });
    setEditingId(member.id);
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
          <CardTitle>{editingId ? "Редактиране" : "Нов член"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Име *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="position">Позиция *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="bio">Биография</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="image_url">URL на снимка</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="order_index">Ред на показване</Label>
              <Input
                id="order_index"
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
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
        {members?.map((member) => (
          <Card key={member.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.position}</p>
                  {member.bio && <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(member.id)}
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
