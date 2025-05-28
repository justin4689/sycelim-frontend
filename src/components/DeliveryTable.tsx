import React from "react";
import StatusSelect from "./StatusSelect";

interface Delivery {
  id: string;
  destinataire: string;
  adresse: string;
  statut: string;
  date: string;
  livreur?: string;
}

// Tableau principal pour afficher les livraisons
// Gère la pagination, les actions (suppression, etc.) et le changement de statut
interface DeliveryTableProps {
  deliveries: Delivery[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  actions?: (delivery: Delivery) => React.ReactNode;
  onChangeStatus?: (id: string, newStatus: string) => Promise<void> | void;
}

// Composant principal du tableau de livraisons
const DeliveryTable: React.FC<DeliveryTableProps> = ({ deliveries, page, pageSize, total, onPageChange, actions, onChangeStatus }) => {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="w-full">
      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead className="bg-orange-100">
          <tr>
            <th className="px-4 py-2">Destinataire</th>
            <th className="px-4 py-2">Adresse</th>
            <th className="px-4 py-2">Statut</th>
            <th className="px-4 py-2">Date</th>
            {deliveries[0]?.livreur !== undefined && <th className="px-4 py-2">Livreur</th>}
            {actions && <th className="px-4 py-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {/* Affichage des lignes du tableau pour chaque livraison */}
          {deliveries.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                Aucune livraison à afficher
              </td>
            </tr>
          ) : (
            deliveries.map((delivery) => (
              <tr key={delivery.id} className="border-t hover:bg-orange-50">
                <td className="px-4 py-2">{delivery.destinataire}</td>
                <td className="px-4 py-2">{delivery.adresse}</td>
                {/* Sélecteur de statut interactif */}
                <td className="px-4 py-2">
                  <StatusSelect
                    value={delivery.statut}
                    onChange={async (newStatus: string) => {
                      if (typeof onChangeStatus === "function") {
                        await onChangeStatus(delivery.id, newStatus);
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2">{delivery.date}</td>
                {/* Affichage conditionnel du livreur et des actions */}
                {delivery.livreur !== undefined && <td className="px-4 py-2">{delivery.livreur}</td>}
                {actions && <td className="px-4 py-2">{actions(delivery)}</td>}
              </tr>
            ))
          )}

        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-end items-center mt-4 gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Précédent
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default DeliveryTable;
