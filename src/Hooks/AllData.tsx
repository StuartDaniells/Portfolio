import React, { useEffect, useState } from "react";

// contact image
import iconEmail from "../assets/images/contact/email 1.png";
import iconMap from "../assets/images/contact/map 1.png";
import { CgNotes } from "react-icons/cg";
import { FaQuoteLeft, FaRegUser } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
// line icons used by the About page capability cards
import {
  FiCloud,
  FiCode,
  FiCodesandbox,
  FiCpu,
  FiDatabase,
} from "react-icons/fi";
import { RiContactsBookLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";

export interface MenuItem {
  id: string;
  name: string;
  link: string;
  icon: React.ReactNode;
}

export interface ServiceItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  des: string;
  color: string;
  bg: string;
}

export interface ExperienceRoleItem {
  id: string;
  company: string;
  title: string;
  date: string;
  location: string;
  isCurrent: boolean;
  bg?: string;
  highlights: string[];
}

export interface SkillGroupItem {
  id: string;
  category: string;
  terms: string[];
}

export interface EducationItem {
  id: string;
  qualification: string;
  institution: string;
  date: string;
  location: string;
  note?: string;
  bg: string;
}

export interface ContactItem {
  id: string;
  icon: any;
  title: string;
  item1: string;
  item2: string;
  bg: string;
}

