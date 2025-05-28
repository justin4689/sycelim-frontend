import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Bouton de déconnexion
// Supprime le token et redirige vers la page de login
const LogoutButton: React.FC = () => {
  // Utilisation du hook useNavigate pour rediriger l'utilisateur après déconnexion
  const navigate = useNavigate();

  // Fonction appelée lors du clic sur le bouton de déconnexion
  // Supprime le token de connexion enregistré dans le localStorage
  // et redirige l'utilisateur vers la page de login
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow transition-all"
      title="Déconnexion"
    >
      <LogOut size={18} />
      Déconnexion
    </button>
  );
};

export default LogoutButton;
