import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import StatusBadge from "../components/ui/StatusBadge";
import { supabase } from "../lib/supabaseClient";

function TrackOrder() {
  const [formData, setFormData] = useState({
    orderNumber: "",
    phone: "",
  });

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setOrder(null);

    if (!formData.orderNumber || !formData.phone) {
      setMessage("Please enter your order number and phone number.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.rpc("track_order", {
      p_order_number: formData.orderNumber.trim(),
      p_phone: formData.phone.trim(),
    });

    setLoading(false);

    if (error) {
      console.error("Track order error:", error);
      setMessage(`Failed to track order: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      setMessage("No order found. Please check your order number and phone number.");
      return;
    }

    setOrder(data[0]);
  }

  function formatPeso(amount) {
    return `₱${Number(amount || 0).toFixed(2)}`;
  }

  function formatDate(dateValue) {
    if (!dateValue) return "N/A";

    return new Date(dateValue).toLocaleString("en-PH", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="min-h-screen bg-[#F8F1E7] text-[#2B2B2B]">
      <Header />

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
            Track Your Order
          </p>

          <h1 className="mt-3 text-4xl font-black text-[#25382B] md:text-5xl">
            Check your Pure Grind order status
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#555]">
            Enter your order number and phone number to see your latest order
            status.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-[4xl] border border-[#D8D0C3] bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-black text-[#25382B]">
                Order Number
              </label>

              <input
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleChange}
                placeholder="Example: PG-2026-123456"
                className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-black text-[#25382B]">
                Phone Number
              </label>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Example: 09XXXXXXXXX"
                className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
              />
            </div>

            {message && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#D96C2C] px-6 py-4 font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Checking Order..." : "Track Order"}
            </button>
          </form>
        </div>

        {order && (
          <div className="mx-auto mt-8 max-w-4xl rounded-[4xl] border border-[#D8D0C3] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
                  Order Found
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#25382B]">
                  {order.order_number}
                </h2>

                <p className="mt-1 text-sm text-[#555]">
                  Ordered on {formatDate(order.created_at)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusBadge status={order.payment_status} />
                <StatusBadge status={order.order_status} />
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <InfoBox title="Order Status">
                <Detail label="Payment Status" value={order.payment_status} />
                <Detail label="Order Status" value={order.order_status} />
                <Detail
                  label="Delivery Option"
                  value={order.delivery_option || "To be confirmed"}
                />
              </InfoBox>

              <InfoBox title="Order Summary">
                <Detail label="Product" value={order.product_name} />
                <Detail label="Flavor" value={order.flavor} />
                <Detail label="Quantity" value={`${order.quantity} pack(s)`} />
                <Detail label="Subtotal" value={formatPeso(order.subtotal)} />
              </InfoBox>
            </div>

            <div className="mt-6 rounded-2xl bg-[#F8F1E7] p-4 text-sm leading-6 text-[#555]">
              For delivery updates or concerns, message Pure Grind PH using the
              contact details on the website.
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

function InfoBox({ title, children }) {
  return (
    <div className="rounded-[3xl] bg-[#F8F1E7] p-5">
      <h3 className="font-black text-[#25382B]">{title}</h3>
      <div className="mt-4 space-y-3 text-sm">{children}</div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <p className="wrap-break-words leading-6">
      <span className="font-black text-[#25382B]">{label}:</span>{" "}
      <span className="text-[#555]">{value}</span>
    </p>
  );
}

export default TrackOrder;