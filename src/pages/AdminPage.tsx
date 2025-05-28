import React, { useState } from "react";
import LogoutButton from "../components/LogoutButton";
import DeliveryTable from "../components/DeliveryTable";
import SkeletonTable from "../components/SkeletonTable";
import { toast } from "sonner";

interface Delivery {
  id: string;
  destinataire: string;
  adresse: string;
  statut: string;
  date: string;
  livreur: string;
}

/*
  AdminPage.tsx
  -------------------------
  Page d'administration pour Sycelim Delivery.
  Permet la gestion complète des livraisons (statut, suppression).
*/
// Page d'administration pour la gestion des livraisons
// Permet de voir, modifier le statut, et supprimer des livraisons
const AdminPage = () => {
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/deliveries`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Erreur lors du chargement des livraisons");
        const data = await response.json();
        console.log(data);
        const mapped: Delivery[] = data.map((item: any) => ({
          id: item.id,
          destinataire: item.customerName,
          adresse: item.address,
          statut: item.status === "pending" ? "En attente" : item.status === "delivered" ? "Livrée" : item.status,
          date: item.createdAt.slice(0, 10),
          livreur: item.livreurFirstname || "-",
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

  // Action locale (plus utilisée, remplacée par le select)
  const handleChangeStatus = (id: string) => {
    setDeliveries(deliveries.map(delivery =>
      delivery.id === id
        ? { ...delivery, statut: delivery.statut === "Livrée" ? "En attente" : "Livrée" }
        : delivery
    ));
  };

  // Supprime une livraison via l'API et met à jour l'UI
  const handleDelete = async (id: string) => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/deliveries/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression de la livraison");
      const data = await response.json();
      toast.success(data.message);
      setDeliveries(deliveries.filter(delivery => delivery.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Erreur inconnue");
    }

  };

  // Découpe les livraisons pour la pagination
  const paginatedDeliveries = deliveries.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-600">Tableau des livraisons</h2>
        <LogoutButton />
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
          onChangeStatus={async (id, newStatus) => {
            // Map UI status to API status
            const statusMap: Record<string, string> = {
              "En attente": "pending",
              "Livrée": "delivered",
              "En cours": "in_progress",
            };
            const apiStatus = statusMap[newStatus] || newStatus;
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL}/deliveries/${id}/status`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ status: apiStatus }),
              });
              if (!response.ok) throw new Error("Erreur lors du changement de statut");
              toast.success("Statut mis à jour");
              // Update UI
              setDeliveries((prev) =>
                prev.map((d) =>
                  d.id === id ? { ...d, statut: newStatus } : d
                )
              );
            } catch (err: any) {
              toast.error(err.message || "Erreur inconnue");
            }
          }}
          actions={(delivery) => (
            <div className="flex gap-2">
              <button
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                onClick={() => handleDelete(delivery.id)}
              >
                Supprimer
              </button>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default AdminPage;
