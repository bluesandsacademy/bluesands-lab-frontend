export const countries = [
  "--select--",
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Côte d'Ivoire",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia (Czech Republic)",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini (fmr. 'Swaziland')",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export const genderOptions = ["--select--", "Male", "Female"];

export const workPositions = [
  "--select--",
  "Professor/Instructor",
  "Head/Chair of Department",
  "Dean/Director",
  "Faculty Administrator",
  "Education Curriculum Developer",
  "Laboratory Instructor/ Cordinator",
  "Online Instructor/ Coordinator",
  "Others",
];

interface SidebarLinks {
  title: string;
  url: string;
  icon: string;
}

export const sidebarLinks: SidebarLinks[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "/images/icon/home.svg",
  },
  {
    title: "Experiments",
    url: "/dashboard/experiments",
    icon: "/images/icon/beaker.svg",
  },
  {
    title: "VR Studio",
    url: "/dashboard/vr-studio",
    icon: "/images/icon/vr_headset.svg",
  },
  {
    title: "VR Experience",
    url: "/dashboard/vr-experience",
    icon: "/images/icon/game_vr_headset.svg",
  },
  {
    title: "STEM Courses",
    url: "/dashboard/stem-courses",
    icon: "/images/icon/notepad.svg",
  },
  {
    title: "STEM Quiz",
    url: "/dashboard/stem-quizes",
    icon: "/images/icon/quiz.svg",
  },
  {
    title: "Report",
    url: "/dashboard/reports",
    icon: "/images/icon/report.svg",
  },
];

export type Profile = {
  fullName: string;
  accountType: "Individual" | "School";
  avatarUrl: string;
};

export const profile: Profile = {
  fullName: "John Doe",
  accountType: "Individual",
  avatarUrl: "/images/avatar/user01.png",
};

interface ProfileDropdown {
  title: string;
  url: string;
  imgSrc: string;
}

export const profileDropdown: ProfileDropdown[] = [
  {
    title: "Profile",
    url: "/dashboard/profile",
    imgSrc: "/images/icon/profile.svg",
  },
  {
    title: "Change Password",
    url: "/dashboard/change-password",
    imgSrc: "/images/icon/change_password.svg",
  },
];

export const languageOptions = ["English", "Hausa", "Igbo", "Yoruba", "Pidgin"];
export interface Stat {
  title: string;
  percentage: string;
  icon: string;
  trendIcon: string;
  percentageChange: string;
  timeFrame: string;
}

export const stats: Stat[] = [
  {
    title: "Attendance",
    percentage: "90%",
    icon: "/images/icon/calendar.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Lab Completion Rate",
    percentage: "75%",
    icon: "/images/icon/beaker_01.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Quiz Average ",
    percentage: "85%",
    icon: "/images/icon/clipboard.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Experiment Attempts",
    percentage: "20 Attempts",
    icon: "/images/icon/microscope.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
];

interface UpcomingCourse {
  title: string;
  timeline: string;
  iconURI: string;
}

export const upcomingCourses: UpcomingCourse[] = [
  {
    title: "Introduction to Chemical Reactions",
    timeline: "December 5th, 2024 - 10:00 AM to 11:30 AM.",
    iconURI: "/images/icon/beaker_outline.svg",
  },
  {
    title: "Newton's Law of Motion",
    timeline: "December 5th, 2024 - 10:00 AM to 11:30 AM.",
    iconURI: "/images/icon/physics_outline.svg",
  },
  {
    title: "Basics of Organic Chemistry",
    timeline: "December 5th, 2024 - 10:00 AM to 11:30 AM.",
    iconURI: "/images/icon/organic_chemistry_outline.svg",
  },
  {
    title: "DNA Replication Workshop",
    timeline: "December 5th, 2024 - 10:00 AM to 11:30 AM.",
    iconURI: "/images/icon/biology_outline.svg",
  },
  {
    title: "Basics of Organic Chemistry",
    timeline: "December 5th, 2024 - 10:00 AM to 11:30 AM.",
    iconURI: "/images/icon/gear_outline.svg",
  },
  {
    title: "Basics of Organic Chemistry",
    timeline: "December 5th, 2024 - 10:00 AM to 11:30 AM.",
    iconURI: "/images/icon/bacteria_outline.svg",
  },
];

interface Performance {
  courseTitle: string;
  timeSpent: string;
  quizAttemptFrequency: number;
  completion: number;
  iconURI: string;
}

export const performance: Performance[] = [
  {
    courseTitle: "Physics",
    timeSpent: "8 hours",
    completion: 90,
    quizAttemptFrequency: 3,
    iconURI: "/images/icon/performance/physics.svg",
  },
  {
    courseTitle: "Chemistry",
    timeSpent: "8 hours",
    completion: 60,
    quizAttemptFrequency: 3,
    iconURI: "/images/icon/performance/chemistry.svg",
  },
  {
    courseTitle: "Biology",
    timeSpent: "8 hours",
    completion: 30,
    quizAttemptFrequency: 3,
    iconURI: "/images/icon/performance/biology.svg",
  },
  {
    courseTitle: "Biology",
    timeSpent: "8 hours",
    completion: 60,
    quizAttemptFrequency: 3,
    iconURI: "/images/icon/performance/biology.svg",
  },
  {
    courseTitle: "Chemistry",
    timeSpent: "8 hours",
    completion: 60,
    quizAttemptFrequency: 3,
    iconURI: "/images/icon/performance/chemistry.svg",
  },
  {
    courseTitle: "Physics",
    timeSpent: "8 hours",
    completion: 60,
    quizAttemptFrequency: 3,
    iconURI: "/images/icon/performance/physics.svg",
  },
  {
    courseTitle: "Physics",
    timeSpent: "8 hours",
    completion: 60,
    quizAttemptFrequency: 3,
    iconURI: "/images/icon/performance/physics.svg",
  },
  {
    courseTitle: "Physics",
    timeSpent: "8 hours",
    completion: 60,
    quizAttemptFrequency: 3,
    iconURI: "/images/icon/performance/physics.svg",
  },
  {
    courseTitle: "Physics",
    timeSpent: "8 hours",
    completion: 60,
    quizAttemptFrequency: 3,
    iconURI: "/images/icon/performance/physics.svg",
  },
  {
    courseTitle: "Physics",
    timeSpent: "8 hours",
    completion: 60,
    quizAttemptFrequency: 3,
    iconURI: "/images/icon/performance/physics.svg",
  },
  {
    courseTitle: "Physics",
    timeSpent: "8 hours",
    completion: 60,
    quizAttemptFrequency: 3,
    iconURI: "/images/icon/performance/physics.svg",
  },
  {
    courseTitle: "Physics",
    timeSpent: "8 hours",
    completion: 60,
    quizAttemptFrequency: 3,
    iconURI: "/images/icon/performance/physics.svg",
  },
];

export const courseIcons = {
  physics: "/images/icon/performance/physics.svg",
  chemistry: "/images/icon/performance/chemistry.svg",
  biology: "/images/icon/performance/biology.svg",
  organicChemistry: "/images/icon/performance/organic_chemistry.svg",
};
