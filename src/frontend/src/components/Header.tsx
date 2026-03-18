import { Button } from "@/components/ui/button";
import { Leaf, Search, ShoppingBag, User } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onCartOpen: () => void;
}

export default function Header({ cartCount, onCartOpen }: HeaderProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-xs">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 font-bold text-xl tracking-widest uppercase text-foreground"
          onClick={() => scrollTo("customizer")}
        >
          <Leaf className="w-5 h-5 text-eco-green" />
          Coirform
        </button>

        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium"
          aria-label="Main navigation"
        >
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.link"
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => scrollTo("customizer")}
            className="text-eco-green font-semibold border-b-2 border-eco-green pb-0.5"
            data-ocid="nav.customizer_link"
          >
            Customizer
          </button>
          <button
            type="button"
            onClick={() => scrollTo("about")}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.about_link"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => scrollTo("how-it-works")}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.howitworks_link"
          >
            How It Works
          </button>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.faq_link"
          >
            FAQ
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            data-ocid="header.search_button"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Profile"
            data-ocid="header.profile_button"
          >
            <User className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onCartOpen}
            aria-label="Cart"
            data-ocid="header.cart_button"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-eco-green text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
