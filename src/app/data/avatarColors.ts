// Colours a learner can pick for their student avatar: the sweater and the picture behind it.
// Like the profile banner colour, the choice is saved on this device (see UserData).

export interface SweaterColor {
  id: string;
  label: string;
  /** The sweater itself. */
  main: string;
  /** The darker hood behind the neck. */
  dark: string;
}

export const SWEATER_COLORS: SweaterColor[] = [
  { id: "maroon", label: "ASU Maroon", main: "#8C1D40", dark: "#6B1530" },
  { id: "gold", label: "Gold", main: "#E8A600", dark: "#B58000" },
  { id: "teal", label: "Teal", main: "#23909F", dark: "#1A6B77" },
  { id: "rose", label: "Rose Pink", main: "#D6396A", dark: "#A32850" },
  { id: "violet", label: "Violet", main: "#7B3FB8", dark: "#592C86" },
  { id: "forest", label: "Forest Green", main: "#2E7D32", dark: "#1F5A23" },
  { id: "navy", label: "Navy", main: "#1F3F7A", dark: "#152C57" },
  { id: "charcoal", label: "Charcoal", main: "#3A3F47", dark: "#272B31" },
];

export function getSweaterColor(id?: string): SweaterColor {
  return SWEATER_COLORS.find((c) => c.id === id) ?? SWEATER_COLORS[0];
}

export interface AvatarBackground {
  id: string;
  label: string;
  /** CSS background for the picture behind the student. */
  css: string;
  /** A flat colour that stands in for it on the small swatch. */
  swatch: string;
}

// The default is a soft neutral grey so any sweater colour (the ASU maroon included) stands out from it.
export const AVATAR_BACKGROUNDS: AvatarBackground[] = [
  { id: "neutral", label: "Soft Grey", css: "radial-gradient(circle at 50% 30%, #DDE2E8 0%, #C2CAD4 55%, #A9B3BF 100%)", swatch: "#C2CAD4" },
  { id: "sand", label: "Warm Sand", css: "radial-gradient(circle at 50% 30%, #F1E6D2 0%, #E0CFAF 55%, #CDB88F 100%)", swatch: "#E0CFAF" },
  { id: "sky", label: "Sky Blue", css: "radial-gradient(circle at 50% 30%, #D6ECFA 0%, #AFD6F0 55%, #86BEE3 100%)", swatch: "#AFD6F0" },
  { id: "mint", label: "Mint", css: "radial-gradient(circle at 50% 30%, #DDF3E6 0%, #B8E2C9 55%, #8FCDAA 100%)", swatch: "#B8E2C9" },
  { id: "lavender", label: "Lavender", css: "radial-gradient(circle at 50% 30%, #E9E0F7 0%, #CDBFEA 55%, #B0A0DA 100%)", swatch: "#CDBFEA" },
  { id: "slate", label: "Dark Slate", css: "radial-gradient(circle at 50% 30%, #4A5361 0%, #333B47 55%, #232932 100%)", swatch: "#333B47" },
  { id: "maroon", label: "ASU Maroon", css: "radial-gradient(circle at 50% 30%, #A02450 0%, #7A1736 55%, #5A1228 100%)", swatch: "#7A1736" },
];

export function getAvatarBackground(id?: string): AvatarBackground {
  return AVATAR_BACKGROUNDS.find((b) => b.id === id) ?? AVATAR_BACKGROUNDS[0];
}
