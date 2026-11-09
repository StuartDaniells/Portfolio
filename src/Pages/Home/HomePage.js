import { Link } from "react-router-dom";
import resumeFile from "../../assets/images/Stuart Daniells Resume.pdf";
import {
  FaGithub,
  FaLinkedinIn
} from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import PageTitle from "../../Share/PageTitle";

const HomePage = () => {
  return (
    <>
      <PageTitle
        title="Home"
        documentTitle="Stuart Daniells | Software Engineer - AI, Cloud & Data Engineering"
        description="Stuart Daniells: 6+ years of software engineering experience, specializing in AI engineering, cloud services, and real time data pipelines"
      />
      {/* End pagetitle */}

      <div
        className="flex min-h-screen flex-col items-center justify-center px-4 py-10 text-center sm:px-6 md:min-h-[calc(100vh-4rem)] md:py-12 lg:min-h-[calc(100vh-12rem)] lg:py-8"
        data-aos="fade"
      >
        <div className="w-full max-w-3xl">
          <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight dark:text-white">
            Stuart Daniells
          </h1>
          <p className="mt-3 text-[clamp(1.125rem,2.4vw,1.5rem)] font-medium leading-snug text-[#44566C] dark:text-white sm:mt-4">
            Software Engineer
          </p>
          <p className="mt-1.5 text-balance text-sm font-medium text-[#44566C] dark:text-[#A6A6A6] sm:text-base">
            AI Engineering · Cloud Architecture · Data Pipelines
          </p>
          <p className="mt-2 text-xs font-medium text-[#565E6B] dark:text-[#C7C7C7] sm:text-sm">
            6+ years in software engineering
          </p>
          <p className="mx-auto mt-5 w-full max-w-[40rem] rounded-xl border border-[#E3E3E3] bg-white/80 p-5 text-left text-sm leading-6 text-[#7B7B7B] shadow-sm dark:border-[#3D3A3A] dark:bg-[#1D1D1D]/90 dark:text-[#A6A6A6] sm:mt-6 sm:p-6 sm:text-base sm:leading-7">
            I architect and build scalable cloud services, data intensive platforms and AI powered applications: from real time industrial
            telemetry to financial analytics. My focus is on thoughtful architecture, performance, and engineering reliable, maintainable systems.
          </p>
          <p className="mt-5 text-sm font-medium text-[#7B7B7B] dark:text-[#A6A6A6] sm:mt-6 sm:text-base">
            Co-Founder & CTO ·{" "}
            <a
              href="https://www.fangtooth.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm underline decoration-[#FA5252] underline-offset-4 transition-colors hover:text-[#FA5252] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FA5252] focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-offset-[#111111]"
            >
              Fangtooth Analytics Inc.
            </a>
          </p>
        </div>
        {/* Avatar Info End */}

        {/* Social information start */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 sm:mt-8 sm:gap-5">
          <a
            href="https://github.com/StuartDaniells"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in a new tab)"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FA5252] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#111111]"
          >
            <span className="socialbtn text-[#e14a84] ">
              <FaGithub aria-hidden="true" />
            </span>
          </a>
          <a
            href="https://www.linkedin.com/in/stuart-daniells/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in a new tab)"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FA5252] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#111111]"
          >
            <span className="socialbtn text-[#0072b1]">
              <FaLinkedinIn aria-hidden="true" />
            </span>
          </a>
        </div>
        {/* Social information end */}

        {/* Calls to action start */}
        <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4">
          <Link
            to="/home/works"
            className="inline-flex w-full items-center justify-center rounded-[35px] bg-gradient-to-r from-[#FA5252] to-[#DD2476] px-7 py-3 text-base text-white transition duration-200 ease-linear hover:bg-gradient-to-l focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FA5252] focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto sm:px-8 sm:text-lg"
          >
            Explore My Work
          </Link>
          <a
            href={resumeFile}
            download="Stuart Daniells Resume.pdf"
            className="inline-flex w-full items-center justify-center rounded-[35px] border border-[#FA5252] px-7 py-3 text-base font-medium text-[#FA5252] transition-colors duration-200 ease-linear hover:bg-[#FA5252] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FA5252] focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto"
          >
            <FiDownload aria-hidden="true" className="mr-2 text-lg" />
            Download Resume
          </a>
        </div>
        {/* Calls to action end */}
      </div>
    </>
  );
};

export default HomePage;
