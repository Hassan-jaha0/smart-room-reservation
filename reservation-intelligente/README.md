# 🏢 Smart Room Reservation

Une solution moderne et intuitive pour la gestion et la réservation de salles de réunion. Ce projet a été développé pour offrir une expérience fluide tant pour les administrateurs que pour les utilisateurs finaux, avec un accent particulier sur le design et la performance.

---

## 🎯 Objectif du Projet
L'objectif principal est de simplifier la planification des espaces de travail au sein d'une organisation. Le système permet d'éviter les conflits d'horaires, de visualiser l'occupation des salles en temps réel et de fournir des statistiques détaillées sur l'utilisation des ressources.

---

## ✨ Fonctionnalités Clés

### 👤 Gestion des Rôles (RBAC)
- **Administrateur** : Contrôle total sur les utilisateurs, les salles et accès aux statistiques globales.
- **Manager** : Gestion des salles, validation des réservations et accès aux statistiques.
- **Utilisateur** : Consultation du calendrier et réservation de créneaux.

### 📅 Réservation Intelligente
- **Calendrier Interactif** : Vue par mois, semaine ou jour.
- **Gestion des Conflits** : Algorithme empêchant les doubles réservations sur le même créneau.
- **Tableau de Bord** : Vue d'ensemble des réservations passées et à venir.

### 📊 Statistiques & Analytics
- Visualisation du taux d'occupation.
- Métriques sur les utilisateurs les plus actifs et les salles les plus demandées.

### 🔒 Sécurité & Profil
- Authentification sécurisée via **Laravel Sanctum**.
- Réinitialisation de mot de passe par email.
- Gestion du profil utilisateur (nom, email, mot de passe).

---

## 🛠 Technologies Utilisées

### Backend
- **Framework** : Laravel 11
- **Authentification** : Laravel Sanctum
- **Base de données** : MySQL
- **Notifications** : Mailtrap (pour les tests d'emails)

### Frontend
- **Framework** : React + Vite
- **Styling** : Tailwind CSS
- **Icônes** : Lucide React
- **Calendrier** : FullCalendar
- **Animations** : Tailwind Animate

---

## 🔑 Identifiants de Test (Mode Démo)

| Rôle | Email | Mot de Passe |
| :--- | :--- | :--- |
| **Administrateur** | `admin@test.com` | `password` |
| **Manager** | `manager@test.com` | `password` |
| **Utilisateur** | `user@test.com` | `password` |

---

## ⚙️ Installation & Lancement

1. **Clonage du projet** :
   ```bash
   git clone [URL_DU_REPO]
   ```

2. **Configuration Backend** :
   ```bash
   composer install
   php artisan migrate --seed
   php artisan key:generate
   php artisan serve
   ```

3. **Configuration Frontend** :
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🚀 Guide de déploiement GitHub

Pour pusher ce projet sur votre GitHub :
1. Créez un nouveau dépôt sur GitHub.
2. Liez votre dossier local :
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Smart Room Reservation"
   git remote add origin [URL_VOTRE_REPO]
   git branch -M main
   git push -u origin main
   ```

---

*Développé par  Hassan Jaha pour une gestion d'espace plus intelligente.*
