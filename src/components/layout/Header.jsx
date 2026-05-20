import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#D8D0C3] bg-[#F8F1E7]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#25382B]/20 bg-white text-xs font-black text-[#25382B]">
            PG
          </div>

          <div>
            <p className="text-sm font-black leading-none text-[#25382B]">
              PURE GRIND
            </p>
            <p className="text-xs font-semibold text-[#2B2B2B]/70">
              PROTEIN CHIPS
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#2B2B2B] md:flex">
          <a href="/#benefits">Benefits</a>
          <a href="/#nutrition">Nutrition</a>
          <a href="/#flavors">Flavors</a>
          <a href="/#how-to-order">How to Order</a>
          <a href="/#faq">FAQ</a>
           <a href="/track-order">Track Order</a>

        </nav>

        <Link
          to="/order"
          className="rounded-full bg-[#D96C2C] px-5 py-2 text-sm font-black text-white shadow-sm transition hover:opacity-90"
        >
          Order Now
        </Link>
      </div>
    </header>
  );
}

export default Header;