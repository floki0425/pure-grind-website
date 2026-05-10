import Footer from "../components/layout/Footer"
import Header from "../components/layout/Header"


const Order = () => {
  return (
    <div>
         <main className="min-h-screen bg-[#F8F1E7] text-[#2B2B2B]">
      <Header />

      <section className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="text-4xl font-black text-[#25382B]">
          Order Pure Grind
        </h1>

        <p className="mt-4 max-w-2xl text-[#555]">
          Next step natin dito: flavor selection, quantity, customer details,
          payment method, proof of payment upload, and order summary.
        </p>
      </section>

      <Footer />
    </main>
    </div>
  )
}

export default Order
