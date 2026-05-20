import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function ThankYou() {
  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedOrder = localStorage.getItem("latestOrder");

    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  function copyOrderNumber() {
    if (!order?.order_number) return;

    navigator.clipboard.writeText(order.order_number);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-[#F8F1E7] text-[#2B2B2B]">
      <Header />

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#DDE8D2] text-4xl">
            ✓
          </div>

          <h1 className="mt-6 text-4xl font-black text-[#25382B]">
            Thank you! Your order has been submitted.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#555]">
            We received your order details. The owner will review your payment
            and delivery details before confirming your order.
          </p>

          <div className="mt-6 inline-flex rounded-full bg-[#F8F1E7] px-5 py-2 text-sm font-black text-[#25382B]">
            Order Status: Pending Confirmation
          </div>

          {order?.order_number && (
            <div className="mx-auto mt-8 max-w-xl rounded-[1.5rem] border border-[#D8D0C3] bg-[#F8F1E7] p-5">
              <p className="text-sm font-bold text-[#555]">
                Your Tracking / Order Number
              </p>

              <p className="mt-2 break-words text-3xl font-black text-[#25382B]">
                {order.order_number}
              </p>

              <p className="mt-3 text-sm leading-6 text-[#555]">
                Save this order number. You will need this together with your
                phone number to track your order status.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={copyOrderNumber}
                  className="rounded-full border border-[#25382B] px-6 py-3 text-sm font-black text-[#25382B]"
                >
                  {copied ? "Copied!" : "Copy Order Number"}
                </button>

                <Link
                  to="/track-order"
                  className="rounded-full bg-[#D96C2C] px-6 py-3 text-sm font-black text-white"
                >
                  Track My Order
                </Link>
              </div>
            </div>
          )}
        </div>

        {order && (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
                Order Summary
              </p>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[#555]">Product</span>
                  <span className="text-right font-bold text-[#25382B]">
                    {order.product_name || "Pure Grind Protein Chips"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#555]">Flavor</span>
                  <span className="font-bold text-[#25382B]">
                    {order.flavor || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#555]">Quantity</span>
                  <span className="font-bold text-[#25382B]">
                    {order.quantity || 0} pack(s)
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#555]">Payment Method</span>
                  <span className="font-bold text-[#25382B]">
                    {order.payment_method || "N/A"}
                  </span>
                </div>

                <div className="border-t border-[#D8D0C3] pt-4">
                  <div className="flex justify-between gap-4">
                    <span className="font-black text-[#25382B]">Subtotal</span>
                    <span className="text-2xl font-black text-[#D96C2C]">
                      ₱{Number(order.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[4xl] border border-[#D8D0C3] bg-white p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
                What Happens Next?
              </p>

              <div className="mt-6 space-y-4 text-sm leading-6 text-[#555]">
                <p>1. Owner will review your order.</p>
                <p>2. Payment/proof of payment will be checked.</p>
                <p>3. Delivery fee and schedule will be confirmed.</p>
                <p>4. Once confirmed, your order will be prepared.</p>
                <p>5. You can track your order using your order number and phone number.</p>
              </div>

              <div className="mt-6  grid gap-3 sm:grid-cols-3">
                <Link
                  to="/order"
                  className="rounded-full bg-[#D96C2C] px-2 py-2 text-center font-black text-white"
                >
                  Order Again
                </Link>

                <Link
                  to="/track-order"
                  className="rounded-full  border border-[#D96C2C] px-2 py-2 text-center font-black text-[#D96C2C]"
                >
                  Track Order
                </Link>

                <Link
                  to="/"
                  className="rounded-full border border-[#25382B] px-2 py-2 text-center font-black text-[#25382B]"
                >
                  Back Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

export default ThankYou;