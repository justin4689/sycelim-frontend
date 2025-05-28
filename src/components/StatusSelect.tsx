import React, { useState } from "react";

interface StatusSelectProps {
  value: string;
  onChange: (newStatus: string) => void | Promise<void>;
}

const statusOptions = ["En attente", "Livrée", "En cours"];

// Sélecteur de statut pour une livraison
// Appelle onChange (async) et affiche un état de chargement
const StatusSelect: React.FC<StatusSelectProps> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);

  // Gestion du changement de statut
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true);
    await onChange(newStatus);
    setLoading(false);
  };

  return (
    // Sélecteur déroulant avec options de statut
    <select
      className="border rounded px-2 py-1 bg-white disabled:opacity-60"
      value={value}
      onChange={handleChange}
      disabled={loading}
    >
      {statusOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default StatusSelect;
