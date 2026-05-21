import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { brand, paymentDetails, product } from "../../lib/constants";
import { supabase } from "../../lib/supabaseClient";
import OrderSummary from "./OrderSummary";

function OrderForm() {
  const navigate = useNavigate();

  const [flavor, setFlavor] = useState(product.flavors[0]);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("GCash");
  const [deliveryOption, setDeliveryOption] = useState("Lalamove / Grab / Toktok");
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    landmark: "",
    notes: "",
  });

  const subtotal = quantity * brand.pricePerPack;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function increaseQuantity() {
    setQuantity((prev) => prev + 1);
  }

  function decreaseQuantity() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      setSubmitError("Please complete your name, phone number, address, and city.");
      return;
    }

    if (paymentMethod !== "COD" && !proofOfPayment) {
      alert("Please upload your proof of payment for GCash, Maya, or Bank Transfer.");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderNumber = `PG-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      let proofOfPaymentUrl = null;

      if (paymentMethod !== "COD" && proofOfPayment) {
        const fileExt = proofOfPayment.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        const filePath = `proofs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("payment-proofs")
          .upload(filePath, proofOfPayment, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Proof upload error:", uploadError);
          alert(`Proof of payment upload failed: ${uploadError.message}`);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("payment-proofs")
          .getPublicUrl(filePath);

        proofOfPaymentUrl = publicUrlData.publicUrl;
      }

      const newOrder = {
          order_number: orderNumber,
          flavor,
          quantity,
          payment_method: paymentMethod,
          delivery_option: deliveryOption,
          proof_of_payment_url: proofOfPaymentUrl,
          customer_name: formData.fullName,
          phone: formData.phone,
          email: formData.email || null,
          address: formData.address,
          city: formData.city,
          landmark: formData.landmark || null,
          notes: formData.notes || null,
        };

      const { error } = await supabase
        .from("orders")
        .insert([newOrder]);

      console.log("New order payload:", newOrder);
      console.log("Insert error:", error);

      if (error) {
        setSubmitError(`Order failed: ${error.message}`);
        return;
      }

      localStorage.setItem(
        "latestOrder",
        JSON.stringify({
          ...newOrder,
          product_name: brand.name,
          price_per_pack: brand.pricePerPack,
          subtotal,
          payment_status: paymentMethod === "COD" ? "COD" : "Pending",
          order_status: "New Order",
          created_at: new Date().toISOString(),
        })
      );

      navigate("/thank-you");
    } catch (err) {
      console.error("Unexpected order error:", err);
        setSubmitError(`Something went wrong: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
              Purchase Options
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-black text-[#25382B]">
                  Select Flavor
                </label>

                <select
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
                >
                  {product.flavors.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-black text-[#25382B]">
                  Quantity
                </label>

                <div className="mt-2 flex items-center overflow-hidden rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7]">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="h-12 w-14 text-xl font-black text-[#25382B]"
                  >
                    −
                  </button>

                  <div className="flex-1 text-center font-black text-[#25382B]">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="h-12 w-14 text-xl font-black text-[#25382B]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#DDE8D2] p-4 text-sm leading-6 text-[#25382B]">
              Free delivery may apply for orders of{" "}
              <strong>12 packs and above</strong>. Current delivery area:{" "}
              <strong>Metro Manila</strong>.
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
              Customer Information
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-black text-[#25382B]">
                  Full Name
                </label>

                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="text-sm font-black text-[#25382B]">
                  Contact Number
                </label>

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
                  placeholder="09XXXXXXXXX"
                />
              </div>

              <div>
                <label className="text-sm font-black text-[#25382B]">
                  Email Address{" "}
                  <span className="font-normal text-[#777]">(optional)</span>
                </label>

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-black text-[#25382B]">
                  City / Area
                </label>

                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
                  placeholder="Example: Quezon City"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-black text-[#25382B]">
                  Complete Address
                </label>

                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
                  placeholder="House no., street, barangay"
                />
              </div>

              <div>
                <label className="text-sm font-black text-[#25382B]">
                  Landmark{" "}
                  <span className="font-normal text-[#777]">(optional)</span>
                </label>

                <input
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
                  placeholder="Near..."
                />
              </div>

              <div>
                <label className="text-sm font-black text-[#25382B]">
                  Delivery Option
                </label>

                <select
                  value={deliveryOption}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
                >
                  <option>Lalamove / Grab / Toktok</option>
                  <option>Shipping courier</option>
                  <option>Customer will book rider</option>
                  <option>To be confirmed by owner</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-black text-[#25382B]">
                  Order Notes{" "}
                  <span className="font-normal text-[#777]">(optional)</span>
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
                  placeholder="Example: mixed flavors, delivery instructions, preferred time..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
              Payment Method
            </p>

            <div className="mt-6 grid gap-3">
              {["GCash", "Maya", "Bank Transfer", "COD"].map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 ${
                    paymentMethod === method
                      ? "border-[#25382B] bg-[#DDE8D2]"
                      : "border-[#D8D0C3] bg-[#F8F1E7]"
                  }`}
                >
                  <span className="font-black text-[#25382B]">{method}</span>

                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                </label>
              ))}
            </div>

            {paymentMethod !== "COD" && (
              <div className="mt-6">
                <label className="text-sm font-black text-[#25382B]">
                  Upload Proof of Payment
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProofOfPayment(e.target.files[0])}
                  className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
                />

                <p className="mt-2 text-xs leading-5 text-[#555]">
                  Required for GCash, Maya, and Bank Transfer.
                </p>
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-[#F8F1E7] p-4 text-sm leading-6 text-[#555]">
              {paymentMethod === "GCash" && (
                <div>
                  <p className="font-black text-[#25382B]">GCash Payment Details</p>
                  <p>Name: {paymentDetails.gcash.name}</p>
                  <p>Number: {paymentDetails.gcash.number}</p>
                </div>
              )}

              {paymentMethod === "Maya" && (
                <div>
                  <p className="font-black text-[#25382B]">Maya Payment Details</p>
                  <p>Name: {paymentDetails.maya.name}</p>
                  <p>Number: {paymentDetails.maya.number}</p>
                </div>
              )}

              {paymentMethod === "Bank Transfer" && (
                <div>
                  <p className="font-black text-[#25382B]">Bank Transfer Details</p>
                  <p>Bank: {paymentDetails.bank.bankName}</p>
                  <p>Account Name: {paymentDetails.bank.accountName}</p>
                  <p>Account Number: {paymentDetails.bank.accountNumber}</p>
                </div>
              )}

              {paymentMethod === "COD" && (
                <div>
                  <p className="font-black text-[#25382B]">Cash on Delivery</p>
                  <p>The owner will confirm if COD is available for your area.</p>
                </div>
              )}
            </div>

              {submitError && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
                  {submitError}
                </div>
              )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 w-full rounded-full bg-[#D96C2C] px-7 py-4 font-black text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting Order..." : "Place Order"}
            </button>
          </div>
        </div>

        <OrderSummary
          flavor={flavor}
          quantity={quantity}
          paymentMethod={paymentMethod}
        />
      </form>
    </section>
  );
}

export default OrderForm;