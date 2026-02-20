import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaFemale,
  FaHandHoldingHeart,
  FaHeartbeat,
  FaLaptopCode,
  FaSearch,
  FaShieldAlt,
  FaThLarge,
} from "react-icons/fa";
import { FaChildren } from "react-icons/fa6";
import { MdElderly } from "react-icons/md";
import orphanEducation from "../assets/images/orphanage/education.jpg";
import orphanFood from "../assets/images/orphanage/food.webp";
import orphanHealth from "../assets/images/orphanage/health.jpg";
import elderFood from "../assets/images/elderly/food.jpg";
import elderLiving from "../assets/images/elderly/living.jpg";
import elderMedical from "../assets/images/elderly/medical.webp";
import medicalCamp from "../assets/images/Medical/camp.jpg";
import medicalCancer from "../assets/images/Medical/cancer.png";
import medicalKidney from "../assets/images/Medical/kidney.jpg";
import helmet from "../assets/images/communitySafety/helmet.png";
import rites from "../assets/images/socialWelfare/rites.png";
import kandyaDan from "../assets/images/socialWelfare/kanyadan.png";
import "./service.css";

const SERVICE_DATA = [
  {
    id: "orphan",
    label: "Orphan",
    icon: FaChildren,
    programs: [
      {
        title: "Education Support",
        description: "School enrollment, books, and learning support for every child.",
        image: orphanEducation,
        cta: "Donate Now",
        href: "/services/orphanage/education",
      },
      {
        title: "Nutritious Meal Program",
        description: "Daily nutritious meals to help children grow healthy and strong.",
        image: orphanFood,
        cta: "Donate Now",
        href: "/services/orphanage/meal",
      },
      {
        title: "Health & Medical Care",
        description: "Regular checkups, medicines, and timely healthcare for children.",
        image: orphanHealth,
        cta: "Donate Now",
        href: "/services/orphanage/health",
      },
    ],
  },
  {
    id: "elder",
    label: "Elderly",
    icon: MdElderly,
    programs: [
      {
        title: "Daily Meal Care",
        description: "Nutritious meals and hydration plans for seniors in need.",
        image: elderFood,
        cta: "Donate Now",
        href: "/services/elder/meal",
      },
      {
        title: "Dignified Living Support",
        description: "Comfortable shelter, clean essentials, and respectful care.",
        image: elderLiving,
        cta: "Donate Now",
        href: "/services/elder/living",
      },
      {
        title: "Medical Assistance",
        description: "Doctor visits, medicines, and regular health monitoring.",
        image: elderMedical,
        cta: "Donate Now",
        href: "/services/elder/medical",
      },
    ],
  },
  {
    id: "community-safety",
    label: "Community Safety",
    icon: FaShieldAlt,
    programs: [
      {
        title: "Helmet Distribution Drive",
        description: "Distributing certified safety helmets to riders to reduce head injuries and save lives.",
        image: helmet,
        cta: "Donate Now",
        href: "/services/safety/helmet",
      },
    ],
  },
  {
    id: "social-welfare",
    label: "Social Welfare",
    icon: FaHandHoldingHeart,
    programs: [
      {
        title: "Kanyadan Yojna",
        description: "Supporting marriage assistance for daughters from economically vulnerable families.",
        image: kandyaDan,
        cta: "Donate Now",
        href: "/services/welfare/kanyadan",
      },
      {
        title: "Dignified Last Rites",
        description: "Helping underprivileged families perform respectful and dignified final rites for loved ones.",
        image: rites,
        cta: "Donate Now",
        href: "/services/welfare/rites",
      },
    ],
  },
  {
    id: "medical-support",
    label: "Medical Support",
    icon: FaHeartbeat,
    programs: [
      {
        title: "Free Health Camp Checkups",
        description:
          "Regular free health camps offering doctor consultations, basic diagnostics, and early screening for vulnerable communities.",
        image: medicalCamp,
        cta: "Donate Now",
        href: "/services/medical/camp",
      },
      {
        title: "Cancer Treatment Support",
        description:
          "Financial aid for cancer treatment, including chemotherapy cycles, diagnostics, and essential medicines for patients in need.",
        image: medicalCancer,
        cta: "Donate Now",
        href: "/services/medical/cancer",
      },
      {
        title: "Kidney Dialysis Support",
        description:
          "Helping low-income patients afford recurring dialysis sessions and related treatment costs for long-term kidney care.",
        image: medicalKidney,
        cta: "Donate Now",
        href: "/services/medical/kidney",
      },
    ],
  },
  {
    id: "infrastructure-development",
    label: "Infrastructure Development",
    icon: FaBuilding,
    programs: [
      {
        title: "School & Learning Spaces",
        description: "Build and upgrade classrooms, benches, lighting, and learning corners.",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
        badge: "Development Program",
        cta: "Donate Now",
        href: "/donate",
      },
      {
        title: "Water & Sanitation Access",
        description: "Community toilets, clean drinking water points, and hygiene stations.",
        image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=1200&auto=format&fit=crop",
        badge: "Development Program",
        cta: "Donate Now",
        href: "/donate",
      },
      {
        title: "Rural Housing Repair",
        description: "Safe roofing, weatherproof walls, and repairs for vulnerable families.",
        image: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=1200&auto=format&fit=crop",
        badge: "Development Program",
        cta: "Donate Now",
        href: "/donate",
      },
    ],
  },
  {
    id: "women-empowerment",
    label: "Women",
    icon: FaFemale,
    programs: [
      {
        title: "Skill & Livelihood Training",
        description: "Tailoring, digital literacy, and income-generation training for women.",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
        badge: "Empowerment Program",
        cta: "Donate Now",
        href: "/donate",
      },
      {
        title: "Self-Help Group Support",
        description: "Micro-savings, business mentoring, and access to local markets.",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
        badge: "Empowerment Program",
        cta: "Donate Now",
        href: "/donate",
      },
      {
        title: "Legal & Health Awareness",
        description: "Awareness sessions on legal rights, safety, and reproductive health.",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
        badge: "Empowerment Program",
        cta: "Donate Now",
        href: "/donate",
      },
    ],
  },
  {
    id: "digital-india",
    label: "Digital India",
    icon: FaLaptopCode,
    programs: [
      {
        title: "Rural Digital Labs",
        description: "Computer labs and internet hubs for village students and youth.",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop",
        badge: "Digital Program",
        cta: "Donate Now",
        href: "/donate",
      },
      {
        title: "Digital Literacy Camps",
        description: "Hands-on classes for online forms, banking, and digital safety.",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
        badge: "Digital Program",
        cta: "Donate Now",
        href: "/donate",
      },
      {
        title: "Device Donation Drive",
        description: "Refurbished laptops and tablets for students from low-income homes.",
        image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=1200&auto=format&fit=crop",
        badge: "Digital Program",
        cta: "Donate Now",
        href: "/donate",
      },
    ],
  },
];

