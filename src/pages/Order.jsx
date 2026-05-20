import Footer from "../components/layout/Footer"
import Header from "../components/layout/Header"
import OrderForm from "../components/order/OrderForm"
import { brand, product } from "../lib/constants"
import productImage from "../assets/product-order.png"


const Order = () => {
  return (
    <main className="min-h-screen bg-[#F8F1E7] text-[#2B2B2B]">
      <Header />

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[0.9fr_1fr_0.75fr] lg:items-start">
        <div className="rounded-xl border border-[#D8D0C3] bg-white p-6 shadow-sm">
           <img
              src={productImage}
              alt="Pure Grind Protein Chips"
              className="max-h-full object-contain drop-shadow-xl"
            />
        </div>

        <div>
          <p className="mb-3 inline-flex rounded-full bg-[#DDE8D2] px-4 py-2 text-sm font-black text-[#25382B]">
            Product Details
          </p>

          <h1 className="text-4xl font-black leading-tight text-[#25382B] md:text-5xl">
            {brand.name}
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-[#555]">
            Pure Grind Protein Chips is a high-protein snack made for people who
            want a tasty and convenient alternative to regular chips.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              [`${product.protein} Protein`, "per pack"],
              [`${product.calories} Calories`, "per pack"],
              [`${product.fat} Fat`, "per pack"],
              [`${product.carbs} Carbs`, "per pack"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-[#D8D0C3] bg-white p-5 shadow-sm"
              >
                <p className="text-xl font-black text-[#25382B]">{title}</p>
                <p className="mt-1 text-sm text-[#555]">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
            Price
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#25382B]">
            ₱{brand.pricePerPack}
          </h2>
          <p className="text-sm text-[#555]">per pack</p>

          <div className="mt-6 space-y-3 text-sm">
            <p>✓ {product.packSize} per pack</p>
            <p>✓ {product.protein} protein</p>
            <p>✓ {product.flavors.length} flavors available</p>
            <p>✓ Metro Manila delivery</p>
          </div>
        </div>
      </section>

      <OrderForm />

      <Footer />
    </main>
  )
}

export default Order
