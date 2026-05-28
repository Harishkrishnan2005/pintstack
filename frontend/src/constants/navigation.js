import { Compass, Heart, House, PlusSquare, UserRound } from "lucide-react";

export const navigationItems = [
  { label: "Home", path: "/", icon: House },
  { label: "Explore", path: "/search", icon: Compass },
  { label: "Create", path: "/create", icon: PlusSquare },
  { label: "Saved", path: "/saved", icon: Heart },
  { label: "Profile", path: "/profile/me", icon: UserRound },
];
