import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const AboutManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    content: "",
    mission: "",
    vision: "",
  });

  const { data: aboutContent } = useQuery({
    queryKey: ["about-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  useEffect(() => {
    if (aboutContent) {
      setFormData({
        content: aboutContent.content || "",
        mission: aboutContent.mission || "",
        vision: aboutContent.vision || "",
      });
    }
  }, [aboutContent]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (aboutContent?.id) {
        const { error } = await supabase
          .from("about_content")
          .update(data)
          .eq("id", aboutContent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("about_content").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-content"] });
      toast({ title: "Информацията е обновена" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>За нас - Съдържание</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="content">Основно съдържание *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              required
            />
          </div>
          <div>
            <Label htmlFor="mission">Мисия</Label>
            <Textarea
              id="mission"
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="vision">Визия</Label>
            <Textarea
              id="vision"
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              rows={4}
            />
          </div>
          <Button type="submit">Запази промените</Button>
        </form>
      </CardContent>
    </Card>
  );
};
