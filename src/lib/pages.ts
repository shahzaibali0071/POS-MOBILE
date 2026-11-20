import { formatPrice, FREE_SHIPPING_MIN, SHIPPING_FEE } from "./catalog";

// Static info pages. Placeholder copy: replace with the store's real policies before launch.
export const infoPages: Record<string, { title: string; body: string[] }> = {
  about: {
    title: "About Voltix",
    body: [
      "Voltix makes everyday tech accessories: earbuds, headphones, smart watches, chargers and power banks, designed for daily use and backed by a local warranty.",
      "We sell directly to you, so prices stay fair and support stays close.",
    ],
  },
  contact: {
    title: "Contact Us",
    body: [
      "Customer care is available Monday to Saturday, 10am to 7pm.",
      "Phone and email details will be added here once the store goes live.",
    ],
  },
  warranty: {
    title: "Warranty Policy",
    body: [
      "All products carry a 1 year warranty against manufacturing defects from the date of delivery.",
      "Physical damage, water damage beyond the stated rating and unauthorised repairs are not covered.",
    ],
  },
  shipping: {
    title: "Shipping Policy",
    body: [
      "Orders are dispatched within 24 hours on working days and usually arrive in 2 to 5 working days.",
      `Delivery is free on orders over ${formatPrice(FREE_SHIPPING_MIN)}. A flat ${formatPrice(SHIPPING_FEE)} fee applies below that.`,
    ],
  },
  returns: {
    title: "Exchange and Refund Policy",
    body: [
      "Unused products in original packaging can be returned within 7 days of delivery.",
      "Defective items are replaced free of charge after inspection.",
    ],
  },
  payments: {
    title: "Modes of Payment",
    body: ["We accept cash on delivery, JazzCash, Easypaisa, bank transfer and debit or credit cards."],
  },
  privacy: {
    title: "Privacy Policy",
    body: ["We collect only the details needed to process and deliver your order, and never sell your data."],
  },
  terms: {
    title: "Terms and Conditions",
    body: ["By placing an order you agree to our pricing, shipping, warranty and return policies listed on this site."],
  },
  corporate: {
    title: "Corporate Orders",
    body: ["Bulk pricing and custom branding are available for corporate gifting. Contact us with your quantity and timeline."],
  },
};
