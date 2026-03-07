import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Logout from './components/Logout';

// ADMIN COMPONENTS IMPORTS
import AdminDashboard from './pages/Admin/AdminDashboard';
import ImageUpload from './pages/Admin/ImageUpload';
import AdminImageList from './pages/Admin/AdminImageList';
import AdminImageEdit from './pages/Admin/AdminImageEdit';
import CustomerBoard from './pages/Admin/CustomerBoard';
import AdminBidApproval from './pages/Admin/AdminBidApproval';
import AdminTransactions from './pages/Admin/AdminTransactions';

// CUSTOMER COMPONENTS IMPORTS
import CustomerDashboard from './pages/Customer/CustomerDashboard';
import BidPlacer from './pages/Customer/BidPlacer';
import BidStatus from './pages/Customer/BidStatus';
import CustomerTransactions from './pages/Customer/CustomerTransactions';

import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './Layout';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Login /></Layout>} />
          <Route path="/signup" element={<Layout><SignUp /></Layout>} />
          <Route path="/logout" element={<Logout />} />


          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/upload/image"
            element={
              <ProtectedRoute role="admin">
                <Layout>
                  <ImageUpload />
                </Layout>
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute role="admin">
                <Layout>
                  <CustomerBoard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/images"
            element={
              <ProtectedRoute role="admin">
                <Layout>
                  <AdminImageList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/images/:id/edit"
            element={
              <ProtectedRoute role="admin">
                <Layout>
                  <AdminImageEdit />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/bids"
            element={
              <ProtectedRoute role="admin">
                <Layout>
                  <AdminBidApproval />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute role="admin">
                <Layout>
                  <AdminTransactions />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer"
            element={
              <ProtectedRoute role="customer">
                <Layout>
                  <CustomerDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/image/:id"
            element={
              <ProtectedRoute role="customer">
                <Layout>
                  <BidPlacer />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/bids"
            element={
              <ProtectedRoute role="customer">
                <Layout>
                  <BidStatus />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/transactions"
            element={
              <ProtectedRoute role="customer">
                <Layout>
                  <CustomerTransactions />
                </Layout>
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
