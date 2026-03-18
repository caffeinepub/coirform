import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  CartItem,
  ColorOption,
  PatternOption,
  TextureOption,
} from "../App";
import { useCreateOrder } from "../hooks/useQueries";

interface OrderModalProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
  orderSuccess: { id: string } | null;
  phoneModel: string;
  color: ColorOption;
  texture: TextureOption;
  pattern: PatternOption;
  selectedVibe: string | null;
}

export default function OrderModal({
  items,
  total,
  onClose,
  onSuccess,
  orderSuccess,
  phoneModel,
  color,
  texture,
  pattern,
  selectedVibe,
}: OrderModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: createOrder, isPending } = useCreateOrder();

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim() || !form.email.includes("@"))
      errs.email = "Valid email required";
    if (!form.phone.trim()) errs.phone = "Phone number required";
    if (!form.address.trim()) errs.address = "Shipping address required";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const firstItem = items[0];
    const usedColor = firstItem?.color ?? color;
    const usedTexture = firstItem?.texture ?? texture;
    const usedPattern = firstItem?.pattern ?? pattern;
    const usedVibe = firstItem?.vibe ?? selectedVibe;
    const aiUsed = firstItem?.aiSuggestionUsed ?? false;

    createOrder(
      {
        customerName: form.name,
        customerEmail: form.email,
        phone: form.phone,
        address: form.address,
        phoneModel,
        color: usedColor.id,
        texture: usedTexture.id,
        pattern: usedPattern.id,
        vibe: usedVibe,
        aiSuggestionUsed: aiUsed,
      },
      {
        onSuccess: (order) => {
          onSuccess(order.id);
        },
        onError: () => {
          toast.error("Failed to place order. Please try again.");
        },
      },
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        data-ocid="order.modal"
      >
        <div
          className="bg-background rounded-2xl shadow-card-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">
              {orderSuccess ? "Order Confirmed! 🎉" : "Place Your Order"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-ocid="order.close_button"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {orderSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                  data-ocid="order.success_state"
                >
                  <CheckCircle className="w-16 h-16 text-eco-green mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Order Placed!
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Order ID:{" "}
                    <span className="font-mono font-semibold text-foreground">
                      {orderSuccess.id.slice(0, 12)}...
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Your Coirform ships in <strong>5–7 business days</strong>.
                    We'll send a confirmation to your email.
                  </p>
                  <Button
                    className="mt-6 rounded-full bg-eco-green text-white"
                    onClick={onClose}
                    data-ocid="order.confirm_button"
                  >
                    Done
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Order Summary */}
                  <div className="rounded-xl bg-muted/40 p-4 mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      Order Summary
                    </p>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm mb-1"
                      >
                        <span className="text-foreground">
                          {item.phoneModel} — {item.color.name}{" "}
                          {item.texture.name}
                        </span>
                        <span className="font-semibold">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between font-bold text-base mt-2 pt-2 border-t border-border">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label
                        htmlFor="order-name"
                        className="text-xs font-semibold uppercase tracking-wide"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="order-name"
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Jane Smith"
                        className="mt-1"
                        data-ocid="order.name_input"
                      />
                      {errors.name && (
                        <p
                          className="text-xs text-destructive mt-1"
                          data-ocid="order.name_error"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="order-email"
                        className="text-xs font-semibold uppercase tracking-wide"
                      >
                        Email
                      </Label>
                      <Input
                        id="order-email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        placeholder="jane@example.com"
                        className="mt-1"
                        data-ocid="order.email_input"
                      />
                      {errors.email && (
                        <p
                          className="text-xs text-destructive mt-1"
                          data-ocid="order.email_error"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="order-phone"
                      className="text-xs font-semibold uppercase tracking-wide"
                    >
                      Phone
                    </Label>
                    <Input
                      id="order-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="+91 98765 43210"
                      className="mt-1"
                      data-ocid="order.phone_input"
                    />
                    {errors.phone && (
                      <p
                        className="text-xs text-destructive mt-1"
                        data-ocid="order.phone_error"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="order-address"
                      className="text-xs font-semibold uppercase tracking-wide"
                    >
                      Shipping Address
                    </Label>
                    <Textarea
                      id="order-address"
                      value={form.address}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, address: e.target.value }))
                      }
                      placeholder="123 Green St, Eco City, Mumbai 400001"
                      className="mt-1 resize-none"
                      rows={2}
                      data-ocid="order.address_textarea"
                    />
                    {errors.address && (
                      <p
                        className="text-xs text-destructive mt-1"
                        data-ocid="order.address_error"
                      >
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-full bg-eco-green text-white font-bold py-6 hover:bg-eco-green/90"
                    disabled={isPending}
                    data-ocid="order.submit_button"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Placing Order...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}
