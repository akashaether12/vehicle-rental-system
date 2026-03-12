const VEHICLE_THEMES = {
  sedan: {
    eyebrow: "Executive sedan",
    accent: "#ffaf54",
    accentSoft: "rgba(255, 175, 84, 0.16)",
    base: "#0f2746",
    baseAlt: "#1d4f7a",
    chip: "Urban smooth",
  },
  suv: {
    eyebrow: "Adventure SUV",
    accent: "#7cd1a9",
    accentSoft: "rgba(124, 209, 169, 0.16)",
    base: "#102b36",
    baseAlt: "#25616d",
    chip: "Terrain ready",
  },
  hatchback: {
    eyebrow: "Compact mover",
    accent: "#f98f6f",
    accentSoft: "rgba(249, 143, 111, 0.16)",
    base: "#312140",
    baseAlt: "#5c3e70",
    chip: "Easy city park",
  },
  luxury: {
    eyebrow: "Luxury class",
    accent: "#f2d179",
    accentSoft: "rgba(242, 209, 121, 0.18)",
    base: "#1c2231",
    baseAlt: "#49506a",
    chip: "Chauffeur feel",
  },
  truck: {
    eyebrow: "Utility truck",
    accent: "#ff8c69",
    accentSoft: "rgba(255, 140, 105, 0.18)",
    base: "#2d2422",
    baseAlt: "#6f4a42",
    chip: "Heavy duty",
  },
  van: {
    eyebrow: "Family van",
    accent: "#86d6f8",
    accentSoft: "rgba(134, 214, 248, 0.16)",
    base: "#16283b",
    baseAlt: "#3f6d8b",
    chip: "Group comfort",
  },
  bike: {
    eyebrow: "Open-road bike",
    accent: "#f77ea6",
    accentSoft: "rgba(247, 126, 166, 0.16)",
    base: "#2f1f33",
    baseAlt: "#6d3e67",
    chip: "Weekend escape",
  },
  ev: {
    eyebrow: "Electric ride",
    accent: "#5de2b0",
    accentSoft: "rgba(93, 226, 176, 0.16)",
    base: "#102d2f",
    baseAlt: "#267577",
    chip: "Silent torque",
  },
  other: {
    eyebrow: "Curated fleet",
    accent: "#7ca9ff",
    accentSoft: "rgba(124, 169, 255, 0.16)",
    base: "#1d2540",
    baseAlt: "#485989",
    chip: "Ready to book",
  },
};

export const getVehicleTheme = (type) => {
  return VEHICLE_THEMES[type] || VEHICLE_THEMES.other;
};

export const getVehicleDisplayName = (vehicle) => {
  if (vehicle?.name?.trim()) {
    return vehicle.name.trim();
  }

  return [vehicle?.brand, vehicle?.model].filter(Boolean).join(" ");
};

export const getVehicleSubtitle = (vehicle) => {
  return [vehicle?.type, vehicle?.location, vehicle?.year].filter(Boolean).join(" | ");
};

export const getVehicleSpecs = (vehicle) => {
  return [
    `${vehicle?.seats || 0} seats`,
    vehicle?.transmission || "automatic",
    vehicle?.fuelType || "petrol",
  ];
};
