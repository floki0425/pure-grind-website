import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import AdminSidebar from "./AdminSidebar";
import { brand } from "../../lib/constants";
import OrderTable from "../order/OrderTable";

function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("Fetched orders:", data);
    console.log("Fetch error:", error);

    if (error) {
      console.error("Fetch orders error:", error);
      alert(`Failed to fetch orders: ${error.message}`);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");

    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }

    fetchOrders();
  }, [navigate]);

  const totalOrders = orders.length;

  const paidOrders = orders.filter(
    (order) => order.payment_status === "Paid"
  );

  const pendingOrders = orders.filter(
    (order) => order.payment_status === "Pending"
  );

  const totalSales = paidOrders.reduce(
    (sum, order) => sum + Number(order.subtotal || 0),
    0
  );

  const totalPacksSold = paidOrders.reduce(
    (sum, order) => sum + Number(order.quantity || 0),
    0
  );

  const totalCommission = totalSales * brand.commissionRate;

  const cards = [
    ["Total Orders", totalOrders],
    ["Paid Orders", paidOrders.length],
    ["Pending Orders", pendingOrders.length],
    ["Total Sales", `₱${totalSales}`],
    ["Packs Sold", totalPacksSold],
    ["Total Commission", `₱${totalCommission}`],
  ];

  return (
    <main className="min-h-screen bg-[#F8F1E7] px-4 py-5 text-[#2B2B2B] sm:px-5">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
        <div className="lg:sticky lg:top-5 lg:self-start">
          <AdminSidebar />
        </div>

        <section className="min-w-0">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-[#D8D0C3] bg-white p-5 shadow-sm sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-[#D96C2C] sm:text-sm">
                Admin Panel
              </p>

              <h1 className="mt-2 text-2xl font-black leading-tight text-[#25382B] sm:text-3xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#555]">
                Monitor orders, sales, packs sold, and commission.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
              className="w-full rounded-full bg-[#D96C2C] px-5 py-3 text-sm font-black text-white transition hover:opacity-90 sm:w-auto"
            >
              Refresh Orders
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map(([label, value]) => (
              <div
                key={label}
                className="min-w-0 rounded-[1.5rem] border border-[#D8D0C3] bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-bold text-[#555]">{label}</p>
                <p className="mt-3 break-words text-2xl font-black text-[#25382B] sm:text-3xl">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              placeholder="Search order/customer..."
              className="w-full rounded-2xl border border-[#D8D0C3] bg-white px-4 py-3 text-sm outline-none sm:col-span-2"
            />

            <select className="w-full rounded-2xl border border-[#D8D0C3] bg-white px-4 py-3 text-sm outline-none">
              <option>All Payment Status</option>
              <option>Pending</option>
              <option>Paid</option>
              <option>COD</option>
            </select>

            <select className="w-full rounded-2xl border border-[#D8D0C3] bg-white px-4 py-3 text-sm outline-none">
              <option>All Order Status</option>
              <option>New Order</option>
              <option>Confirmed</option>
              <option>Preparing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div className="mt-5 min-w-0">
            {loading ? (
              <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-8 text-center shadow-sm">
                <p className="font-black text-[#25382B]">Loading orders...</p>
              </div>
            ) : (
              <OrderTable orders={orders} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;