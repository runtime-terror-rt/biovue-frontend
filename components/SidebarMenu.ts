import { Cable, Fingerprint, ImageDownIcon, LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  TrendingUp,
  Brain,
  Repeat,
  HeartHandshake,
  Mail,
  Settings,
  Users,
  Calendar,
  FileText,
  Image,
  CreditCard,
  HelpCircle,
} from "lucide-react";

export interface MenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
  children?: {
    label: string;
    href: string;
  }[];
}

interface SidebarMenu {
  user: MenuItem[];
  trainer: MenuItem[];
  admin: MenuItem[];
  nutritionist: MenuItem[];
}

export const SIDEBAR_MENU: SidebarMenu = {
  user: [
    { label: "Dashboard", icon: LayoutGrid, href: "/user-dashboard" },
    {
      label: "Projections",
      icon: TrendingUp,
      href: "/user-dashboard/projections",
    },
    { label: "Projection Galary", icon: ImageDownIcon, href: "/user-dashboard/projection-galary" },
    { label: "Insights", icon: Brain, href: "/user-dashboard/insights" },
    { label: "Habits", icon: Repeat, href: "/user-dashboard/habits" },
    { label: "Support", icon: HeartHandshake, href: "/user-dashboard/support" },
    { label: "Message", icon: Mail, href: "/user-dashboard/messages" },
    { label: "Settings", icon: Settings, href: "/user-dashboard/settings" },
  ],

  trainer: [
    {
      label: "Overview",
      icon: LayoutGrid,
      href: "/trainer-dashboard/overview",
    },
    { label: "Clients", icon: Users, href: "/trainer-dashboard/clients" },
    { label: "Programs", icon: FileText, href: "/trainer-dashboard/programs" },
    { label: "Messages", icon: Mail, href: "/trainer-dashboard/messages" },
    { label: "Calendar", icon: Calendar, href: "/trainer-dashboard/calendar" },
    { label: "Settings", icon: Settings, href: "/trainer-dashboard/settings" },
  ],

  nutritionist: [
    {
      label: "Overview",
      icon: LayoutGrid,
      href: "/nutritionist-dashboard/overview",
    },
    { label: "Clients", icon: Users, href: "/nutritionist-dashboard/clients" },
    { label: "Messages", icon: Mail, href: "/nutritionist-dashboard/messages" },
  ],

  admin: [
    { label: "Overview", icon: LayoutGrid, href: "/admin-dashboard/overview" },
    { label: "Users", icon: Users, href: "/admin-dashboard/users" },
    {
      label: "Subscription Plans",
      icon: CreditCard,
      href: "/admin-dashboard/subscription-plans",
      // children: [
      //   {
      //     label: "Individual Plans",
      //     href: "/admin-dashboard/subscription-plans?type=individual",
      //   },
      //   {
      //     label: "Professional Plans",
      //     href: "/admin-dashboard/subscription-plans?type=professional",
      //   },
      // ],
    },
    { label: "Reports", icon: FileText, href: "/admin-dashboard/reports" },
    {
      label: "Banner Management",
      icon: Image,
      href: "/admin-dashboard/banner-management",
    },
    { label: "Settings", icon: Settings, href: "/admin-dashboard/settings" },
    {
      label: "FAQ Management",
      icon: HelpCircle,
      href: "/admin-dashboard/faqs",
    },
    {
      label: "Partners",
      icon: HeartHandshake,
      href: "/admin-dashboard/partners",
    },
    {
      label: "Privacy Policy",
      icon: Fingerprint,
      href: "/admin-dashboard/privacy",
    },
    { label: "API Service", icon: Cable, href: "/admin-dashboard/api-service" },
  ],
};
