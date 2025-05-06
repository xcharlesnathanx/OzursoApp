import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { PlayerContext } from "@/contexts/PlayerContext";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function DeleteConfirmationModal() {
  const { 
    selectedPlayer, 
    isDeleteConfirmationOpen, 
    setIsDeleteConfirmationOpen, 
    setSelectedPlayer
  } = useContext(PlayerContext);
  
  const { toast } = useToast();
  
  const deletePlayerMutation = useMutation({
    mutationFn: (playerId: number) => {
      return apiRequest("DELETE", `/api/players/${playerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({
        title: "Jogador removido",
        description: "O jogador foi removido com sucesso.",
        variant: "default",
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover jogador",
        description: error.message || "Ocorreu um erro ao remover o jogador.",
        variant: "destructive",
      });
    }
  });
  
  const handleDelete = () => {
    if (selectedPlayer) {
      deletePlayerMutation.mutate(selectedPlayer.id);
    }
  };
  
  const handleClose = () => {
    setIsDeleteConfirmationOpen(false);
    setSelectedPlayer(null);
  };
  
  if (!isDeleteConfirmationOpen || !selectedPlayer) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 fade-in">
      <div className="bg-muted rounded-xl w-full max-w-md m-4 slide-in">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-xl font-poppins font-bold text-foreground">Confirmar Exclusão</h3>
        </div>

        <div className="p-4">
          <p className="text-muted-foreground mb-6">
            Tem certeza que deseja remover o jogador <span className="font-semibold text-foreground">{selectedPlayer.name}</span>? Esta ação não pode ser desfeita.
          </p>
          
          <div className="flex space-x-3">
            <button 
              className="flex-1 py-3 rounded-lg bg-card hover:bg-gray-700 text-foreground font-poppins font-medium"
              onClick={handleClose}
              disabled={deletePlayerMutation.isPending}
            >
              Cancelar
            </button>
            <button 
              className="flex-1 py-3 rounded-lg bg-destructive hover:bg-red-800 text-foreground font-poppins font-medium flex items-center justify-center"
              onClick={handleDelete}
              disabled={deletePlayerMutation.isPending}
            >
              {deletePlayerMutation.isPending ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Removendo...
                </>
              ) : (
                <>Remover</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
