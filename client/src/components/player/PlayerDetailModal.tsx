import { useContext } from "react";
import { PlayerContext } from "@/contexts/PlayerContext";
import { SkillBar } from "@/components/ui/skill-bar";

export function PlayerDetailModal() {
  const { 
    selectedPlayer, 
    isPlayerDetailModalOpen, 
    setIsPlayerDetailModalOpen, 
    setIsEditPlayerModalOpen,
    setIsDeleteConfirmationOpen,
  } = useContext(PlayerContext);
  
  if (!selectedPlayer) return null;
  
  const {
    name,
    photoUrl,
    skills,
    averageScore
  } = selectedPlayer;
  
  const handleEdit = () => {
    setIsPlayerDetailModalOpen(false);
    setIsEditPlayerModalOpen(true);
  };
  
  const handleDelete = () => {
    setIsPlayerDetailModalOpen(false);
    setIsDeleteConfirmationOpen(true);
  };
  
  const skillNames: Record<string, string> = {
    saque: "Saque",
    recepcao: "Recepção",
    passe: "Passe",
    ataque: "Ataque",
    bloqueio: "Bloqueio",
    defesa: "Defesa",
    mobilidade: "Mobilidade"
  };
  
  if (!isPlayerDetailModalOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 fade-in">
      <div className="bg-muted rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto m-4 slide-in">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-muted z-10">
          <h3 className="text-xl font-poppins font-bold text-foreground">Perfil do Jogador</h3>
          <button 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setIsPlayerDetailModalOpen(false)}
          >
            <i className="material-icons">close</i>
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-6">
            {/* Player Photo */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-primary-light flex items-center justify-center mr-4">
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt={`Foto de ${name}`} 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '';
                    e.currentTarget.classList.add('hidden');
                    e.currentTarget.parentElement!.innerHTML += '<i class="material-icons text-4xl text-muted-foreground">person</i>';
                  }}
                />
              ) : (
                <i className="material-icons text-4xl text-muted-foreground">person</i>
              )}
            </div>
            <div>
              <h4 className="text-2xl font-poppins font-bold text-foreground">{name}</h4>
              <div className="flex items-center mt-1">
                <span className="bg-accent text-accent-foreground font-poppins font-bold rounded-full px-2 py-1 text-sm flex items-center">
                  <i className="material-icons text-xs mr-1">star</i>
                  <span>{averageScore}</span>
                </span>
              </div>
            </div>
          </div>

          <h5 className="font-poppins font-semibold text-lg text-foreground mb-3">Habilidades</h5>
          
          <div className="space-y-4 mb-6">
            {Object.entries(skills).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <label className="text-muted-foreground font-poppins">{skillNames[key]}</label>
                  <span className="text-foreground font-poppins font-medium">{value}</span>
                </div>
                <SkillBar value={value} />
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <button 
              className="flex-1 py-3 rounded-lg bg-primary hover:bg-primary-dark text-foreground font-poppins font-medium flex items-center justify-center"
              onClick={handleEdit}
            >
              <i className="material-icons mr-2">edit</i>
              Editar
            </button>
            <button 
              className="flex-1 py-3 rounded-lg bg-destructive hover:bg-red-800 text-foreground font-poppins font-medium flex items-center justify-center"
              onClick={handleDelete}
            >
              <i className="material-icons mr-2">delete</i>
              Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
