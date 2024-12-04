import { ReactElement } from "react";
import { FaUser } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";

import { IoSettings } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";

export interface SidebarMenuItemInterface {
  id: number;
  name: string;
  icon: ReactElement;
  link: string;
  protected: boolean;
  showToolTip: boolean;
  ToolTipValue: string;
}

export const SidebarMenuItems: SidebarMenuItemInterface[] = [
  {
    id: 1,
    name: "Dashboard",
    icon: <MdSpaceDashboard className="w-6 h-6" />,
    link: "/dashboard",
    protected: true,
    showToolTip: true,
    ToolTipValue: "Dashboard",
  },
  {
    id: 2,
    name: "Profile",
    icon: <FaUser className="w-6 h-6" />,
    link: "/profile",
    protected: true,
    showToolTip: true,
    ToolTipValue: "View Profile",
  },
  {
    id: 3,
    name: "Client Inquiry",
    icon: <HiUsers className="w-6 h-6" />,
    link: "/client-inquiry",
    protected: true,
    showToolTip: true,
    ToolTipValue: "Client Inquiry",
  },
  {
    id: 4,
    name: "Settings",
    icon: <IoSettings className="w-6 h-6" />,
    link: "/settings",
    protected: true,
    showToolTip: true,
    ToolTipValue: "Settings",
  },
];
