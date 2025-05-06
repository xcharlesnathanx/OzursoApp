import { useContext } from "react";
import { PlayerContext } from "@/contexts/PlayerContext";

export function BottomNavigation() {
  const { activeView, setActiveView } = useContext(PlayerContext);
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-muted border-t border-gray-800 px-4 py-2 flex justify-around">
      <button 
        className={`flex flex-col items-center p-2 ${activeView === "players" ? "text-accent" : "text-muted-foreground"}`}
        onClick={() => setActiveView("players")}
      >
        <i className="material-icons">people</i>
        <span className="text-xs mt-1 font-poppins">Jogadores</span>
      </button>
      <button 
        className={`flex flex-col items-center p-2 ${activeView === "teams" ? "text-accent" : "text-muted-foreground"}`}
        onClick={() => setActiveView("teams")}
      >
        <i className="material-icons">groups</i>
        <span className="text-xs mt-1 font-poppins">Gerar Times</span>
      </button>
    </nav>
  );
}
