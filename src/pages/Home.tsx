import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Footer from "../components/Footer";

export default function Home({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
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
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-br from-orange-100 via-blue-100 to-white animate-fadein md:bg-[url('/src/assets/home.jpeg')]">
      <div className="flex-1 flex items-start justify-center">
        <style>{`
          .animate-fadein {
            animation: fadeInSlide 1s cubic-bezier(0.4, 0, 0.2, 1);
          }
          @keyframes fadeInSlide {
            0% { opacity: 0; transform: translateY(40px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-title {
            animation: titlePop 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          @keyframes titlePop {
            0% { opacity: 0; transform: translateY(-20px) scale(0.95); }
            70% { opacity: 1; transform: translateY(0) scale(1.04); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center animate-fadein mt-5">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-orange-600 animate-title drop-shadow-lg text-center tracking-tight">
            Bienvenue sur <span className="text-blue-500">Sycelim Delivery</span>
          </h2>
          <button
            onClick={onLogin}
            className="w-full bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-xl mb-5 transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">🚀</span> Se connecter
          </button>
          <button
            onClick={onRegister}
            className="w-full bg-gradient-to-r from-blue-500 via-orange-400 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">✨</span> S'inscrire
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
