export type BusinessType =
  | "RESTAURANT"
  | "HOTEL"
  | "EVENT_ORGANIZER"
  | "EVENT"
  | "PROMOTION"
  | "MARKETING"
  | "SHOPPING_MALL"
  | "THEATER"
  | "SHOWROOM"
  | "REAL_ESTATE"
  | "CONVENTION"
  | "RETAIL"
  | "EDUCATION"
  | "HEALTHCARE"
  | "OTHER";

export type BusinessTypeConfig = {
  label: string;
  icon: string;
  experienceLabel: string;
  experienceDescription: string;
  contentLabel: string;
  contentPlural: string;
  qrLabel: string;
  qrDescription: string;
};

export const BUSINESS_TYPE_CONFIG: Record<
  BusinessType,
  BusinessTypeConfig
> = {
  RESTAURANT: {
    label: "Restaurant",
    icon: "🍽️",
    experienceLabel: "Digital Menu Experience",
    experienceDescription:
      "Let customers scan a QR code to view your menu and interact with your restaurant.",
    contentLabel: "Menu Item",
    contentPlural: "Menu Items",
    qrLabel: "Menu QR",
    qrDescription: "Create and manage QR codes for your digital menu.",
  },

  HOTEL: {
    label: "Hotel",
    icon: "🏨",
    experienceLabel: "Hotel Guest Experience",
    experienceDescription:
      "Provide guests with quick access to hotel services and information.",
    contentLabel: "Service",
    contentPlural: "Services",
    qrLabel: "Hotel QR",
    qrDescription: "Create QR codes for hotel services and guest information.",
  },

  EVENT_ORGANIZER: {
    label: "Event Organizer",
    icon: "🎟️",
    experienceLabel: "Event Experience",
    experienceDescription:
      "Create a digital experience for events, attendees, and event information.",
    contentLabel: "Event Item",
    contentPlural: "Event Items",
    qrLabel: "Event QR",
    qrDescription: "Create QR codes for event information and experiences.",
  },

  EVENT: {
    label: "Event",
    icon: "🎉",
    experienceLabel: "Event Experience",
    experienceDescription:
      "Give attendees quick access to event information through QR codes.",
    contentLabel: "Event Item",
    contentPlural: "Event Items",
    qrLabel: "Event QR",
    qrDescription: "Create QR codes for your event experience.",
  },

  PROMOTION: {
    label: "Promotion",
    icon: "🏷️",
    experienceLabel: "Promotion Experience",
    experienceDescription:
      "Connect customers to promotions, offers, and campaign information.",
    contentLabel: "Offer",
    contentPlural: "Offers",
    qrLabel: "Promotion QR",
    qrDescription: "Create QR codes for promotions and offers.",
  },

  MARKETING: {
    label: "Marketing",
    icon: "📢",
    experienceLabel: "Marketing Experience",
    experienceDescription:
      "Create QR-powered marketing campaigns and customer experiences.",
    contentLabel: "Campaign",
    contentPlural: "Campaigns",
    qrLabel: "Marketing QR",
    qrDescription: "Create QR codes for your marketing campaigns.",
  },

  SHOPPING_MALL: {
    label: "Shopping Mall",
    icon: "🛍️",
    experienceLabel: "Shopping Experience",
    experienceDescription:
      "Help visitors discover stores, offers, services, and information.",
    contentLabel: "Store",
    contentPlural: "Stores",
    qrLabel: "Mall QR",
    qrDescription: "Create QR codes for stores, offers, and mall information.",
  },

  THEATER: {
    label: "Theater",
    icon: "🎭",
    experienceLabel: "Theater Experience",
    experienceDescription:
      "Give visitors access to shows, schedules, and theater information.",
    contentLabel: "Show",
    contentPlural: "Shows",
    qrLabel: "Theater QR",
    qrDescription: "Create QR codes for shows and theater information.",
  },

  SHOWROOM: {
    label: "Showroom",
    icon: "🚗",
    experienceLabel: "Showroom Experience",
    experienceDescription:
      "Let customers explore products and showroom information using QR codes.",
    contentLabel: "Product",
    contentPlural: "Products",
    qrLabel: "Showroom QR",
    qrDescription: "Create QR codes for showroom products and information.",
  },

  REAL_ESTATE: {
    label: "Real Estate",
    icon: "🏠",
    experienceLabel: "Property Experience",
    experienceDescription:
      "Help customers discover properties and property information through QR codes.",
    contentLabel: "Property",
    contentPlural: "Properties",
    qrLabel: "Property QR",
    qrDescription: "Create QR codes for property listings and information.",
  },

  CONVENTION: {
    label: "Convention Center",
    icon: "🏢",
    experienceLabel: "Convention Experience",
    experienceDescription:
      "Provide visitors with event, venue, and schedule information.",
    contentLabel: "Event",
    contentPlural: "Events",
    qrLabel: "Convention QR",
    qrDescription: "Create QR codes for convention events and information.",
  },

  RETAIL: {
    label: "Retail",
    icon: "🛒",
    experienceLabel: "Retail Experience",
    experienceDescription:
      "Let customers discover products, offers, and store information.",
    contentLabel: "Product",
    contentPlural: "Products",
    qrLabel: "Retail QR",
    qrDescription: "Create QR codes for retail products and offers.",
  },

  EDUCATION: {
    label: "Education",
    icon: "🎓",
    experienceLabel: "Education Experience",
    experienceDescription:
      "Provide students and visitors with useful educational information.",
    contentLabel: "Course",
    contentPlural: "Courses",
    qrLabel: "Education QR",
    qrDescription: "Create QR codes for courses and educational information.",
  },

  HEALTHCARE: {
    label: "Healthcare",
    icon: "🏥",
    experienceLabel: "Healthcare Experience",
    experienceDescription:
      "Provide patients with quick access to healthcare information and services.",
    contentLabel: "Service",
    contentPlural: "Services",
    qrLabel: "Healthcare QR",
    qrDescription: "Create QR codes for healthcare services and information.",
  },

  OTHER: {
    label: "Other",
    icon: "📌",
    experienceLabel: "Digital Experience",
    experienceDescription:
      "Create a QR-powered digital experience for your business.",
    contentLabel: "Item",
    contentPlural: "Items",
    qrLabel: "QR Code",
    qrDescription: "Create and manage QR codes for your business.",
  },
};

export function getBusinessTypeConfig(
  businessType: string | null | undefined
): BusinessTypeConfig {
  if (
    businessType &&
    businessType in BUSINESS_TYPE_CONFIG
  ) {
    return BUSINESS_TYPE_CONFIG[
      businessType as BusinessType
    ];
  }

  return BUSINESS_TYPE_CONFIG.OTHER;
}