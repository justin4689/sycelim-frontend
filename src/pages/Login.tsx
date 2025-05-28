import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const loginSchema = z.object({
  email: z.string().email('L\'email doit être valide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

// Type de données pour le formulaire de connexion
type LoginFormData = z.infer<typeof loginSchema>;

// Page de connexion utilisateur
// Gère l'authentification et la redirection selon le rôle
export default function Login({ onSwitch, onBack }: { onSwitch: () => void; onBack: () => void }) {
  const navigate = useNavigate();

  // Effet pour vérifier si un token est déjà stocké dans le localStorage
  // Si oui, décode le token et redirige l'utilisateur selon son rôle
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const role = decoded.role;
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "livreur") {
          navigate("/livreur");
        }
      } catch (e) {
        // Token invalide, ne rien faire
      }
    }
  }, [navigate]);

  // Initialisation du formulaire de connexion avec la bibliothèque react-hook-form
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Fonction de soumission du formulaire de login
  const onSubmit = async (data: LoginFormData) => {
    try {
      // Envoi de la requête de connexion à l'API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      // Vérification de la réponse de l'API
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      // Récupération du token et du message de réussite
      const result = await response.json();

      // Affichage d'un message de réussite
      toast.success(result.message);

      // Stockage du token dans le localStorage
      localStorage.setItem("token", result.token);

      // Décodage du token pour obtenir le rôle
      const decoded: any = jwtDecode(result.token);
      const role = decoded.role;

      // Redirection selon le rôle
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "livreur") {
        navigate("/livreur");
      } else {
        navigate("/"); // page par défaut
      }

    } catch (error) {
      // Affichage d'un message d'erreur
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-orange-600">Connexion</h2>
      {/* Formulaire de connexion */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
        <div>
          <label className="block text-gray-700 mb-1 text-start">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-start">Mot de passe</label>
          <input
            type="password"
            {...register('password')}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition-colors shadow flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="animate-spin w-5 h-5" />}
          Login
        </button>
      </form>
      <p className="mt-4 text-gray-600 text-sm">
        Pas de compte ?{' '}
        <button type="button" onClick={onSwitch} className="text-blue-600 hover:underline">S'inscrire</button>
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-4 text-gray-500 hover:text-orange-600 underline"
      >
        Retour à l'accueil
      </button>
    </div>
  );
}
