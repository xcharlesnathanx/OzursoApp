import { useContext } from "react";
import { PlayerContext } from "@/contexts/PlayerContext";

export function Header() {
  const { activeView, toggleView } = useContext(PlayerContext);
  
  return (
    <header className="bg-primary py-3 px-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img 
            src="/ozurso-logo.png" 
            alt="Ozurso Logo" 
            className="h-10 w-10 object-contain" 
          />
          <h1 className="text-2xl font-poppins font-bold text-foreground">Ozurso</h1>
        </div>
        <div>
          <button
            onClick={toggleView}
            className="p-2 rounded-full bg-primary-light hover:bg-primary-dark text-foreground transition-colors"
          >
            <i className="material-icons">
              {activeView === "players" ? "groups" : "people"}
            </i>
          </button>
        </div>
      </div>
    </header>
  );
}
