# Sycelim Delivery - Frontend

Bienvenue sur l’application de gestion de livraisons **Sycelim Delivery** !

---

## 🚀 Installation et lancement de l’application

1. **Cloner le dépôt**

```bash
# Avec git
 git clone <url-du-repo>
 cd sycelimdelivery-frontend
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d’environnement**

- Copiez le fichier `.env.example` en `.env` et adaptez l’URL de l’API si besoin :

```bash
cp .env.example .env
```

- Par défaut :
```
VITE_API_URL=http://localhost:5000/api
```

4. **Lancer l’application en développement**

```bash
npm run dev
```

5. **Accéder à l’application**

Ouvrez votre navigateur à l’adresse :
```
http://localhost:5173
```

---

## 🏠 Aperçu de l’interface

![Aperçu de la page d’accueil](/home1.png)

---
ADMIN LOGIN

email : jessica.doe@email.com
password : motdepasse123


## 📦 Structure du projet

- `src/pages/` : Pages principales (Home, Admin, Livreur, Login, Register)
- `src/components/` : Composants réutilisables (Tableaux, Footer, etc.)
- `src/assets/` : Images et icônes

---

## ❓ Besoin d’aide ?

Contactez l’équipe Sycelim : support@sycelim.com

---

> Application réalisée avec React, Vite, TailwindCSS.
