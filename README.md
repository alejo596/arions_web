# ARIONS - Plataforma Web Enterprise (Innovación & Construcción)

Plataforma web de alto rendimiento y diseño corporativo vanguardista para la empresa **ARIONS**, dedicada a:
1. **Desarrollo de proyectos de innovación tecnológica** (Software, IA, Automatización, IoT, Transformación Digital, I+D).
2. **Ejecución de obras menores de construcción** (Remodelaciones, mantenciones, pintura industrial, pavimentos técnicos, estructuras metálicas, electricidad, gasfitería).
3. **Consultorías tecnológicas e ingeniería.**
4. **Desarrollo de soluciones digitales a medida.**

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 19** + **Vite** + **TypeScript**
- **TailwindCSS** + **Framer Motion**
- **React Router 6** + **React Hook Form** + **React Query**
- **Chart.js** + **Lucide React Icons**

### Backend & API
- **Node.js** + **Express.js** + **TypeScript**
- **Prisma ORM** + **PostgreSQL**
- **Sharp**: Conversión y compresión automática de imágenes JPG/PNG a formato **WebP**.
- **JWT** + **Refresh Token** + **BCrypt**
- **Helmet** + **CORS** + **Express Rate Limit**
- **Nodemailer SMTP** para notificaciones por correo.
- **Swagger / OpenAPI 3.0** en `/api/v1/docs`.

---

## 🛠️ Instrucciones de Ejecución Local

### 1. Iniciar el Backend Node.js
```bash
cd backend
npm install
npx prisma generate
npx prisma db push # O npx prisma migrate dev
npm run prisma:seed # Poblar usuarios, proyectos y datos iniciales
npm run dev
```
El servidor backend se iniciará en `http://localhost:5000` y la documentación Swagger en `http://localhost:5000/api/v1/docs`.

### 2. Iniciar el Frontend React
```bash
cd frontend
npm install
npm run dev
```
La aplicación web estará disponible en `http://localhost:5173`.

---

## 🔑 Credenciales por Defecto del Panel Administrativo

- **Administrador**: `admin@arions.tech` / `Admin2026!`
- **Editor**: `editor@arions.tech` / `Editor2026!`
- **Supervisor**: `supervisor@arions.tech` / `Supervisor2026!`

Acceso al panel: `http://localhost:5173/admin/login`

---

## 🐳 Despliegue con Docker & Docker Compose

Para desplegar todo el stack en un servidor Linux/Nginx:

```bash
docker-compose up --build -d
```

Esto desplegará:
- Base de datos PostgreSQL en puerto 5432.
- Backend Express API en puerto 5000.
- Frontend React servido por Nginx en puerto 80.

---

## 🌐 Estrategia de Despliegue 100% Gratuito en la Nube

1. **Base de Datos PostgreSQL**: Crear proyecto gratuito en [Supabase](https://supabase.com) o [Neon](https://neon.tech) y copiar la variable `DATABASE_URL`.
2. **Backend Express API**: Desplegar el repositorio en [Render](https://render.com) o [Railway](https://railway.app) e ingresar las variables de entorno (`DATABASE_URL`, `JWT_SECRET`, etc.).
3. **Frontend Static**: Desplegar la carpeta `frontend` en [Vercel](https://vercel.com) o [Netlify](https://netlify.com) configurando la variable `VITE_API_URL`.
