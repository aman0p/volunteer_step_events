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
    route: "/admin/volunteers",
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
    route: "/admin/account-requests",
    text: "Account Requests",
  },
];

export const FIELD_NAMES = {
  fullName: "Full name",
  email: "Email",
  phone: "Phone number",
  password: "Password",
  profileImage: "Profile Image",
  skills: "Skills",
  address: "Address",
  gender: "Gender",
  govIdImage: "Government ID Image",
  govIdType: "Government ID Type",
  title: "Event Title",
  description: "Event Description",
  location: "Event Location",
  startDate: "Start Date",
  endDate: "End Date",
  dressCode: "Dress Code",
  category: "Event Category",
  maxVolunteers: "Maximum Volunteers",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  phone: "tel",
  password: "password",
  profileImage: "file",
  skills: "text",
  address: "text",
  gender: "select",
  govIdImage: "file",
  govIdType: "select",
  title: "text",
  description: "textarea",
  location: "text",
  startDate: "datetime-local",
  endDate: "datetime-local",
  dressCode: "text",
  category: "text",
  maxVolunteers: "number",
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

export const ROLE_OPTIONS = [
  { value: "VOLUNTEER", label: "Volunteer" },
  { value: "ORGANISER", label: "Organiser" },
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

export const SAMPLE_EVENTS = [
  {
    id: "1",
    title: "Community Cleanup Drive",
    description: "Join us for a community cleanup drive to make our neighborhood cleaner and greener. We'll be collecting litter, planting trees, and spreading awareness about environmental conservation.",
    location: "Central Park, Downtown",
    startDate: "2024-02-15T09:00:00Z",
    endDate: "2024-02-15T17:00:00Z",
    dressCode: "Comfortable clothing and closed shoes",
    category: "Environmental",
    maxVolunteers: 50,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    image: "/events.jpg",
  },
  {
    id: "2",
    title: "Food Bank Distribution",
    description: "Help distribute food packages to families in need. This event focuses on providing essential groceries and meals to vulnerable communities.",
    location: "Community Center, Westside",
    startDate: "2024-02-20T08:00:00Z",
    endDate: "2024-02-20T16:00:00Z",
    dressCode: "Casual attire with volunteer vest provided",
    category: "Community Service",
    maxVolunteers: 30,
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "3",
    title: "Senior Citizen Tech Support",
    description: "Provide one-on-one technology support to senior citizens. Help them learn to use smartphones, tablets, and basic computer applications.",
    location: "Senior Living Community, Eastside",
    startDate: "2024-02-25T10:00:00Z",
    endDate: "2024-02-25T15:00:00Z",
    dressCode: "Business casual",
    category: "Education",
    maxVolunteers: 20,
    createdAt: "2024-01-25T09:15:00Z",
    updatedAt: "2024-01-25T09:15:00Z",
  },
  {
    id: "4",
    title: "Animal Shelter Care",
    description: "Volunteer at the local animal shelter to help care for abandoned pets. Activities include feeding, walking, and socializing with animals.",
    location: "Happy Paws Animal Shelter",
    startDate: "2024-03-01T09:00:00Z",
    endDate: "2024-03-01T17:00:00Z",
    dressCode: "Comfortable clothes that can get dirty",
    category: "Animal Welfare",
    maxVolunteers: 25,
    createdAt: "2024-01-30T11:45:00Z",
    updatedAt: "2024-01-30T11:45:00Z",
  },
  {
    id: "5",
    title: "Blood Donation Camp",
    description: "Organize and participate in a blood donation drive. Help save lives by donating blood and encouraging others to do the same.",
    location: "City Hospital, Main Campus",
    startDate: "2024-03-05T08:00:00Z",
    endDate: "2024-03-05T18:00:00Z",
    dressCode: "Comfortable clothing with short sleeves",
    category: "Healthcare",
    maxVolunteers: 40,
    createdAt: "2024-02-05T13:20:00Z",
    updatedAt: "2024-02-05T13:20:00Z",
  },
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
    role: "ORGANISER",
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
