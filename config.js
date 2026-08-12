/* ============================================================
   FRIEND POCKET — CENTRAL CONFIGURATION
   Edit this file to update business details, contact info,
   and demo loan parameters across the entire site.
   ============================================================ */

const FRIEND_POCKET_CONFIG = {
  demoMode: false,

  businessName: "Friend Pocket",
  tagline: "Simple. Transparent. Financial Support.",

  ownerName: "[NAME TO BE ADDED]",
  phone: "[PHONE NUMBER TO BE ADDED]",
  whatsapp: "", // digits only, e.g. "919999999999" — leave blank to disable link
  whatsappDisplay: "[WHATSAPP NUMBER TO BE ADDED]",
  email: "[EMAIL TO BE ADDED]",
  address: "[OFFICIAL ADDRESS TO BE ADDED]",
  city: "[CITY TO BE ADDED]",
  businessHours: "[BUSINESS HOURS TO BE ADDED]",

  registrationDetails: "[BUSINESS REGISTRATION DETAILS TO BE ADDED]",
  regulatoryDetails: "[REGULATORY INFORMATION TO BE ADDED AFTER VERIFICATION]",

  currency: "\u20B9",

  // Illustrative demo parameters only — replace with verified business terms
  interestRate: 18, // % per annum, indicative
  processingFee: "To be configured",
  applicationFee: 499, // applicable fee only
  premiumMembershipFee: 149, // monthly membership price
  minLoan: 5000,
  maxLoan: 100000,
  minTenure: 3,
  maxTenure: 24,

  whatsappMessage:
    "Hello Friend Pocket, I would like to know more about your financial services.",
};

// Helper: build a WhatsApp click-to-chat link, or null if not configured
function fpWhatsAppLink() {
  if (!FRIEND_POCKET_CONFIG.whatsapp) return null;
  const msg = encodeURIComponent(FRIEND_POCKET_CONFIG.whatsappMessage);
  return `https://wa.me/${FRIEND_POCKET_CONFIG.whatsapp}?text=${msg}`;
}

// Helper: format a number as INR-style currency string
function fpFormatCurrency(amount) {
  const rounded = Math.round(amount);
  return FRIEND_POCKET_CONFIG.currency + rounded.toLocaleString("en-IN");
}
