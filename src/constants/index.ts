export const navigationLinks = [
  {
    href: "/events",
    label: "Events",
  },
  {
    img: "/icons/user.svg",
    selectedImg: "/icons/user-fill.svg",
    href: "/my-profile",
    label: "My Profile",
  },
];

export const adminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/admin",
    text: "Home",
  },
  {
    img: "/icons/admin/users.svg",
    route: "/admin/volunteer",
    text: "All Volunteers",
  },
  {
    img: "/icons/admin/book.svg",
    route: "/admin/events",
    text: "All Events",
  },
  {
    img: "/icons/admin/bookmark.svg",
    route: "/admin/enrollments",
    text: "Event Enrollments",
  },
  {
    img: "/icons/admin/user.svg",
    route: "/admin/account-verification",
    text: "Verification Requests",
  },
];





export const ROLE_OPTIONS = [
  { value: "USER", label: "User" },
  { value: "VOLUNTEER", label: "Volunteer" },
  { value: "ORGANIZER", label: "Organizer" },
  { value: "ADMIN", label: "Admin" },
];

export const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export const EVENT_CATEGORIES = [
  "Community Service",
  "Environmental",
  "Education",
  "Healthcare",
  "Animal Welfare",
  "Disaster Relief",
  "Cultural",
  "Sports",
  "Technology",
  "Arts & Entertainment",
  "Other",
];


export const SAMPLE_VOLUNTEERS = [
  {
    id: "1",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0101",
    profileImage: "/images/volunteer-1.jpg",
    skills: ["Event Planning", "Communication", "Leadership"],
    address: "123 Main Street, Downtown, City",
    gender: "FEMALE",
    govIdImage: "/documents/aadhar-1.jpg",
    govIdType: "AADHAR_CARD",
    role: "VOLUNTEER",
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "2",
    fullName: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1-555-0102",
    profileImage: "/images/volunteer-2.jpg",
    skills: ["First Aid", "Emergency Response", "Team Management"],
    address: "456 Oak Avenue, Westside, City",
    gender: "MALE",
    govIdImage: "/documents/passport-2.jpg",
    govIdType: "PASSPORT",
    role: "ORGANIZER",
    createdAt: "2024-01-12T10:30:00Z",
  },
  {
    id: "3",
    fullName: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1-555-0103",
    profileImage: "/images/volunteer-3.jpg",
    skills: ["Teaching", "Child Care", "Spanish Language"],
    address: "789 Pine Road, Eastside, City",
    gender: "FEMALE",
    govIdImage: "/documents/pan-3.jpg",
    govIdType: "PAN_CARD",
    role: "VOLUNTEER",
    createdAt: "2024-01-15T14:15:00Z",
  },
];










//  *******************AUTH FORM FIELDS*******************

export const FIELD_NAMES = {
  fullName: "Full name",
  email: "Email",
  password: "Password",
  phoneNumber: "Phone number",
  address: "Address",
  gender: "Gender",
  govIdType: "Government ID Type",
  govIdImage: "Government ID Image",
  profileImage: "Profile Image",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  password: "password",
  phoneNumber: "tel ",
  address: "text",
  gender: "select",
  govIdType: "select",
  govIdImage: "file",
  profileImage: "file",
};

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export const GOV_ID_OPTIONS = [
  { value: "AADHAR_CARD", label: "Aadhar Card" },
  { value: "PASSPORT", label: "Passport" },
  { value: "DRIVING_LICENSE", label: "Driving License" },
  { value: "PAN_CARD", label: "PAN Card" },
];