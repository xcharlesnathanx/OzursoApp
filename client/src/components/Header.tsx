import { useContext } from "react";
import { PlayerContext } from "@/contexts/PlayerContext";

export function Header() {
  const { activeView, toggleView } = useContext(PlayerContext);
  
  return (
    <header className="bg-primary py-4 px-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="material-icons text-accent text-3xl">sports_volleyball</i>
          <h1 className="text-2xl font-poppins font-bold text-foreground">VolleyBears</h1>
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
