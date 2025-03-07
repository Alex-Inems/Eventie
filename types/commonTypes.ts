// Import necessary icons from react-icons (or any icon library you prefer)


// Define a type for reusable links, including an optional array for dropdowns
export interface Link {
  name: string;
  href: string;
  icon?: React.ElementType;  // Icon should be typed as React.ElementType, which is a component type
  dropdownItems?: Link[]; // Optional dropdown items for nested links
}

