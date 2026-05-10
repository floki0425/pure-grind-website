import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./assets/pages/Home"
import Order from "./assets/pages/Order"
import ThankYou from "./assets/pages/ThankYou"
import AdminLogin from "./assets/pages/AdminLogin"
import AdminDashboard from "./assets/pages/AdminDashboard"
import OrderDetails from "./assets/pages/OrderDetails"



const App = () => {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/thank-you" element={<ThankYou />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/orders/:id" element={<OrderDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
