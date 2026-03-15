# SmartKalas Admin Dashboard

Admin dashboard for managing SmartKalas application.

## Features

- 🔐 Authentication with admin role checking
- 📊 Dashboard with statistics
- 📢 Advertisement management (Create, Read, Update, Delete, Enable/Disable)
- 👥 User management (Coming soon)
- 📈 Analytics and performance tracking

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## Project Structure

```
admin-dashboard/
├── src/
│   ├── components/      # Reusable components
│   │   └── DashboardLayout.tsx
│   ├── pages/           # Page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AdvertisementsPage.tsx
│   │   ├── AdvertisementFormPage.tsx
│   │   └── UsersPage.tsx
│   ├── services/        # API client
│   │   └── api.ts
│   ├── store/           # State management (Zustand)
│   │   └── authStore.ts
│   ├── config/          # Configuration
│   │   └── api.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── router.tsx       # Router configuration
│   └── App.tsx           # App entry point
```

## Authentication

Only users with `ADMIN` role can access the dashboard. The login endpoint validates the admin role before allowing access.

## API Endpoints Used

### Auth
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout

### Advertisements (Admin Only)
- `GET /api/advertisements` - List all advertisements
- `GET /api/advertisements/:id` - Get advertisement by ID
- `POST /api/advertisements` - Create advertisement
- `PUT /api/advertisements/:id` - Update advertisement
- `DELETE /api/advertisements/:id` - Delete advertisement

## Build

To build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.
