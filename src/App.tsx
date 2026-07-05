import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import { Dashboard } from './pages/Dashboard'
import { DistributorDetail } from './pages/DistributorDetail'
import { Distributors } from './pages/Distributors'
import { Inventory } from './pages/Inventory'
import { Login } from './pages/Login'
import { ProductDetail } from './pages/ProductDetail'
import { Products } from './pages/Products'
import { SalesPersonDetail } from './pages/SalesPersonDetail'
import { SalesPersons } from './pages/SalesPersons'
import { ShopDetail } from './pages/ShopDetail'
import { Shops } from './pages/Shops'

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="shops" element={<Shops />} />
                <Route path="shops/:id" element={<ShopDetail />} />
                <Route path="sales-persons" element={<SalesPersons />} />
                <Route
                  path="sales-persons/:id"
                  element={<SalesPersonDetail />}
                />
                <Route path="distributors" element={<Distributors />} />
                <Route
                  path="distributors/:id"
                  element={<DistributorDetail />}
                />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}