const ALL_CAUSES_ID = "all-causes";
const FEATURED_CHILD_CAUSE_ID = "orphan";

const CATEGORY_OPTIONS = [
  { id: ALL_CAUSES_ID, label: "All Causes", icon: FaThLarge },
  ...SERVICE_DATA.map((service) => ({
    id: service.id,
    label: service.label,
    icon: service.icon,
  })),
];

function ServicePage() {
  const navigate = useNavigate();
  const [activeServiceId, setActiveServiceId] = useState(SERVICE_DATA[0].id);
  const [query, setQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileQuickCauseId, setMobileQuickCauseId] = useState(FEATURED_CHILD_CAUSE_ID);
  const categoryScrollerRef = useRef(null);
  const categoryItemRefs = useRef({});

  const selectedService = useMemo(
    () => SERVICE_DATA.find((service) => service.id === activeServiceId) || null,
    [activeServiceId]
  );

  const allPrograms = useMemo(
    () =>
      SERVICE_DATA.flatMap((service) =>
        service.programs.map((program) => ({
          ...program,
          serviceLabel: service.label,
          serviceId: service.id,
        }))
      ),
    []
  );

  const sourcePrograms = useMemo(() => {
    if (activeServiceId === ALL_CAUSES_ID) {
      return allPrograms;
    }

    if (!selectedService) {
      return [];
    }

    return selectedService.programs.map((program) => ({
      ...program,
      serviceLabel: selectedService.label,
      serviceId: selectedService.id,
    }));
  }, [activeServiceId, allPrograms, selectedService]);

  const visiblePrograms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return sourcePrograms;

    return sourcePrograms.filter((program) => {
      return (
        program.title.toLowerCase().includes(normalizedQuery) ||
        program.description.toLowerCase().includes(normalizedQuery) ||
        program.serviceLabel.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, sourcePrograms]);

  const centerActiveCategory = (serviceId) => {
    const container = categoryScrollerRef.current;
    const categoryItem = categoryItemRefs.current[serviceId];
    if (!container || !categoryItem) return;

    const idealLeft = categoryItem.offsetLeft - (container.clientWidth - categoryItem.clientWidth) / 2;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const safeLeft = Math.max(0, Math.min(idealLeft, maxScrollLeft));

    container.scrollTo({
      left: safeLeft,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    centerActiveCategory(activeServiceId);
  }, [activeServiceId]);

  const mobileQuickCause = useMemo(() => {
    return (
      CATEGORY_OPTIONS.find((cause) => cause.id === mobileQuickCauseId) ||
      CATEGORY_OPTIONS.find((cause) => cause.id === FEATURED_CHILD_CAUSE_ID) ||
      CATEGORY_OPTIONS[1]
    );
  }, [mobileQuickCauseId]);

  const handleServiceChange = (serviceId) => {
    setActiveServiceId(serviceId);
    if (serviceId !== ALL_CAUSES_ID) {
      setMobileQuickCauseId(serviceId);
    }
    setMobileFilterOpen(false);
  };

  const moveActiveService = (direction) => {
    const currentIndex = CATEGORY_OPTIONS.findIndex((service) => service.id === activeServiceId);
    if (currentIndex < 0) return;

    const nextIndex = Math.max(0, Math.min(currentIndex + direction, CATEGORY_OPTIONS.length - 1));
    const nextCauseId = CATEGORY_OPTIONS[nextIndex].id;
    setActiveServiceId(nextCauseId);
    if (nextCauseId !== ALL_CAUSES_ID) {
      setMobileQuickCauseId(nextCauseId);
    }
    setMobileFilterOpen(false);
  };

  return (
    <section className="service-page">
      <header className="service-hero">
        <div className="service-hero-content">
          <h1>Hello, Changemaker!</h1>
          <p>
            Ready to make an impact? Browse through 10,000+ fundraisers and donate to make a
            difference!
          </p>
        </div>
      </header>

      <div className="service-layout">
        <div className="service-topbar">
          <div className="title-block">
            <h1>Explore Causes</h1>
            <span className="title-rule" />
          </div>

          <div className="topbar-controls">
            <label className="search-control" htmlFor="service-search">
              <FaSearch aria-hidden="true" />
              <input
                id="service-search"
                type="text"
                placeholder="Search for a cause"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="category-strip desktop-category-strip">
          <button
            type="button"
            className="scroll-btn"
            aria-label="Scroll left"
            onClick={() => moveActiveService(-1)}
          >
            <FaChevronLeft />
          </button>

          <div className="category-list" ref={categoryScrollerRef}>
            {CATEGORY_OPTIONS.map((service) => {
              const ServiceIcon = service.icon;
              const isActive = service.id === activeServiceId;

              return (
                <button
                  key={service.id}
                  ref={(node) => {
                    categoryItemRefs.current[service.id] = node;
                  }}
                  type="button"
                  className={`category-item ${isActive ? "is-active" : ""}`}
                  onClick={() => handleServiceChange(service.id)}
                  aria-pressed={isActive}
                >
                  <ServiceIcon className="category-icon" aria-hidden="true" />
                  <span>{service.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="scroll-btn"
            aria-label="Scroll right"
            onClick={() => moveActiveService(1)}
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="programs-head">
          <h2>DONATE ONE-TIME</h2>
          <span className="title-rule" />
        </div>

        <p className="programs-context">
          Showing sub-services under{" "}
          <strong>{activeServiceId === ALL_CAUSES_ID ? "All Causes" : selectedService?.label}</strong>
        </p>

        <div className="program-grid">
          {visiblePrograms.length > 0 ? (
            visiblePrograms.map((program) => (
              <article
                key={`${program.serviceId}-${program.title}`}
                className="program-card is-clickable"
                role="button"
                tabIndex={0}
                onClick={() => navigate(program.href)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(program.href);
                  }
                }}
                aria-label={`Read more about ${program.title}`}
              >
                <div className="program-media">
                  <img src={program.image} alt={program.title} loading="lazy" />
                  <div className="program-readmore" aria-hidden="true">
                    <span>Read More</span>
                    <span className="program-readmore-dots">...</span>
                  </div>
                </div>
                <div className="program-body">
                  {activeServiceId === ALL_CAUSES_ID && (
                    <span className="program-service-tag">{program.serviceLabel}</span>
                  )}
                  <h3>{program.title}</h3>
                  <p>{program.description}</p>
                  <Link
                    to={program.href}
                    className="program-donate-btn"
                    onClick={(event) => event.stopPropagation()}
                    aria-label={`${program.cta} now`}
                  >
                    {program.cta}
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <h3>No sub-services found</h3>
              <p>Try another search term or switch to a different service.</p>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className={`mobile-cause-backdrop ${mobileFilterOpen ? "open" : ""}`}
        onClick={() => setMobileFilterOpen(false)}
        aria-label="Close filter panel"
      />

      <div className={`mobile-cause-panel ${mobileFilterOpen ? "open" : ""}`}>
        <div className="mobile-cause-panel-head">
          <span className="line" />
          <h3>Filter by Cause</h3>
          <span className="line" />
        </div>

        <div className="mobile-cause-grid">
          {CATEGORY_OPTIONS.map((cause) => {
            const CauseIcon = cause.icon;
            const isActive = cause.id === activeServiceId;

            return (
              <button
                key={cause.id}
                type="button"
                className={`mobile-cause-item ${isActive ? "is-active" : ""}`}
                onClick={() => handleServiceChange(cause.id)}
              >
                <CauseIcon className="category-icon" aria-hidden="true" />
                <span>{cause.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="mobile-show-less"
          onClick={() => setMobileFilterOpen(false)}
        >
          <FaChevronUp aria-hidden="true" />
          <span>Show Less</span>
        </button>
      </div>

      <div className="mobile-cause-footer">
        <div className="mobile-cause-footer-title">
          <span className="line" />
          <h3>Filter by Cause</h3>
          <span className="line" />
        </div>

        <div className="mobile-cause-footer-actions">
          <button
            type="button"
            className={`mobile-quick-cause ${activeServiceId === ALL_CAUSES_ID ? "is-active" : ""}`}
            onClick={() => handleServiceChange(ALL_CAUSES_ID)}
          >
            <FaThLarge className="quick-icon" aria-hidden="true" />
            <span>All Causes</span>
          </button>

          <button
            type="button"
            className={`mobile-quick-cause ${activeServiceId !== ALL_CAUSES_ID && activeServiceId === mobileQuickCause?.id
              ? "is-active"
              : ""
              }`}
            onClick={() => handleServiceChange(mobileQuickCause?.id || FEATURED_CHILD_CAUSE_ID)}
          >
            {mobileQuickCause && <mobileQuickCause.icon className="quick-icon" aria-hidden="true" />}
            <span>{mobileQuickCause?.label || "Cause"}</span>
          </button>

          <button
            type="button"
            className="mobile-quick-cause more"
            onClick={() => setMobileFilterOpen(true)}
          >
            <span className="more-dots">...</span>
            <span>More</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ServicePage;
