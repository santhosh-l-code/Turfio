import { Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import Turfs from "./pages/Turfs"
import TurfDetails from "./pages/TurfDetials"
import Signup from "./services/Signup"
import Login from "./services/Login"
import MyBookings from "./pages/MyBookings"
import Products from "./pages/Products"
import ReviewPage from "./pages/ReviewPage"
import Navbar from "./components/Navbar"
import PlayerDashboard from "./pages/PlayerDashboard"
import OwnerDashboard from "./pages/OwnerDashboard"
import OwnerTurfs from "./pages/OwnerTurfs"
import OwnerProducts from "./pages/OwnerProducts"

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route>
          <Route path="/" element={<Home />} />
          <Route path="/turfs" element={<Turfs />} />
          <Route path="/turf/:id" element={<TurfDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/products" element={<Products />} />
          <Route path="/review/:id" element={<ReviewPage />} />
          <Route path="/dashboard" element={<PlayerDashboard />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/turfs" element={<OwnerTurfs />} />
          <Route path="/owner/products" element={<OwnerProducts />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App