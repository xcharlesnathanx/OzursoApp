import { createContext, useState, ReactNode } from "react";
import type { Player } from "@shared/schema";

type ActiveView = "players" | "teams";

interface PlayerContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  toggleView: () => void;
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player | null) => void;
  isPlayerDetailModalOpen: boolean;
  setIsPlayerDetailModalOpen: (isOpen: boolean) => void;
  isAddPlayerModalOpen: boolean;
  setIsAddPlayerModalOpen: (isOpen: boolean) => void;
  isEditPlayerModalOpen: boolean;
  setIsEditPlayerModalOpen: (isOpen: boolean) => void;
  isDeleteConfirmationOpen: boolean;
  setIsDeleteConfirmationOpen: (isOpen: boolean) => void;
}

export const PlayerContext = createContext<PlayerContextType>({
  activeView: "players",
  setActiveView: () => {},
  toggleView: () => {},
  selectedPlayer: null,
  setSelectedPlayer: () => {},
  isPlayerDetailModalOpen: false,
  setIsPlayerDetailModalOpen: () => {},
  isAddPlayerModalOpen: false,
  setIsAddPlayerModalOpen: () => {},
  isEditPlayerModalOpen: false,
  setIsEditPlayerModalOpen: () => {},
  isDeleteConfirmationOpen: false,
  setIsDeleteConfirmationOpen: () => {},
});

interface PlayerProviderProps {
  children: ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [activeView, setActiveView] = useState<ActiveView>("players");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isPlayerDetailModalOpen, setIsPlayerDetailModalOpen] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isEditPlayerModalOpen, setIsEditPlayerModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  
  // Update modals when selected player changes
  const handleSetSelectedPlayer = (player: Player | null) => {
    setSelectedPlayer(player);
    if (player) {
      setIsPlayerDetailModalOpen(true);
    }
  };
  
  const toggleView = () => {
    setActiveView(prev => prev === "players" ? "teams" : "players");
  };
  
  return (
    <PlayerContext.Provider
      value={{
        activeView,
        setActiveView,
        toggleView,
        selectedPlayer,
        setSelectedPlayer: handleSetSelectedPlayer,
        isPlayerDetailModalOpen,
        setIsPlayerDetailModalOpen,
        isAddPlayerModalOpen,
        setIsAddPlayerModalOpen,
        isEditPlayerModalOpen,
        setIsEditPlayerModalOpen,
        isDeleteConfirmationOpen,
        setIsDeleteConfirmationOpen,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
