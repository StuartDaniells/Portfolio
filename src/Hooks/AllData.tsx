import React, { useEffect, useState } from "react";

// blog post images
import blog6 from "../assets/images/blog_images/6.jpg";
import blog4 from "../assets/images/blog_images/4.jpg";
import blog2 from "../assets/images/blog_images/2.jpg";
import blog1 from "../assets/images/blog_images/1.jpg";
import blog3 from "../assets/images/blog_images/3.jpg";
import blog5 from "../assets/images/blog_images/5.jpg";
// blog image small
import blogSmall6 from "../assets/images/blog_images/small/6.jpg";
import blogSmall4 from "../assets/images/blog_images/small/4.jpg";
import blogSmall2 from "../assets/images/blog_images/small/2.jpg";
import blogSmall1 from "../assets/images/blog_images/small/1.jpg";
import blogSmall3 from "../assets/images/blog_images/small/3.jpg";
import blogSmall5 from "../assets/images/blog_images/small/5.jpg";

import img1 from "../assets/images/slider/brand-1.png";
import img2 from "../assets/images/slider/brand-2.png";
import img3 from "../assets/images/slider/brand-3.png";
import img4 from "../assets/images/slider/brand-4.png";
import img5 from "../assets/images/slider/brand-5.png";
// contact image
import iconPhone from "../assets/images/contact/phone-call 1.png";
import iconEmail from "../assets/images/contact/email 1.png";
import iconMap from "../assets/images/contact/map 1.png";
import { CgNotes } from "react-icons/cg";
import { FaBlogger, FaRegUser } from "react-icons/fa";
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

export interface BlogItem {
  id: string;
  img: any;
  imgSmall: any;
  date: string;
  category: string;
  title: string;
  bg: string;
  description: string;
}

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
  const [singleData, setSingleData] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);

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

  // The Works index reads its metadata from src/content/works.ts instead of
  // page-local demo data. Blog content below still feeds the Blog modal.

  // Elements for Blogs section
  const blogsData: BlogItem[] = [
    {
      id: "1",
      img: blog1,
      imgSmall: blogSmall1,
      date: "177 April",
      category: "Inspiration",
      title: "How to Own Your Audience by Creating an Email List.",
      bg: "#FCF4FF",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum conseqr quo obcaecati rerum sit non. Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur quo obcaecati rerum sit non. \n Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consetur quo obcaecati rerum sit non. Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur. \n Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur quo obcaecati rerum sit non. ",
    },
    {
      id: "4",
      img: blog4,
      imgSmall: blogSmall4,
      date: "000 April",
      category: "Inspiration",
      title: "Everything You Need to Know About Web Accessibility.",
      bg: "#EEFBFF",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum conseqr quo obcaecati rerum sit non. Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur quo obcaecati rerum sit non. \n Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consetur quo obcaecati rerum sit non. Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur. \n Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur quo obcaecati rerum sit non. ",
    },
    {
      id: "2",
      img: blog2,
      imgSmall: blogSmall2,
      date: "21 April",
      category: "Web Design",
      title: "The window know to say beside you",
      bg: "#FFF0F0",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum conseqr quo obcaecati rerum sit non. Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur quo obcaecati rerum sit non. \n Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consetur quo obcaecati rerum sit non. Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur. \n Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur quo obcaecati rerum sit non. ",
    },
    {
      id: "5",
      img: blog5,
      imgSmall: blogSmall5,
      date: "27 April",
      category: "Inspiration",
      title: "Top 10 Toolkits for Deep Learning in 2021.",
      bg: "#FCF4FF",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum conseqr quo obcaecati rerum sit non. Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur quo obcaecati rerum sit non. \n Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consetur quo obcaecati rerum sit non. Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur. \n Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur quo obcaecati rerum sit non. ",
    },
    {
      id: "3",
      img: blog3,
      imgSmall: blogSmall3,
      date: "27 April",
      category: "Inspiration",
      title: "How to Own Your Audience by Creating an Email List.",
      bg: "#FCF4FF",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum conseqr quo obcaecati rerum sit non. Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur quo obcaecati rerum sit non. \n Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consetur quo obcaecati rerum sit non. Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur. \n Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur quo obcaecati rerum sit non. ",
    },
    {
      id: "6",
      img: blog6,
      imgSmall: blogSmall6,
      date: "27 April",
      category: "Inspiration",
      title: "Everything You Need to Know About Web Accessibility.",
      bg: "#EEFBFF",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum conseqr quo obcaecati rerum sit non. Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur quo obcaecati rerum sit non. \n Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consetur quo obcaecati rerum sit non. Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur. \n Lorem ipsum dolor, sit amet consectetur adipisicing  elit. Fuga consequatur delectus porro sapiente molestias, magni quasi sed, enim corporis omnis doloremque soluta inventore dolorum consequuntur quo obcaecati rerum sit non. ",
    },
  ];

  // find items for Blogs  modal open
  const handleBlogsData = (id: string) => {
    const find = blogsData.find((item) => item?.id === id);
    setSingleData(find);
    setIsOpen(true);
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
      name: "Blogs",
      link: "/home/blogs",
      icon: <FaBlogger />,
    },
    {
      id: "05",
      name: "Contact",
      link: "/home/contact",
      icon: <RiContactsBookLine />,
    },
  ];

  // Slider image for Clients
  const sliderImg = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img1,
    img2,
    img3,
    img4,
    img5,
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
      des: "Build cloud hosted, event driven systems that ingest and distribute high frequency data. My work with Azure, MQTT, WebSockets, and efficient serialization (Google ProtoBuf) emphasizes reliability, responsiveness, and operating-cost efficiency.",
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
        "Engineered and optimized production telemetry with MQTT, Protocol Buffers, Azure App Service remote storage, buffered Azure Queue ingestion, Azure Data Explorer (Kusto), MongoDB Atlas, and Azure Web PubSub, decoupling high-frequency ingestion from client updates to improve serialization efficiency and real-time monitoring responsiveness.",
        "Built a one-click Python Experiment Analysis application that replaced manual file imports, cleaning, Excel queries, and reporting. As a result, test technicians report analysis time fell from ~45 minutes to ~7 seconds per experiment.",
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
      id: "01",
      icon: iconPhone,
      title: "Phone ",
      item1: "+452 666 386",
      item2: "+452 666 386",
      bg: "#FCF4FF",
    },
    {
      id: "02",
      icon: iconEmail,
      title: "Email ",
      item1: "support@gmail.com",
      item2: "example@gmail.com",
      bg: "#EEFBFF",
    },
    {
      id: "03",
      icon: iconMap,
      title: "Address ",
      item1: "Maount View, Oval",
      item2: "Road, New York, USA",
      bg: "#F2F4FF",
    },
  ];

  return {
    handleTheme,
    check,
    local,
    singleData,
    isOpen,
    setIsOpen,
    blogsData,
    handleBlogsData,
    menuItem,
    NavLink,
    serviceArray,
    sliderImg,
    educationArray,
    experienceRoleArray,
    skillGroupArray,
    contactArray,
  };
};

export default AllData;
