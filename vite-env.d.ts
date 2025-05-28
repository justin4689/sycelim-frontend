/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string; // ajoute ici tes variables
    // autre variable d’environnement : readonly VITE_OTHER_VAR: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  