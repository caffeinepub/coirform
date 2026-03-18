import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { CartItem } from "../App";

interface CartDrawerProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  items,
  total,
  onClose,
  onRemove,
  onUpdateQty,
  onCheckout,
}: CartDrawerProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-card-lg flex flex-col"
        data-ocid="cart.panel"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-eco-green" />
            <h2 className="text-lg font-bold text-foreground">Your Cart</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-ocid="cart.close_button"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <AnimatePresence>
            {items.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="cart.empty_state"
              >
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-3 p-3 rounded-xl border border-border bg-card"
                  data-ocid={`cart.item.${i + 1}`}
                >
                  <div
                    className="w-14 h-14 rounded-lg flex-shrink-0 border border-border/40"
                    style={{ background: item.color.hex }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {item.phoneModel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.color.name} · {item.texture.name} ·{" "}
                      {item.pattern.name}
                    </p>
                    {item.aiSuggestionUsed && (
                      <span className="text-[9px] font-bold bg-eco-green/10 text-eco-green px-1.5 py-0.5 rounded-full">
                        AI Design
                      </span>
                    )}
                    <p className="text-sm font-bold text-foreground mt-1">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove item"
                      data-ocid={`cart.delete_button.${i + 1}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-xl font-bold text-foreground">
                ₹{total}
              </span>
            </div>
            <Button
              className="w-full rounded-full bg-eco-green text-white font-bold py-6 hover:bg-eco-green/90"
              onClick={onCheckout}
              data-ocid="cart.checkout_button"
            >
              Checkout
            </Button>
          </div>
        )}
      </motion.aside>
    </>
  );
}
