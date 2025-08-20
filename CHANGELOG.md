# Changelog

All notable changes to this project will be documented in this file.  
This format follows [Keep a Changelog](https://keepachangelog.com/).  
This project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Description of new features or functionalities.

### Changed
- Updates or modifications to existing features.

### Fixed
- Bug fixes or issues resolved.

### Removed
- Deprecated or removed features.

---

## [1.0.0] - 21-08-2025

### Added
- Continuous Deployment (CD) setup.
- Dockerfile and docker-compose configuration for production and preproduction.
- Back button in project selection view.

### Changed
- Improved error handling in login flow (GitLab integration).

### Fixed
- Display of connection error messages when logging in via GitLab.

---

## [0.4.0] - 30-07-2025

### Added
 - CI - ESLint + TU (Vitest)
 - Unit tests - +90%
 - ESLing - 0 output 
 - `/:portfolioUuid/edit` EditPotfolio page (dndkit + Sidebar + Toolbar)
 - Portfolio components : Project (Connect a Github project) - Text (Complet texte editor based on TipTap) - Title (Title with a specific border)
 - New Api call `/user/me` to get the user id 

### Changed
 - docker-compose : updated with last version of Docker
 - architecutre, adding folders to organise components 

### Fixed
 - Dedicated css file for components

---

## [0.3.0] - 31-03-2025

#### Changed 
- `/dashboard` => Button to create a portfolio, get all datas about potfolio

### Added
- `/:portfolioUuid` => Display a portfolio

### Featured 
- PortfolioCard is a component to display a Portfolio
- New functions to call backend routes in ApiService

---

## [0.2.0] - 03-02-2025

### Changed 
- `/dashboard` => Now updated with user data

### Added
- `/oauth/callback` => Callback of the oauth connection, send the code to the backend then get to /dashboard

### Featured
- ConnectionCard is a new component that's used to display a Connection (include redirect link and delete a connection)
- Dashboard now display user's Connection
- Few CSS update

---

## [0.1.0] - 03-01-2025

### Added
- `/login` => Login, user can authenticate to get access to the website.
- `/register` => Register, user can create their account.
- `/dashboard` => The core page of the website, first steps, UI to add connexion or create a portfolio.
