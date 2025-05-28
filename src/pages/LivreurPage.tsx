import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import LogoutButton from "../components/LogoutButton";
import DeliveryTable from "../components/DeliveryTable";
import DeliveryModal from "../components/DeliveryModal";
import SkeletonTable from "../components/SkeletonTable";

interface Delivery {
  id: string;
  destinataire: string;
  adresse: string;
  statut: string;
  date: string;
}

/*
  LivreurPage.tsx
  -------------------------
  Page livreur pour Sycelim Delivery.
  Affiche les livraisons du livreur connecté et permet d'en ajouter.
*/
// Page Livreur : affiche les livraisons assignées au livreur connecté
// Permet d'ajouter une livraison et de voir la liste paginée
const LivreurPage = () => {

 
  // État pour les livraisons, le chargement et l'erreur
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Récupère les livraisons depuis l'API au chargement
  React.useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${import.meta.env.VITE_API_URL}/deliveries/mine`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Erreur lors du chargement des livraisons");
        const data = await response.json();
        // Map API response to Delivery type
        console.log(data);
        const mapped: Delivery[] = data.map((item: any) => ({
          id: item.id,
          destinataire: item.customerName,
          adresse: item.address,
          statut: item.status === "pending" ? "En attente" : item.status === "delivered" ? "Livrée" : item.status,
          date: item.createdAt.slice(0, 10),
        }));
        setDeliveries(mapped);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const total = deliveries.length;

  // Gestion de la modale d'ajout de livraison
  const [modalOpen, setModalOpen] = useState(false);
  const handleAddDelivery = (data: { destinataire: string; adresse: string }) => {
    setDeliveries([
      ...deliveries,
      {
        id: (deliveries.length + 1).toString(),
        destinataire: data.destinataire,
        adresse: data.adresse,
        statut: "En attente",
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  // Découpe les livraisons pour la pagination
  const paginatedDeliveries = deliveries.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-end items-center mb-6">
        <LogoutButton />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-orange-600">Mes livraisons</h2>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          onClick={() => setModalOpen(true)}
        >
          + Nouvelle livraison
        </button>
      </div>
      {/* Affichage conditionnel : skeleton, erreur ou tableau */}
      {loading ? (
        <SkeletonTable rows={pageSize} />
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <DeliveryTable
          deliveries={paginatedDeliveries}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          readOnlyStatus={true}
        />
      )}
      <DeliveryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddDelivery}
      />
    </div>
  );
};

export default LivreurPage;
