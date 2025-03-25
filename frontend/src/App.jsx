import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Logout from './components/Logout';

// ADMIN COMPONENTS IMPORTS
import AdminDashboard from './pages/Admin/AdminDashboard';
import ImageUpload from './pages/Admin/ImageUpload';
import CustomerBoard from './pages/Admin/CustomerBoard';


// CUSTOMER COMPONENTS IMPORTS
import CustomerDashboard from './pages/Customer/CustomerDashboard';
import BidPlacer from './pages/Customer/BidPlacer';

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


        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
