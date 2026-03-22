# 📋 Comptes Administrateurs MediFlow

## 🔑 Super Administrateur Principal

### Identifiants de connexion
- **Email**: `admin@mediflow.com`
- **Mot de passe**: `Admin2024!`
- **Rôle**: `cnam_admin`
- **Statut**: `isAdmin: true`

### 🎯 Accès et permissions
Ce compte a accès complet à toutes les fonctionnalités du système :

#### ✅ Modules accessibles
- **Gestion des comptes** (`/gestion-comptes`) - Accès complet
- **Tableau de bord admin** - Selon le rôle sélectionné
- **Tous les dashboards** - Patient, Médecin, Pharmacien, Hôpital, CNAM
- **Navigation complète** - Tous les liens dans la NavBar et la page d'accueil

#### 🛠️ Fonctionnalités de gestion
- **Gestion des utilisateurs** - Création, modification, suppression
- **Supervision système** - Monitoring et audit
- **Administration base de données** - Accès direct aux données
- **Gestion des permissions** - Contrôle d'accès
- **Audit et sécurité** - Journalisation et sécurité

#### 📊 Services configurés
- Gestion complète des comptes
- Supervision système
- Administration base de données
- Gestion des permissions
- Audit et sécurité

## 📝️ Utilisation

### Connexion au système
1. Aller sur `http://localhost:3000/login`
2. Saisir les identifiants ci-dessus
3. Accéder automatiquement à la gestion des comptes

### Accès direct aux modules
- **Gestion comptes**: `http://localhost:3000/gestion-comptes`
- **Accueil**: `http://localhost:3000/`
- **Médicaments**: `http://localhost:3000/medicine-reserve`
- **Médecins**: `http://localhost:3000/doctors`
- **Hôpitaux**: `http://localhost:3000/hospitals`
- **CNAM**: `http://localhost:3000/cnam`

## 🔒 Sécurité

### Recommandations
- Changer le mot de passe après première connexion
- Utiliser une connexion HTTPS en production
- Activer l'authentification à deux facteurs si disponible
- Limiter l'accès IP pour les administrateurs

### Notes importantes
- Ce compte a des droits de super administrateur
- Il peut gérer tous les autres comptes utilisateurs
- Il a accès à toutes les fonctionnalités sans restriction
- En cas de problème, utiliser les autres comptes de test disponibles

## 📞 Support

En cas de problème avec ce compte :
1. Vérifier la connexion au serveur backend
2. Consulter les logs du serveur
3. Utiliser les comptes de test alternatifs
4. Contacter le support technique

---
*Dernière mise à jour: 22 Mars 2026*
*Créé par: MediFlow Admin System*
