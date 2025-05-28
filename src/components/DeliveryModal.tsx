import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

// Interface pour les props du composant DeliveryModal
interface DeliveryModalProps {
  // Indique si le modal est ouvert
  isOpen: boolean;
  // Fonction pour fermer le modal
  onClose: () => void;
  // Fonction pour soumettre les données du formulaire
  onSubmit: (data: { destinataire: string; adresse: string }) => void;
}

// Composant DeliveryModal pour ajouter une nouvelle livraison
// Gère l'ouverture, la fermeture et la soumission du formulaire
const DeliveryModal: React.FC<DeliveryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  // État du formulaire
  const [destinataire, setDestinataire] = useState("");
  const [adresse, setAdresse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gère la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit({ destinataire, adresse });

    try {
      // Envoi des données à l'API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/deliveries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ customerName: destinataire, address: adresse }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const result = await response.json();
      setIsSubmitting(false);

      // Affichage d'un message de succès
      toast.success(result.message);
    } catch (error) {
      console.error(error);
      // Affichage d'un message d'erreur
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    }
    setIsSubmitting(false);
    setDestinataire("");
    setAdresse("");
    onClose();
  };

  // Affichage conditionnel du modal
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] relative">
        {/* Bouton de fermeture */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-4 text-orange-600">Nouvelle livraison</h3>
        {/* Formulaire d'ajout */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Destinataire"
            value={destinataire}
            onChange={e => setDestinataire(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Adresse"
            value={adresse}
            onChange={e => setAdresse(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center justify-center"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryModal;
