import { StatCardData } from "@/components/Dashboard/StatCards";

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
    title: "Learning Space",
    url: "/dashboard/stem-courses",
    icon: "/images/icon/notepad.svg",
  },
  // {
  //   title: "VR Studio",
  //   url: "/dashboard/vr-studio",
  //   icon: "/images/icon/vr_headset.svg",
  // },
  // {
  //   title: "VR Experience",
  //   url: "/dashboard/vr-experience",
  //   icon: "/images/icon/game_vr_headset.svg",
  // },
   {
    title: "Experiments",
    url: "/dashboard/experiments",
    icon: "/images/icon/beaker.svg",
  },
  {
    title: "Assessment",
    url: "/dashboard/stem-quizzes",
    icon: "/images/icon/quiz.svg",
  },
  {
    title: "Badges & Rewards",
    url: "/dashboard/rewards",
    icon: "/images/icon/badge.svg",
  },
  {
    title: "Leaderboard",
    url: "/dashboard/leaderboard",
    icon: "/images/icon/ic_outline-leaderboard.svg",
  },
  {
    title: "Payment & Sub",
    url: "/dashboard/payments",
    icon: "/images/icon/card_payment.svg",
  },
  {
    title: "Report",
    url: "/dashboard/reports",
    icon: "/images/icon/report.svg",
  },
];

export const sideNavLinks: SidebarLinks[] = [
  {
    title: "Overview",
    url: "/school/dashboard",
    icon: "/images/icon/home.svg",
  },
  {
    title: "User Management",
    url: "/school/dashboard/user-management",
    icon: "/images/icon/user-bold.svg",
  },
  {
    title: "Experiment Overview",
    url: "/school/dashboard/lab-experiments",
    icon: "/images/icon/beaker.svg",
  },
  {
    title: "Performance Analytics",
    url: "/school/dashboard/performance",
    icon: "/images/icon/analytic.svg",
  },
  {
    title: "Teacher Activity",
    url: "/school/dashboard/teachers",
    icon: "/images/icon/mdi_teacher.svg",
  },
  {
    title: "System Metrics",
    url: "/school/dashboard/system-metrics",
    icon: "/images/icon/system.svg",
  },
  {
    title: "Report & Analytics",
    url: "/school/dashboard/report",
    icon: "/images/icon/report.svg",
  },
  {
    title: "Payment & Sub",
    url: "/school/dashboard/payments",
    icon: "/images/icon/card_payment.svg",
  },
  {
    title: "Leaderboard",
    url: "/school/dashboard/leaderboard",
    icon: "/images/icon/ic_outline-leaderboard.svg",
  },
  {
    title: "Support & Training",
    url: "/school/dashboard/support-training",
    icon: "/images/icon/health-walk-supported.svg",
  },
];

export const teacherSideNavLinks: SidebarLinks[] = [
  {
    title: "Overview",
    url: "/teacher/dashboard",
    icon: "/images/icon/home.svg",
  },
  {
    title: "Class Management",
    url: "/teacher/dashboard/classes",
    icon: "/images/icon/mdi_teacher.svg",
  },
  {
    title: "Student Engagement",
    url: "/teacher/dashboard/students",
    icon: "/images/icon/studentgrad.svg",
  },
  {
    title: "Experiment Mgt",
    url: "/teacher/dashboard/experiments",
    icon: "/images/icon/beaker.svg",
  },
  {
    title: "Performance Metrics",
    url: "/teacher/dashboard/performance",
    icon: "/images/icon/analytic.svg",
  },
  {
    title: "Quiz & Assessments",
    url: "/teacher/dashboard/quizzes",
    icon: "/images/icon/quiz.svg",
  },
  {
    title: "Communication Metrics",
    url: "/teacher/dashboard/comms",
    icon: "/images/icon/communication.svg",
  },
  {
    title: "Report & Analytics",
    url: "/teacher/dashboard/reports",
    icon: "/images/icon/report.svg",
  },
  {
    title: "Leaderboard",
    url: "/teacher/dashboard/leaderboard",
    icon: "/images/icon/ic_outline-leaderboard.svg",
  },
  {
    title: "Teachers Forum",
    url: "/teacher/dashboard/forum",
    icon: "/images/icon/forum.svg",
  },
];

