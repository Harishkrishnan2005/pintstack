import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import AppShell from "../layouts/AppShell.jsx";
import CreatePostPage from "../pages/CreatePostPage.jsx";
import EditProfilePage from "../pages/EditProfilePage.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import PostDetailPage from "../pages/PostDetailPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import SavedPostsPage from "../pages/SavedPostsPage.jsx";
import SearchPage from "../pages/SearchPage.jsx";

function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      {children}
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppShell>
            <HomePage />
          </AppShell>
        }
      />
      <Route
        path="/search"
        element={
          <AppShell>
            <SearchPage />
          </AppShell>
        }
      />
      <Route
        path="/posts/:id"
        element={
          <AppShell>
            <PostDetailPage />
          </AppShell>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <AppShell>
            <ProfilePage />
          </AppShell>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <AppShell>
              <CreatePostPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <AppShell>
              <SavedPostsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <AppShell>
              <EditProfilePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        }
      />
      <Route
        path="*"
        element={
          <AppShell>
            <NotFoundPage />
          </AppShell>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