const AllData = () => {
  const [check, setCheck] = useState(false);
  const [local, setLocal] = useState<string | null>(localStorage.getItem("theme"));

  // dark and light theme controls
  useEffect(() => {
    const themeValue = localStorage?.getItem("theme");

    if (!themeValue) {
      setCheck(false);
      localStorage.setItem("theme", "light");
    } else {
      themeValue === "dark" && setCheck(true);
      themeValue === "light" && setCheck(false);
    }

    localStorage?.getItem("theme") === "dark"
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, []);

  // Create and light theme function
  const handleTheme = (value: string) => {
    if (value === "light") {
      setCheck(false);
      localStorage.setItem("theme", "light");
      setLocal("light");
    } else {
      setCheck(true);
      localStorage.setItem("theme", "dark");
      setLocal("dark");
    }
    localStorage?.getItem("theme") === "dark"
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  };

  // Active navlinks function
  interface NavLinkProps {
    to: string;
    className?: string;
    activeClassName?: string;
    inactiveClassName?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }

  function NavLink({
    to,
    className = "",
    activeClassName = "",
    inactiveClassName = "",
    children,
    ...rest
  }: NavLinkProps) {
    let location = useLocation();
    // Works (and its case-study children) must stay highlighted on child routes.
    let isActive =
      location.pathname === to || location.pathname.startsWith(`${to}/`);
    let allClassNames =
      className + (isActive ? `${activeClassName}` : `${inactiveClassName}`);
    return <Link className={allClassNames} to={to} {...rest}>{children}</Link>;
  }

  // Menu items for Homepage One
  const menuItem: MenuItem[] = [
    {
      id: "01",
      name: "Home",
      link: "/home/homePage",
      icon: <AiOutlineHome />,
    },
    {
      id: "02",
      name: "About",
      link: "/home/about",
      icon: <FaRegUser />,
    },
    {
      id: "06",
      name: "Experience",
      link: "/home/resume",
      icon: <CgNotes />,
    },
    {
      id: "03",
      name: "Works",
      link: "/home/works",
      icon: <FiCodesandbox />,
    },
    {
      id: "04",
      name: "Recommendations",
      link: "/home/recommendations",
      icon: <FaQuoteLeft />,
    },
    {
      id: "05",
      name: "Contact",
      link: "/home/contact",
      icon: <RiContactsBookLine />,
    },
  ];

  // Capability cards for the About page
  const serviceArray: ServiceItem[] = [
    {
      id: "1",
      icon: <FiCode />,
      title: "Software & Systems Engineering",
      des: "Design and deliver full-stack applications, backend APIs, and system integrations. I prioritize clear service boundaries, secure access, and architecture that stays maintainable as requirements evolve.",
      color: "#D566FF",
      bg: "#FCF4FF",
    },
    {
      id: "2",
      icon: <FiCloud />,
      title: "Cloud & Real-Time Systems",
      des: "Build cloud hosted, event driven systems that ingest and distribute high frequency data. My work with Azure, MQTT, WebSockets, and efficient serialization (Google ProtoBuf) emphasizes reliability, responsiveness, and operating cost efficiency.",
      color: "#DDA10C",
      bg: "#FEFAF0",
    },
    {
      id: "3",
      icon: <FiDatabase />,
      title: "Data Engineering & Analytics",
      des: "Engineer ETL pipelines, data models, and analytics workflows that turn raw operational data into usable insights. I focus on automation, data quality, processing performance, and practical integration with existing systems.",
      color: "#269FFF",
      bg: "#F3FAFF",
    },
    {
      id: "4",
      icon: <FiCpu />,
      title: "Applied AI & LLM Systems",
      des: "Design AI assisted workflows, language model integrations and pre-processing layers with attention to retrieval, orchestration, privacy, and predictable application behaviour.",
      color: "#FF6080",
      bg: "#FFF4F4",
    },
  ];

  // Experience page: professional roles, newest first
  const experienceRoleArray: ExperienceRoleItem[] = [
    {
      id: "fangtooth",
      company: "Fangtooth Inc.",
      title: "Co-Founder & CTO",
      date: "2024 - Present",
      location: "Toronto, Ontario, Canada",
      isCurrent: true,
      bg: "#FFF4F4",
      highlights: [
        "Architected and led implementation of a hybrid desktop-cloud financial analytics platform, integrating an Office.js/Vue 3 Excel add-in with a locally deployed FastAPI backend.",
        "Designed a configuration driven analytics engine using JSON DSL, DuckDB, and Parquet to power financial models, dataset validation, dynamic queries, and drill-down reporting.",
        "Engineered Azure Functions based authentication and cloud services, protected MSI distribution, Windows deployment, and Azure SQL to local SQLite reference data synchronization.",
        "Architected and implemented AI capabilities using LlamaIndex, Qdrant, Ollama, and multi-provider LLM integrations for document-grounded chat and financial insights.",
      ],
    },
    {
      id: "alumapower",
      company: "AlumaPower Corp.",
      title: "Full-Stack Developer & Data Engineer",
      date: "April 2022 - April 2026",
      location: "Kitchener, Ontario, Canada",
      isCurrent: false,
      bg: "#F8FBFB",
      highlights: [
        "Implemented a microservice architecture across a Vue.js client, Azure Functions encoder, and Python decoders for horizontal and vertical cell systems, unifying industrial monitoring and control workflows in one application.",
        "Engineered and optimized production telemetry with MQTT, Protocol Buffers, Azure App Service remote storage, buffered Azure Queue ingestion, Azure Data Explorer (Kusto), MongoDB Atlas, and Azure Web PubSub, decoupling high frequency ingestion from client updates to improve serialization efficiency and real time monitoring responsiveness.",
        "Built a one click Python Experiment Analysis application that replaced manual file imports, cleaning, Excel queries, and reporting. As a result, test technicians report analysis time fell from ~45 minutes to ~7 seconds per experiment.",
        "Delivered quality management and laboratory systems workflow applications using Vue.js, Node.js, MongoDB, Power Apps, Power Automate, and SharePoint, streamlining document uploads and data handling to reduce repetitive administrative work.",
      ],
    },
    {
      id: "genne-dmcc",
      company: "Genne DMCC",
      title: "Webmaster & Data Analysis",
      date: "October 2018 - May 2021",
      location: "Dubai, United Arab Emirates",
      isCurrent: false,
      highlights: [],
    },
    {
      id: "hp",
      company: "HP",
      title: "Information Technology Support Engineer",
      date: "July 2017 - January 2018",
      location: "Bengaluru, India",
      isCurrent: false,
      highlights: [],
    },
  ];

  // Experience page: technical skills grouped by discipline
  const skillGroupArray: SkillGroupItem[] = [
    {
      id: "software-engineering",
      category: "Software Engineering",
      terms: [
        "Python",
        "JavaScript",
        "Vue.js",
        "React",
        "Node.js",
        "Express.js",
        "FastAPI",
        "Flask",
        "Office.js",
        "Power Apps",
        "Power Automate",
      ],
    },
    {
      id: "cloud-devops",
      category: "Cloud & DevOps",
      terms: [
        "Azure",
        "AWS",
        "Azure Functions",
        "Azure App Service",
        "Azure Queue Storage",
        "Cloudflare R2",
        "Docker",
        "CI/CD",
        "WiX / MSI",
      ],
    },
    {
      id: "data-engineering",
      category: "Data Engineering",
      terms: [
        "DuckDB",
        "Parquet",
        "SQL",
        "SQLite",
        "MongoDB Atlas",
        "Cosmos DB",
        "Azure Data Explorer (Kusto)",
        "ETL Pipelines",
        "Grafana",
      ],
    },
    {
      id: "real-time-systems",
      category: "Real-Time Systems",
      terms: ["MQTT", "WebSockets", "Protocol Buffers", "Azure Web PubSub"],
    },
    {
      id: "ai-llm",
      category: "AI & LLM",
      terms: [
        "LLM Orchestration",
        "RAG",
        "LlamaIndex",
        "Qdrant",
        "Ollama",
        "Embeddings",
        "Vector Search",
        "Context Management",
      ],
    },
  ];

  // Experience page: education cards
  const educationArray: EducationItem[] = [
    {
      id: "lambton-college",
      qualification: "Computer Software & Database Development",
      institution: "Lambton College",
      date: "September 2021 – May 2023",
      location: "Sarnia, Ontario, Canada",
      note: "GPA: 3.87/4",
      bg: "#EEF5FA",
    },
    {
      id: "cambridge-institute",
      qualification: "Bachelor of Engineering - Electronics & Communication",
      institution: "Cambridge Institute of Technology",
      date: "2013 – 2017",
      location: "Bengaluru, India",
      bg: "#F2F4FF",
    },
  ];

  // Personal information for contact pages
  const contactArray: ContactItem[] = [
    {
      id: "02",
      icon: iconEmail,
      title: "Email ",
      item1: "stuart@stuartdaniells.com",
      item2: "stuart@stuartdaniells.com",
      bg: "#EEFBFF",
    },
    {
      id: "03",
      icon: iconMap,
      title: "Address ",
      item1: "Kitchener-Waterloo Region,",
      item2: "Ontario, Canada",
      bg: "#F2F4FF",
    },
  ];

  return {
    handleTheme,
    check,
    local,
    menuItem,
    NavLink,
    serviceArray,
    educationArray,
    experienceRoleArray,
    skillGroupArray,
    contactArray,
  };
};

export default AllData;
