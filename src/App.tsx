import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ContextProvider from "./Context/ContextProvider";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import Experience from "./Pages/Experience/Experience";
import Home from "./Pages/Home/Home";
import HomePage from "./Pages/Home/HomePage";
import Recommendations from "./Pages/Recommendations/Recommendations";
import CaseStudyPage from "./Pages/Works/CaseStudy/CaseStudyPage";
import Works from "./Pages/Works/Works";
import NotFound from "./Share/NotFound";
import BackToTop from "./Share/BackToTop";
import ScrollToTop from "./Share/ScrollToTop";

/** `/home/works/fangtooth` is not a page of its own - send it to the group anchor. */
const OrganizationRedirect = () => {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  return <Navigate to={`/home/works#${orgSlug ?? ""}`} replace />;
};

function App() {
  useEffect(() => {
    AOS.init({ duration: 1200 });
    AOS.refresh();
  }, []);
  return (
    <>
      <ContextProvider>
        <BrowserRouter>
          <ScrollToTop />
          <BackToTop />
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />}>
              <Route index element={<HomePage />} />
              <Route path="homePage" element={<HomePage />} />
              <Route path="resume" element={<Experience />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="recommendations" element={<Recommendations />} />
              {/* Legacy route: the Blogs page was replaced by Recommendations. */}
              <Route
                path="blogs"
                element={<Navigate to="/home/recommendations" replace />}
              />
              <Route path="works">
                <Route index element={<Works />} />
                <Route path=":orgSlug" element={<OrganizationRedirect />} />
                <Route path=":orgSlug/:studySlug" element={<CaseStudyPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ContextProvider>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
