import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, CreditCard, Loader2, Package, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  CartItem,
  ColorOption,
  PatternOption,
  TextureOption,
} from "../App";
import { useCreateCheckoutSession, useCreateOrder } from "../hooks/useQueries";

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

type PaymentMethod = "card" | "cod" | null;

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: createOrder, isPending: isOrderPending } = useCreateOrder();
  const { mutate: createCheckoutSession, isPending: isCheckoutPending } =
    useCreateCheckoutSession();

  function validate(requireAddress: boolean) {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim() || !form.email.includes("@"))
      errs.email = "Valid email required";
    if (requireAddress) {
      if (!form.phone.trim()) errs.phone = "Phone number required";
      if (!form.address.trim()) errs.address = "Shipping address required";
    }
    return errs;
  }

  function handleCODSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(true);
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

  function handleCardPayment() {
    const errs = validate(false);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const shoppingItems = items.map((item) => ({
      productName: `${item.color.name} ${item.texture.name}`,
      productDescription: item.phoneModel,
      priceInCents: BigInt(item.price * 100),
      quantity: BigInt(item.quantity),
      currency: "inr",
    }));

    const base = window.location.origin + window.location.pathname;
    const successUrl = `${base}?payment=success`;
    const cancelUrl = `${base}?payment=cancelled`;

    createCheckoutSession(
      { items: shoppingItems, successUrl, cancelUrl },
      {
        onSuccess: (sessionUrl) => {
          window.location.href = sessionUrl;
        },
        onError: () => {
          toast.error("Failed to create payment session. Please try again.");
        },
      },
    );
  }

  const isPending = isOrderPending || isCheckoutPending;

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
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {/* Order Summary */}
                  <div className="rounded-xl bg-muted/40 p-4">
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

                  {/* Payment Method Selection */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      Payment Method
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === "card"
                            ? "border-eco-green bg-eco-green/10 text-eco-green"
                            : "border-border text-muted-foreground hover:border-eco-green/50"
                        }`}
                        data-ocid="order.card_toggle"
                      >
                        <CreditCard className="w-5 h-5" />
                        <span className="text-xs font-semibold">
                          Pay with Card
                        </span>
                        <span className="text-[10px] opacity-70">
                          Visa, Mastercard, UPI
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === "cod"
                            ? "border-eco-green bg-eco-green/10 text-eco-green"
                            : "border-border text-muted-foreground hover:border-eco-green/50"
                        }`}
                        data-ocid="order.cod_toggle"
                      >
                        <Package className="w-5 h-5" />
                        <span className="text-xs font-semibold">
                          Cash on Delivery
                        </span>
                        <span className="text-[10px] opacity-70">
                          Pay when delivered
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Form fields — shown once payment method is selected */}
                  <AnimatePresence>
                    {paymentMethod && (
                      <motion.form
                        key="order-form"
                        onSubmit={handleCODSubmit}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
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
                                setForm((p) => ({
                                  ...p,
                                  email: e.target.value,
                                }))
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

                        {/* COD-only fields */}
                        {paymentMethod === "cod" && (
                          <>
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
                                  setForm((p) => ({
                                    ...p,
                                    phone: e.target.value,
                                  }))
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
                                  setForm((p) => ({
                                    ...p,
                                    address: e.target.value,
                                  }))
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
                          </>
                        )}

                        {/* Action button based on payment method */}
                        {paymentMethod === "card" ? (
                          <Button
                            type="button"
                            onClick={handleCardPayment}
                            className="w-full rounded-full bg-eco-green text-white font-bold py-6 hover:bg-eco-green/90"
                            disabled={isPending}
                            data-ocid="order.submit_button"
                          >
                            {isCheckoutPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Redirecting to Payment...
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Pay ₹{total} with Card
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="w-full rounded-full bg-eco-green text-white font-bold py-6 hover:bg-eco-green/90"
                            disabled={isPending}
                            data-ocid="order.submit_button"
                          >
                            {isOrderPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                                Placing Order...
                              </>
                            ) : (
                              <>
                                <Package className="w-4 h-4 mr-2" />
                                Place COD Order — ₹{total}
                              </>
                            )}
                          </Button>
                        )}
                      </motion.form>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}
