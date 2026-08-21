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
  | "TRANSPORT_SERVICES"
  | "OTHER";

export type BusinessTypeConfig = {
  label: string;
  icon: string;
  contentLabel: string;
  contentPlural: string;
  experienceLabel: string;
  experienceDescription: string;
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
    contentLabel: "Product",
    contentPlural: "Products",
    experienceLabel: "Digital Menu",
    experienceDescription:
      "Customers can browse your digital menu through your QR code.",
    qrLabel: "Menu QR",
    qrDescription: "Manage your digital menu QR codes.",
  },

  HOTEL: {
    label: "Hotel",
    icon: "🏨",
    contentLabel: "Service",
    contentPlural: "Services",
    experienceLabel: "Hotel Experience",
    experienceDescription:
      "Customers can access hotel services, dining, information and bookings.",
    qrLabel: "Hotel QR",
    qrDescription: "Manage QR codes for your hotel experience.",
  },

  EVENT_ORGANIZER: {
    label: "Event Organizer",
    icon: "🎪",
    contentLabel: "Event",
    contentPlural: "Events",
    experienceLabel: "Event Directory",
    experienceDescription:
      "Customers can discover events, schedules, registration and tickets.",
    qrLabel: "Event QR",
    qrDescription: "Manage QR codes for your events.",
  },

  EVENT: {
    label: "Event",
    icon: "🎟️",
    contentLabel: "Event Content",
    contentPlural: "Event Content",
    experienceLabel: "Event Experience",
    experienceDescription:
      "Customers can view event information, schedules and tickets.",
    qrLabel: "Event QR",
    qrDescription: "Manage QR codes for your event experience.",
  },

  PROMOTION: {
    label: "Promotion",
    icon: "🎁",
    contentLabel: "Offer",
    contentPlural: "Offers",
    experienceLabel: "Promotion Experience",
    experienceDescription:
      "Customers can view offers, coupons and promotional campaigns.",
    qrLabel: "Promotion QR",
    qrDescription: "Manage QR codes for your promotions.",
  },

  MARKETING: {
    label: "Marketing",
    icon: "📣",
    contentLabel: "Campaign",
    contentPlural: "Campaigns",
    experienceLabel: "Campaign Experience",
    experienceDescription:
      "Customers can interact with your marketing campaigns.",
    qrLabel: "Campaign QR",
    qrDescription: "Manage QR codes for your marketing campaigns.",
  },

  SHOPPING_MALL: {
    label: "Shopping Mall",
    icon: "🛍️",
    contentLabel: "Store",
    contentPlural: "Stores",
    experienceLabel: "Mall Experience",
    experienceDescription:
      "Customers can discover stores, offers, services and navigation.",
    qrLabel: "Mall QR",
    qrDescription: "Manage QR codes for your shopping mall.",
  },

  THEATER: {
    label: "Theater",
    icon: "🎬",
    contentLabel: "Show",
    contentPlural: "Shows",
    experienceLabel: "Theater Experience",
    experienceDescription:
      "Customers can view shows, schedules and ticket information.",
    qrLabel: "Theater QR",
    qrDescription: "Manage QR codes for your theater.",
  },

  SHOWROOM: {
    label: "Showroom",
    icon: "🚗",
    contentLabel: "Product",
    contentPlural: "Products",
    experienceLabel: "Showroom Experience",
    experienceDescription:
      "Customers can explore products, models and submit enquiries.",
    qrLabel: "Showroom QR",
    qrDescription: "Manage QR codes for your showroom.",
  },

  REAL_ESTATE: {
    label: "Real Estate",
    icon: "🏠",
    contentLabel: "Property",
    contentPlural: "Properties",
    experienceLabel: "Property Experience",
    experienceDescription:
      "Customers can explore properties, projects and submit enquiries.",
    qrLabel: "Property QR",
    qrDescription: "Manage QR codes for your properties.",
  },

  CONVENTION: {
    label: "Convention Center",
    icon: "🏢",
    contentLabel: "Event",
    contentPlural: "Events",
    experienceLabel: "Convention Experience",
    experienceDescription:
      "Customers can discover events, halls, schedules and bookings.",
    qrLabel: "Convention QR",
    qrDescription: "Manage QR codes for your convention center.",
  },

  RETAIL: {
    label: "Retail",
    icon: "🛒",
    contentLabel: "Product",
    contentPlural: "Products",
    experienceLabel: "Retail Experience",
    experienceDescription:
      "Customers can browse products, offers and contact information.",
    qrLabel: "Retail QR",
    qrDescription: "Manage QR codes for your retail business.",
  },

  EDUCATION: {
    label: "Education",
    icon: "🎓",
    contentLabel: "Course",
    contentPlural: "Courses",
    experienceLabel: "Education Experience",
    experienceDescription:
      "Customers can explore courses, admissions and educational services.",
    qrLabel: "Education QR",
    qrDescription: "Manage QR codes for your educational business.",
  },

  HEALTHCARE: {
    label: "Healthcare",
    icon: "🏥",
    contentLabel: "Service",
    contentPlural: "Services",
    experienceLabel: "Healthcare Experience",
    experienceDescription:
      "Customers can explore services, doctors and appointments.",
    qrLabel: "Healthcare QR",
    qrDescription: "Manage QR codes for your healthcare business.",
  },

  TRANSPORT_SERVICES: {
    label: "Transport Services",
    icon: "🚗",
    contentLabel: "Service",
    contentPlural: "Services",
    experienceLabel: "Transport Experience",
    experienceDescription:
      "Customers can explore transport services, vehicles, routes, pricing, availability and contact information.",
    qrLabel: "Transport QR",
    qrDescription:
      "Manage QR codes for your transport services.",
  },



  OTHER: {
    label: "Other",
    icon: "⚙️",
    contentLabel: "Content",
    contentPlural: "Content",
    experienceLabel: "Digital Experience",
    experienceDescription:
      "Customers can access your business experience through your dynamic QR codes.",
    qrLabel: "Dynamic QR",
    qrDescription: "Manage your dynamic QR codes.",
  },
};

export function getBusinessTypeConfig(
  businessType: string | null | undefined
): BusinessTypeConfig {
  if (businessType && businessType in BUSINESS_TYPE_CONFIG) {
    return BUSINESS_TYPE_CONFIG[businessType as BusinessType];
  }

  return BUSINESS_TYPE_CONFIG.OTHER;
}