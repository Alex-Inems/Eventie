// Import necessary icons from react-icons (or any icon library you prefer)
import {
  FaCalendarAlt,
  FaTicketAlt,
  FaCogs,
  FaChartLine,
  FaDollarSign,
  FaQuestionCircle,
  FaUserCog,
} from 'react-icons/fa';

// Define a type for reusable links, including an optional array for dropdowns
export interface Link {
  name: string;
  href: string;
  icon?: React.ElementType;  // Icon should be typed as React.ElementType, which is a component type
  dropdownItems?: Link[]; // Optional dropdown items for nested links
}

// Example of reusable links with icons and dropdowns
export const links: Link[] = [
  {
    name: 'Events Dashboard',
    href: '/dashboard/organizer',
    icon: FaCalendarAlt, // Updated icon for events
    dropdownItems: [
      { name: 'Upcoming Events', href: '/events/upcoming', icon: FaCalendarAlt },
      { name: 'Event Analytics', href: '/events/analytics', icon: FaChartLine },
      { name: 'Manage Events', href: '/events/manage', icon: FaTicketAlt },
    ],
  },
  {
    name: 'Event Features',
    href: '/features',
    icon: FaCogs, // Keep this as it represents features
    dropdownItems: [
      { name: 'Event Registration', href: '/features/registration', icon: FaTicketAlt },
      { name: 'Ticketing & Payments', href: '/features/ticketing', icon: FaDollarSign },
      { name: 'Event Insights', href: '/features/insights', icon: FaChartLine },
    ],
  },
  {
    name: 'Support',
    href: '/help',
    icon: FaQuestionCircle, // Updated to match help/support area
  },
  {
    name: 'Pricing & Plans',
    href: '/pricing',
    icon: FaDollarSign, // Keep this for the pricing section
  }
];
