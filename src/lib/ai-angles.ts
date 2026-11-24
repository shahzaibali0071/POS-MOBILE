// AI views generated from one real product photo. Kontext-style models edit a reference
// image, so the product stays recognisably the same; every result still needs a human check.

export const AI_MODEL = "bfl/flux-kontext-pro";
export const AI_COST_USD_PER_IMAGE = 0.04;

const KEEP = "Keep the exact same product: identical shape, colours, buttons, ports, logo and text. Do not add or remove any part.";

export const AI_ANGLES = [
  {
    id: "side",
    label: "Side angle",
    prompt: `Professional e-commerce photo of this product turned to a 45 degree side angle, on a pure white studio background with a soft shadow. ${KEEP}`,
  },
  {
    id: "studio",
    label: "Clean studio",
    prompt: `Professional e-commerce photo of this product, front view, centred on a pure white studio background, bright even lighting, soft shadow. ${KEEP}`,
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    prompt: `Lifestyle photo of this product placed on a modern wooden desk next to a laptop, natural daylight, shallow depth of field. ${KEEP}`,
  },
] as const;
