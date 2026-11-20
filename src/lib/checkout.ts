export const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", note: "Pay in cash when your order arrives" },
  { id: "jazzcash", label: "JazzCash", note: "You will get payment instructions after ordering" },
  { id: "easypaisa", label: "Easypaisa", note: "You will get payment instructions after ordering" },
  { id: "card", label: "Debit / Credit Card", note: "Secure card payment (coming soon)" },
] as const;

export type PaymentId = (typeof PAYMENT_METHODS)[number]["id"];

export const CITIES = ["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Peshawar", "Faisalabad", "Multan", "Quetta", "Sialkot", "Hyderabad"];

export type CheckoutForm = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
  payment: PaymentId | "";
};

export type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;

/** Normalises Pakistani mobile numbers to 03XXXXXXXXX; returns null when invalid. */
export function normalizePkMobile(raw: string): string | null {
  const digits = raw.replace(/[\s\-()]/g, "");
  const m = /^(?:\+92|0092|92|0)?(3\d{9})$/.exec(digits);
  return m ? `0${m[1]}` : null;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateCheckout(f: CheckoutForm): CheckoutErrors {
  const e: CheckoutErrors = {};
  if (f.name.trim().length < 2) e.name = "Enter your full name.";
  if (!normalizePkMobile(f.phone)) e.phone = "Enter a valid mobile number, e.g. 0300 1234567.";
  if (f.email.trim() && !EMAIL.test(f.email.trim())) e.email = "Enter a valid email or leave it blank.";
  if (f.city.trim().length < 2) e.city = "Enter your city.";
  if (f.address.trim().length < 10) e.address = "Enter your full address with house, street and area.";
  if (!PAYMENT_METHODS.some((p) => p.id === f.payment)) e.payment = "Choose a payment method.";
  else if (f.payment === "card") e.payment = "Card payments are coming soon. Please choose another method.";
  return e;
}
