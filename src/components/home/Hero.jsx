import { Link } from "react-router-dom";
import { brand, product } from "../../lib/constants";
import productImage from "../../assets/product.png";
import bgDesktop from "../../assets/bg.png";
import bgMobile from "../../assets/bg-mobile.png";

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100vh-84px)] overflow-hidden px-5 py-16 sm:py-20 lg:py-24">
      {/* Background images */}
      <div className="absolute inset-0">
        <img
          src={bgMobile}
          alt=""
          className="h-full w-full object-cover object-center md:hidden"
        />

        <img
          src={bgDesktop}
          alt=""
          className="hidden h-full w-full object-cover object-center md:block"
        />

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-[#F8F1E7]/55 md:bg-[#F8F1E7]/25" />

        <div className="absolute inset-0 bg-linear-to-b from-[#F8F1E7]/35 via-[#F8F1E7]/35 to-[#F8F1E7]/75 md:bg-linear-to-r md:from-[#F8F1E7]/75 md:via-[#F8F1E7]/35 md:to-transparent" />
      </div>

      <div className="relative z-10  mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          

          <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-[#25382B] sm:text-6xl lg:text-7xl">
            Crunch. <br />
            Fuel. <br />
            Grind.
          </h1>

          <p className="mt-5 text-lg font-bold text-[#D96C2C]">
            {brand.tagline}
          </p>

          <p className="mt-5 max-w-xl text-base leading-7 text-[#3F3F3F]">
            Crunchy, tasty, and packed with {product.protein} protein per pack.
            A smarter snack choice for gym-goers, busy people, and anyone who
            wants a better alternative to regular chips.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/order"
              className="rounded-full bg-[#D96C2C] px-7 py-3 text-center font-black text-white shadow-sm transition hover:opacity-90"
            >
              Order Now
            </Link>

            <a
              href="#flavors"
              className="rounded-full border border-[#25382B] px-7 py-3 text-center font-black text-[#25382B] transition hover:bg-[#25382B] hover:text-white"
            >
              View Flavors
            </a>
          </div>

        
        </div>

        <div className="relative flex items-center justify-center lg:min-h-[620px]">
          <div className="absolute h-[300px] w-[300px] rounded-full bg-[#DDE8D2]/70 blur-3xl sm:h-[380px] sm:w-[380px] md:h-[480px] md:w-[480px]" />

          <div className="absolute hidden h-[420px] w-[420px] rounded-full border border-white/50 md:block md:h-[560px] md:w-[560px]" />

          <div className="absolute hidden h-[300px] w-[300px] rounded-full border border-[#D96C2C]/20 md:block md:h-[430px] md:w-[430px]" />

          <div className="product-float relative z-10">
            <div className="relative">
              <img
                src={productImage}
                alt="Pure Grind Protein Chips"
                className="relative z-10 mx-auto max-h-[430px] w-full object-contain drop-shadow-[0_35px_45px_rgba(37,56,43,0.35)] transition duration-500 hover:scale-105 hover:rotate-2 sm:max-h-[500px] md:max-h-[560px] lg:max-h-[620px]"
              />

              <div className="absolute -bottom-6 left-1/2 h-10 w-56 -translate-x-1/2 rounded-full bg-[#25382B]/25 blur-2xl sm:w-72 md:w-80" />
            </div>
          </div>

          <div className="absolute right-8 top-20 hidden h-5 w-5 rounded-full bg-[#D96C2C] shadow-lg md:block" />
          <div className="absolute bottom-28 left-10 hidden h-4 w-4 rotate-45 rounded-sm bg-[#D96C2C]/70 shadow-lg md:block" />
          <div className="absolute right-20 bottom-20 hidden h-3 w-3 rounded-full bg-[#25382B]/70 md:block" />
        </div>
      </div>
    </section>
  );
};

export default Hero;