export const adminSideNavLinks: SidebarLinks[] = [
  {
    title: "Overview",
    url: "/admin/dashboard",
    icon: "/images/icon/home.svg",
  },
  {
    title: "School Management",
    url: "/admin/dashboard/school-management",
    icon: "/images/icon/health-walk-supported.svg",
  },
  {
    title: "User Management",
    url: "/admin/dashboard/user-management",
    icon: "/images/icon/user-bold.svg",
  },
  {
    title: "Experiment & Content",
    url: "/admin/dashboard/experiments",
    icon: "/images/icon/beaker.svg",
  },
  {
    title: "Payments & Finance",
    url: "/admin/dashboard/payments",
    icon: "/images/icon/card_payment.svg",
  },
  {
    title: "Report & Analytics",
    url: "/admin/dashboard/report",
    icon: "/images/icon/report.svg",
  },
  {
    title: "Leaderboard",
    url: "/admin/dashboard/leaderboard",
    icon: "/images/icon/ic_outline-leaderboard.svg",
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

export const schoolProfileDropdown: ProfileDropdown[] = [
  {
    title: "Profile",
    url: "/school/dashboard/profile",
    imgSrc: "/images/icon/profile.svg",
  },
  {
    title: "Change Password",
    url: "/school/dashboard/change-password",
    imgSrc: "/images/icon/change_password.svg",
  },
];

export const teacherProfileDropdown: ProfileDropdown[] = [
  {
    title: "Profile",
    url: "/teacher/dashboard/profile",
    imgSrc: "/images/icon/profile.svg",
  },
  {
    title: "Change Password",
    url: "/teacher/dashboard/change-password",
    imgSrc: "/images/icon/change_password.svg",
  },
];

export const languageOptions = ["English", "Hausa", "Igbo", "Yoruba", "Pidgin"];
export interface Stat {
  title: string;
  percentage: string;
  icon: string;
  trendIcon?: string;
  percentageChange?: string;
  timeFrame?: string;
}

export const quizStats: StatCardData[] = [
  {
    title: "Total Quizzes Taken",
    value: "0",
    icon: "/images/icon/grad.svg",
    trendIcon: "/images/icon/add.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Average Score Across Quizzes",
    value: "0",
    icon: "/images/icon/chart.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "High Scores",
    value: "0",
    icon: "/images/icon/highscore.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Recent Quiz Performance",
    value: "0",
    icon: "/images/icon/stopwatch.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
];

export const quizResultStats: StatCardData[] = [
  {
    title: "Score",
    value: "0/0",
    icon: "/images/icon/clipboard.svg",
  },
  {
    title: "Correct Answers",
    value: "0",
    icon: "/images/icon/highscore.svg",
  },
  {
    title: "Incorrect Answers",
    value: "0",
    icon: "/images/icon/add.svg",
  },
  {
    title: "Time taken",
    value: "0 Minutes",
    icon: "/images/icon/stopwatch.svg",
  },
  {
    title: "Result",
    value: "Pass",
    icon: "/images/icon/grad.svg",
  },
];

export const AdminGeneralMetricStats: StatCardData[] = [
  {
    title: "Total Platform Users",
    value: "1253",
    icon: "/images/icon/total_users.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "overall",
  },
  {
    title: "Total Schools Registered",
    value: "76",
    icon: "/images/icon/total_schools.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "overall",
  },
  {
    title: "Total Virtual lab experiments",
    value: "175",
    icon: "/images/icon/microscope.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "overall",
  },
  {
    title: "Total Payments",
    value: "NGN 19,410,000",
    icon: "/images/icon/total_payments.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "overall",
  },
];

export const AdminLearningMetricStats: StatCardData[] = [
  {
    title: "Total STEM Courses",
    value: "44",
    icon: "/images/icon/calendar.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "overall",
  },
  {
    title: "Total lab practice time",
    value: "12,583 mins",
    icon: "/images/icon/beaker_01.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "overall",
  },
  {
    title: "Total Quiz Scores",
    value: "66%",
    icon: "/images/icon/clipboard.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "overall",
  },
  {
    title: "Total Experiment Attempts",
    value: "182 Attempt(s)",
    icon: "/images/icon/microscope.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "overall",
  },
];

export const AdminUserOverviewStats: StatCardData[] = [
  {
    title: "Subscribed Users",
    value: "1182",
    icon: "/images/svg/subscribed.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "overall",
  },
  {
    title: "Offline Users",
    value: "71",
    icon: "/images/svg/offline.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "overall",
  },
  {
    title: "Male Users",
    value: "722",
    icon: "/images/svg/male.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "overall",
  },
  {
    title: "Female Users",
    value: "531",
    icon: "/images/svg/female.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "overall",
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

export const PhETSimulations = [
  {
    simulationUrl:
      "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html",
    title: "Forces and Motion (Basics)",
    description:
      "A simulation where students practically learn about Newton's Laws of motion",
    subject: "Physics",
    class: "ss1",
  },
  {
    simulationUrl:
      "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_en.html",
    title: "Energy Forms and Changes",
    description: "Learn how energy is transformed from one state to another",
    subject: "Physics",
    class: "ss1",
  },
  {
    simulationUrl:
      "https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_en.html",
    title: "Acid-Base Solutions",
    description:
      "Learn to do titration experiments and the characteristics of acids and bases",
    subject: "Chemistry",
    class: "ss1",
  },
  {
    simulationUrl:
      "https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_en.html",
    title: "Build an Atom",
    description:
      "Learn about the components of an atom alongside atomic configurations",
    subject: "Chemistry",
    class: "ss1",
  },
  // {
  //   simulationUrl:
  //     "",
  //   title: "",
  //   description:
  //     "",
  //   subject: "Biology",
  //   class: "ss1",
  // },
  // {
  //   simulationUrl:
  //     "",
  //   title: "",
  //   description:
  //     "",
  //   subject: "Biology",
  //   class: "ss1",
  // },
  {
    simulationUrl:
      "https://phet.colorado.edu/sims/html/conductivity/latest/conductivity_en.html",
    title: "Conductivity",
    description:
      "Practice with, and learn about the conductivity of different materials",
    subject: "Physics",
    class: "ss2",
  },
  {
    simulationUrl:
      "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html",
    title: "Circuit Construction Kit",
    description:
      "A simulation of an electric circuit construction. Students are provided with different materials to play around with.",
    subject: "Physics",
    class: "ss2",
  },
  {
    simulationUrl:
      "https://phet.colorado.edu/sims/html/states-of-matter/latest/states-of-matter_en.html",
    title: "States of Matter",
    description:
      "Learn about the different states of matter and their transformations",
    subject: "Chemistry",
    class: "ss2",
  },
  {
    simulationUrl:
      "https://phet.colorado.edu/sims/html/isotopes-and-atomic-mass/latest/isotopes-and-atomic-mass_en.html",
    title: "Isotopes and Atomic Mass",
    description: "Learn about Isotoy and simulations of atomic mass",
    subject: "Chemistry",
    class: "ss2",
  },
  // {
  //   simulationUrl:
  //     "",
  //   title: "",
  //   description:
  //     "",
  //   subject: "Biology",
  //   class: "ss2",
  // },
  // {
  //   simulationUrl:
  //     "",
  //   title: "",
  //   description:
  //     "",
  //   subject: "Biology",
  //   class: "ss2",
  // },
  {
    simulationUrl:
      "https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_en.html",
    title: "Bending Light",
    description: "Learn about light's refraction, reflection and wavelength",
    subject: "Physics",
    class: "ss3",
  },
  {
    simulationUrl:
      "https://phet.colorado.edu/sims/html/resistance-in-a-wire/latest/resistance-in-a-wire_en.html",
    title: "Resistance in a wire",
    description:
      "A practical simulation to understand resistance and how it works",
    subject: "Physics",
    class: "ss3",
  },
  {
    simulationUrl:
      "https://phet.colorado.edu/sims/html/reactants-products-and-leftovers/latest/reactants-products-and-leftovers_en.html",
    title: "Reactants, Products and Leftovers",
    description:
      "A simulation of chemical reactions, showing their end products as well as their by-products",
    subject: "Chemistry",
    class: "ss3",
  },
  {
    simulationUrl:
      "https://phet.colorado.edu/sims/html/sugar-and-salt-solutions/latest/sugar-and-salt-solutions_en.html",
    title: "Sugar and Salt Solutions",
    description: "Learn about the complexity of Sugars and Salts",
    subject: "Chemistry",
    class: "ss3",
  },
  //  {
  //   simulationUrl:
  //     "",
  //   title: "",
  //   description:
  //     "",
  //   subject: "Biology",
  //   class: "ss3",
  // },
  //  {
  //   simulationUrl:
  //     "",
  //   title: "",
  //   description:
  //     "",
  //   subject: "Biology",
  //   class: "ss3",
  // },
];

//end
