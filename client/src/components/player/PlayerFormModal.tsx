import { useContext, useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { PlayerContext } from "@/contexts/PlayerContext";
import { SkillSlider } from "@/components/ui/skill-slider";
import { calculateSkillAverage } from "@/lib/utils/calculate-skill-average";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { PlayerSkills } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function PlayerFormModal() {
  const { 
    isAddPlayerModalOpen, 
    isEditPlayerModalOpen,
    setIsAddPlayerModalOpen,
    setIsEditPlayerModalOpen,
    selectedPlayer
  } = useContext(PlayerContext);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isOpen = isAddPlayerModalOpen || isEditPlayerModalOpen;
  const isEdit = isEditPlayerModalOpen && selectedPlayer !== null;
  
  // Form state
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [skills, setSkills] = useState<PlayerSkills>({
    saque: 5,
    recepcao: 5,
    passe: 5,
    ataque: 5,
    bloqueio: 5,
    defesa: 5,
    mobilidade: 5
  });
  
  // Calculate average
  const averageScore = calculateSkillAverage(skills);
  
  // Mutations
  const createPlayerMutation = useMutation({
    mutationFn: (data: { name: string; photoUrl: string; skills: PlayerSkills; averageScore: number }) => {
      return apiRequest("POST", "/api/players", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({
        title: "Jogador adicionado",
        description: "O jogador foi adicionado com sucesso.",
        variant: "default",
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar jogador",
        description: error.message || "Ocorreu um erro ao adicionar o jogador.",
        variant: "destructive",
      });
    }
  });
  
  const updatePlayerMutation = useMutation({
    mutationFn: (data: { id: number; player: { name: string; photoUrl: string; skills: PlayerSkills; averageScore: number } }) => {
      return apiRequest("PUT", `/api/players/${data.id}`, data.player);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({
        title: "Jogador atualizado",
        description: "O jogador foi atualizado com sucesso.",
        variant: "default",
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar jogador",
        description: error.message || "Ocorreu um erro ao atualizar o jogador.",
        variant: "destructive",
      });
    }
  });
  
  // Initialize form with selected player data if editing
  useEffect(() => {
    if (isEdit && selectedPlayer) {
      setName(selectedPlayer.name);
      setPhotoUrl(selectedPlayer.photoUrl || "");
      setPhotoPreview(selectedPlayer.photoUrl || "");
      setSkills(selectedPlayer.skills);
    } else {
      // Reset form for new player
      setName("");
      setPhotoUrl("");
      setPhotoPreview("");
      setSkills({
        saque: 5,
        recepcao: 5,
        passe: 5,
        ataque: 5,
        bloqueio: 5,
        defesa: 5,
        mobilidade: 5
      });
    }
  }, [isEdit, selectedPlayer, isOpen]);
  
  const handleClose = () => {
    setIsAddPlayerModalOpen(false);
    setIsEditPlayerModalOpen(false);
  };
  
  const handlePhotoSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoPreview(result);
        setPhotoUrl(result); // In a real app, you'd upload to server and use the returned URL
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSkillChange = (skillName: keyof PlayerSkills, value: number) => {
    setSkills(prev => ({
      ...prev,
      [skillName]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const playerData = {
      name,
      photoUrl,
      skills,
      averageScore: Math.round(averageScore)
    };
    
    if (isEdit && selectedPlayer) {
      updatePlayerMutation.mutate({ id: selectedPlayer.id, player: playerData });
    } else {
      createPlayerMutation.mutate(playerData);
    }
  };
  
  if (!isOpen) return null;
  
  const isPending = createPlayerMutation.isPending || updatePlayerMutation.isPending;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 fade-in">
      <div className="bg-muted rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto m-4 slide-in">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-muted z-10">
          <h3 className="text-xl font-poppins font-bold text-foreground">
            {isEdit ? "Editar Jogador" : "Adicionar Jogador"}
          </h3>
          <button 
            className="text-muted-foreground hover:text-foreground"
            onClick={handleClose}
            disabled={isPending}
          >
            <i className="material-icons">close</i>
          </button>
        </div>

        <form className="p-4" onSubmit={handleSubmit}>
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-light flex items-center justify-center">
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <i className="material-icons text-5xl text-muted-foreground">person</i>
                )}
              </div>
              <button 
                type="button"
                className="absolute bottom-0 right-0 bg-accent rounded-full p-1 shadow-lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
              >
                <i className="material-icons text-accent-foreground">photo_camera</i>
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" 
                onChange={handlePhotoSelection}
                disabled={isPending}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="playerName" className="block text-muted-foreground font-poppins font-medium mb-2">Nome</label>
            <input 
              type="text" 
              id="playerName" 
              className="w-full px-4 py-3 rounded-lg bg-muted text-foreground border border-gray-700 focus:outline-none focus:border-accent"
              placeholder="Nome do jogador"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          <h4 className="font-poppins font-semibold text-lg text-foreground mb-4">Habilidades (1-10)</h4>
          
          {/* Skill sliders */}
          <div className="space-y-4 mb-6">
            <SkillSlider 
              name="saque"
              label="Saque"
              value={skills.saque}
              onChange={(value) => handleSkillChange("saque", value)}
              disabled={isPending}
            />
            
            <SkillSlider 
              name="recepcao"
              label="Recepção"
              value={skills.recepcao}
              onChange={(value) => handleSkillChange("recepcao", value)}
              disabled={isPending}
            />
            
            <SkillSlider 
              name="passe"
              label="Passe"
              value={skills.passe}
              onChange={(value) => handleSkillChange("passe", value)}
              disabled={isPending}
            />
            
            <SkillSlider 
              name="ataque"
              label="Ataque"
              value={skills.ataque}
              onChange={(value) => handleSkillChange("ataque", value)}
              disabled={isPending}
            />
            
            <SkillSlider 
              name="bloqueio"
              label="Bloqueio"
              value={skills.bloqueio}
              onChange={(value) => handleSkillChange("bloqueio", value)}
              disabled={isPending}
            />
            
            <SkillSlider 
              name="defesa"
              label="Defesa"
              value={skills.defesa}
              onChange={(value) => handleSkillChange("defesa", value)}
              disabled={isPending}
            />
            
            <SkillSlider 
              name="mobilidade"
              label="Mobilidade"
              value={skills.mobilidade}
              onChange={(value) => handleSkillChange("mobilidade", value)}
              disabled={isPending}
            />
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Média das Habilidades:</span>
            <span className="text-accent font-bold">{averageScore.toFixed(1)}</span>
          </div>

          <button 
            type="submit"
            className="w-full py-3 rounded-lg bg-accent hover:bg-accent-light text-accent-foreground font-poppins font-bold text-lg flex items-center justify-center transition-colors"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full mr-2"></div>
                {isEdit ? "Salvando..." : "Adicionando..."}
              </>
            ) : (
              <>
                <i className="material-icons mr-2">{isEdit ? "save" : "add"}</i>
                {isEdit ? "Salvar Alterações" : "Adicionar Jogador"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
