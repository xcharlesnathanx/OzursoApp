import { useContext } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { PlayerList } from "@/components/player/PlayerList";
import { TeamGenerator } from "@/components/team/TeamGenerator";
import { PlayerDetailModal } from "@/components/player/PlayerDetailModal";
import { PlayerFormModal } from "@/components/player/PlayerFormModal";
import { DeleteConfirmationModal } from "@/components/player/DeleteConfirmationModal";
import { PlayerContext } from "@/contexts/PlayerContext";

export default function Home() {
  const { activeView } = useContext(PlayerContext);
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <main className="flex-1 overflow-y-auto pb-20">
        {activeView === "players" ? (
          <PlayerList />
        ) : (
          <TeamGenerator />
        )}
      </main>
      
      <BottomNavigation />
      
      {/* Modals */}
      <PlayerDetailModal />
      <PlayerFormModal />
      <DeleteConfirmationModal />
    </div>
  );
}
