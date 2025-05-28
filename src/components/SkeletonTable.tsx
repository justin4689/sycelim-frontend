import React from "react";

// SkeletonTable : composant d'affichage de chargement pour les tableaux
// Affiche des lignes grises pour simuler le contenu pendant le loading
const SkeletonTable = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="animate-pulse">
      <div className="overflow-x-auto">
        {/* Structure du tableau squelette, alignée sur le vrai tableau */}
        <table className="min-w-full border rounded-lg overflow-hidden">
          <thead className="bg-orange-100">
            <tr>
              <th className="px-4 py-2">Destinataire</th>
              <th className="px-4 py-2">Adresse</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Date</th>
              {/* Optionally add Livreur and Actions columns for perfect alignment */}
              <th className="px-4 py-2">&nbsp;</th>
              <th className="px-4 py-2">&nbsp;</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, idx) => (
              <tr key={idx} className="border-t">
                {Array.from({ length: 6 }).map((_, colIdx) => (
                  <td key={colIdx} className="px-4 py-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonTable;
