import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { brand } from "../lib/constants";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchOrder() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Fetch order error:", error);
      alert(`Failed to fetch order: ${error.message}`);
      setLoading(false);
      return;
    }

    setOrder(data);
    setLoading(false);
  }

  async function updateOrderStatus(field, value) {
    setSaving(true);

    const { data, error } = await supabase
      .from("orders")
      .update({ [field]: value })
      .eq("id", id)
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error("Update order error:", error);
      alert(`Failed to update order: ${error.message}`);
      return;
    }

    setOrder(data);
  }

  useEffect(() => {
    async function checkSessionAndFetchOrder() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    navigate("/admin/login");
    return;
  }

  fetchOrder();
}

checkSessionAndFetchOrder();
  }, [id, navigate]);

  function getCommission() {
    if (!order) return 0;

    const subtotal = Number(order.subtotal || 0);

    if (order.payment_status === "Paid" && order.order_status !== "Cancelled") {
      return subtotal * brand.commissionRate;
    }

    if (order.payment_status === "COD" && order.order_status === "Delivered") {
      return subtotal * brand.commissionRate;
    }

    return 0;
  }

  function formatPeso(amount) {
    return `₱${Number(amount || 0).toFixed(2)}`;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F1E7] p-4">
        <div className="w-full max-w-md rounded-[2rem] border border-[#D8D0C3] bg-white p-6 text-center shadow-sm">
          <p className="font-black text-[#25382B]">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F1E7] p-4">
        <div className="w-full max-w-md rounded-[2rem] border border-[#D8D0C3] bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-black text-[#25382B] md:text-3xl">
            Order not found
          </h1>

          <Link
            to="/admin/dashboard"
            className="mt-6 inline-flex w-full justify-center rounded-full bg-[#D96C2C] px-6 py-3 font-black text-white sm:w-auto"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const commission = getCommission();

  return (
    <main className="min-h-screen bg-[#F8F1E7] px-4 py-5 text-[#2B2B2B] sm:px-5">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <Link
              to="/admin/dashboard"
              className="inline-flex rounded-full border border-[#25382B] px-5 py-2 text-sm font-black text-[#25382B]"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-6 text-2xl font-black text-[#25382B] sm:text-3xl">
              Order Details
            </h1>

            <p className="mt-1 break-words text-sm text-[#555]">
              Order No:{" "}
              <span className="font-black text-[#25382B]">
                {order.order_number}
              </span>
            </p>
          </div>

          <div className="w-fit rounded-full bg-white px-5 py-3 text-sm font-black text-[#25382B] shadow-sm">
            {saving ? "Saving changes..." : "Ready"}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-black uppercase tracking-widest text-[#D96C2C] sm:text-sm">
                Status Controls
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-black text-[#25382B]">
                    Payment Status
                  </label>

                  <select
                    value={order.payment_status}
                    onChange={(e) =>
                      updateOrderStatus("payment_status", e.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
                  >
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>COD</option>
                    <option>Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-black text-[#25382B]">
                    Order Status
                  </label>

                  <select
                    value={order.order_status}
                    onChange={(e) =>
                      updateOrderStatus("order_status", e.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
                  >
                    <option>New Order</option>
                    <option>Confirmed</option>
                    <option>Preparing</option>
                    <option>Shipped / Out for Delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard title="Customer Information">
                <Detail label="Name" value={order.customer_name} />
                <Detail label="Phone" value={order.phone} />
                <Detail label="Email" value={order.email || "N/A"} />
                <Detail label="Address" value={order.address} />
                <Detail label="City" value={order.city} />
                <Detail label="Landmark" value={order.landmark || "N/A"} />
              </InfoCard>

              <InfoCard title="Product Details">
                <Detail label="Product" value={order.product_name} />
                <Detail label="Flavor" value={order.flavor} />
                <Detail label="Quantity" value={`${order.quantity} pack(s)`} />
                <Detail
                  label="Price per pack"
                  value={formatPeso(order.price_per_pack)}
                />
                <Detail label="Subtotal" value={formatPeso(order.subtotal)} />
              </InfoCard>

             <InfoCard title="Payment Details">
                <Detail label="Payment Method" value={order.payment_method} />
                <Detail label="Payment Status" value={order.payment_status} />
                <ProofPreview url={order.proof_of_payment_url} />
             </InfoCard>

              <InfoCard title="Delivery Details">
                <Detail
                  label="Delivery Option"
                  value={order.delivery_option || "To be confirmed"}
                />
                <Detail
                  label="Delivery Fee"
                  value="Customer shoulders delivery fee"
                />
                <Detail label="Notes" value={order.notes || "N/A"} />
              </InfoCard>
            </div>
          </div>

          <aside className="min-w-0 space-y-6 lg:sticky lg:top-5 lg:self-start">
            <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-black uppercase tracking-widest text-[#D96C2C] sm:text-sm">
                Order Summary
              </p>

              <div className="mt-5 space-y-4 text-sm">
                <SummaryRow label="Subtotal" value={formatPeso(order.subtotal)} />
                <SummaryRow label="Payment" value={order.payment_status} />
                <SummaryRow label="Order" value={order.order_status} />

                <div className="border-t border-[#D8D0C3] pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-black text-[#25382B]">
                      Commission
                    </span>
                    <span className="text-xl font-black text-[#D96C2C] sm:text-2xl">
                      {formatPeso(commission)}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-[#555]">
                    Commission is counted only when payment is paid, or COD order
                    is delivered and confirmed.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-black uppercase tracking-widest text-[#D96C2C] sm:text-sm">
                Quick Actions
              </p>

              <div className="mt-5 grid gap-3">
                <button
                  onClick={() => updateOrderStatus("payment_status", "Paid")}
                  className="w-full rounded-full bg-[#25382B] px-5 py-3 text-sm font-black text-white"
                >
                  Mark as Paid
                </button>

                <button
                  onClick={() => updateOrderStatus("order_status", "Confirmed")}
                  className="w-full rounded-full bg-[#25382B] px-5 py-3 text-sm font-black text-white"
                >
                  Mark as Confirmed
                </button>

                <button
                  onClick={() => updateOrderStatus("order_status", "Preparing")}
                  className="w-full rounded-full bg-[#25382B] px-5 py-3 text-sm font-black text-white"
                >
                  Mark as Preparing
                </button>

                <button
                  onClick={() => updateOrderStatus("order_status", "Delivered")}
                  className="w-full rounded-full bg-[#25382B] px-5 py-3 text-sm font-black text-white"
                >
                  Mark as Delivered
                </button>

                <button
                  onClick={async () => {
                    await updateOrderStatus("payment_status", "Cancelled");
                    await updateOrderStatus("order_status", "Cancelled");
                  }}
                  className="w-full rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="min-w-0 rounded-[2rem] border border-[#D8D0C3] bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-black uppercase tracking-widest text-[#D96C2C] sm:text-sm">
        {title}
      </p>

      <div className="mt-5 space-y-3 text-sm">{children}</div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <p className="break-words leading-6">
      <span className="font-black text-[#25382B]">{label}:</span>{" "}
      <span className="text-[#555]">{value}</span>
    </p>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[#555]">{label}</span>
      <span className="break-words text-right font-black text-[#25382B]">
        {value}
      </span>
    </div>
  );
}

function ProofPreview({ url }) {
  if (!url) {
    return (
      <p className="break-words leading-6">
        <span className="font-black text-[#25382B]">Proof of Payment:</span>{" "}
        <span className="text-[#555]">N/A</span>
      </p>
    );
  }

  if (!url.startsWith("http")) {
    return (
      <p className="break-words leading-6">
        <span className="font-black text-[#25382B]">Proof of Payment:</span>{" "}
        <span className="text-[#555]">
          {url} — not uploaded to storage yet
        </span>
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="break-words leading-6">
        <span className="font-black text-[#25382B]">Proof of Payment:</span>{" "}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="font-bold text-[#D96C2C] underline"
        >
          Open full image
        </a>
      </p>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="block overflow-hidden rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7]"
      >
        <img
          src={url}
          alt="Proof of payment"
          className="max-h-[320px] w-full object-contain p-2"
        />
      </a>
    </div>
  );
}

export default OrderDetails;