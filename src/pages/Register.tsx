import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";



const registerSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('L\'email doit être valide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type RegisterFormData = z.infer<typeof registerSchema>;


export default function Register({ onSwitch, onBack }: { onSwitch: () => void; onBack: () => void }) {
  const navigate = useNavigate();
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
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
 
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          role: 'livreur'
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const result = await response.json();

      toast.success(result.message);
      navigate('/login');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error(errorMessage);
    }
    
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-orange-600">Inscription</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
        <div>
          <label className="block text-gray-700 mb-1 text-start">Prénom</label>
          <input
            {...register('firstName')}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-start">Nom</label>
          <input
            {...register('lastName')}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-start">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          S'inscrire
        </button>
      </form>
      <p className="mt-4 text-gray-600 text-sm">
        Déjà un compte ?{' '}
        <button type="button" onClick={onSwitch} className="text-orange-600 hover:underline">Se connecter</button>
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
