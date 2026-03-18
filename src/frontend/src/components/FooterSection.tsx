import { Leaf } from "lucide-react";
import { SiInstagram, SiPinterest, SiX } from "react-icons/si";

export default function FooterSection() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-eco-dark text-eco-dark-fg py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-eco-green" />
              <span className="font-bold text-lg tracking-widest uppercase text-white">
                Coirform
              </span>
            </div>
            <p className="text-sm text-eco-dark-fg/70 leading-relaxed">
              Biodegradable phone cases, designed by you. Crafted for the
              planet.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-eco-dark-fg/50 mb-3">
              Shop
            </p>
            <ul className="space-y-2 text-sm text-eco-dark-fg/80">
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  All Cases
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  Custom Studio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  AI Designer
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-eco-dark-fg/50 mb-3">
              Company
            </p>
            <ul className="space-y-2 text-sm text-eco-dark-fg/80">
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  Sustainability
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-eco-dark-fg/50 mb-3">
              Support
            </p>
            <ul className="space-y-2 text-sm text-eco-dark-fg/80">
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  Shipping
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  Returns
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              aria-label="Instagram"
            >
              <SiInstagram className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              aria-label="X"
            >
              <SiX className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              aria-label="Pinterest"
            >
              <SiPinterest className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-eco-dark-fg/50 text-center">
            © {year}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              className="underline hover:text-eco-dark-fg/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
