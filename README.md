# 🎨 Enhanced Git Frontend

**Enhanced Git Frontend** is a React application built with **Vite** and **Node.js v20**.  
It provides the user interface for interacting with the **Enhanced Git API**, allowing developers to showcase, enrich, and organize their GitHub/GitLab projects.  

---

## 🚀 Tech Stack

- [React](https://react.dev/) — Frontend library  
- [Vite](https://vitejs.dev/) — Next generation frontend tooling  
- Node.js v20  
- ESLint — for code linting  
- Vitest — for unit testing  
- npm audit — for dependency security checks  
- Docker & Docker Compose  

---

## 📦 Installation

### 🔁 Option 1: Run with Docker

1. Make sure **Docker** and **Docker Compose** are installed.  
2. Start the services:  
   ```bash
   docker-compose up --build
   ```
3. The application will be available at: http://localhost:3000

### 🔁 Option 2: Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. The application will be available at: http://localhost:5173

## ✅ Running Tests

To execute unit tests with Vitest:
    ```bash
    npm test
    ```
This will run the test suite and display results in the terminal.

## 🔍 Linting

To check code quality using ESLint:
   ```bash
   npm run lint
   ```
You can configure rules inside the .eslintrc file.


## ⚡ Security Audit

To check the security of project dependencies:
   ```bash
   npm audit
   ```

You can also run:
   ```bash
   npm audit fix
   ```
to automatically fix known vulnerabilities where possible.
