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
import { useLanguage } from "../utils/useLanguage.jsx";
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
import road from "../assets/images/infrastructure/road.jpg";
import widow from "../assets/images/women/widow.png";
import "./service.css";

const SERVICE_DATA = [
  {
    id: "orphan",
    label: "Orphan",
    labelHi: "अनाथ",
    icon: FaChildren,
    programs: [
      {
        title: "Education Support",
        titleHi: "शिक्षा सहायता",
        description: "School enrollment, books, and learning support for every child.",
        descriptionHi: "हर बच्चे के लिए स्कूल नामांकन, किताबें और सीखने का समर्थन।",
        image: orphanEducation,
        cta: "Donate Now",
        href: "/services/orphanage/education",
        donationTitle: "Help provide education support for children in orphanage care",
      },
      {
        title: "Nutritious Meal Program",
        titleHi: "पौष्टिक भोजन कार्यक्रम",
        description: "Daily nutritious meals to help children grow healthy and strong.",
        descriptionHi: "बच्चों को स्वस्थ और मजबूत बनाने के लिए दैनिक पौष्टिक भोजन।",
        image: orphanFood,
        cta: "Donate Now",
        href: "/services/orphanage/meal",
        donationTitle: "Provide high-quality nutritious meals for orphans",
      },
      {
        title: "Health & Medical Care",
        titleHi: "स्वास्थ्य और चिकित्सा देखभाल",
        description: "Regular checkups, medicines, and timely healthcare for children.",
        descriptionHi: "बच्चों के लिए नियमित जाँच, दवाइयाँ और समय पर स्वास्थ्य सेवा।",
        image: orphanHealth,
        cta: "Donate Now",
        href: "/services/orphanage/health",
        donationTitle: "Help provide healthcare and medical support for children in orphanage care",
      },
    ],
  },
  {
    id: "elder",
    label: "Elderly",
    labelHi: "बुजुर्ग",
    icon: MdElderly,
    programs: [
      {
        title: "Daily Meal Care",
        titleHi: "दैनिक भोजन देखभाल",
        description: "Nutritious meals and hydration plans for seniors in need.",
        descriptionHi: "जरूरतमंद बुजुर्गों के लिए पौष्टिक भोजन और जलयोजना।",
        image: elderFood,
        cta: "Donate Now",
        href: "/services/elder/meal",
        donationTitle: "Provide daily nutritious meals for abandoned elderly",
      },
      {
        title: "Dignified Living Support",
        titleHi: "सम्मानजनक जीवन सहायता",
        description: "Comfortable shelter, clean essentials, and respectful care.",
        descriptionHi: "आरामदायक आश्रय, स्वच्छ आवश्यकताएं और सम्मानजनक देखभाल।",
        image: elderLiving,
        cta: "Donate Now",
        href: "/services/elder/living",
        donationTitle: "Provide dignified living and shelter for abandoned elderly",
      },
      {
        title: "Medical Assistance",
        titleHi: "चिकित्सा सहायता",
        description: "Doctor visits, medicines, and regular health monitoring.",
        descriptionHi: "डॉक्टर की मुलाकात, दवाइयाँ और नियमित स्वास्थ्य निगरानी।",
        image: elderMedical,
        cta: "Donate Now",
        href: "/services/elder/medical",
        donationTitle: "Provide urgent medical assistance and life-saving care",
      },
    ],
  },
  {
    id: "community-safety",
    label: "Community Safety",
    labelHi: "सामुदायिक सुरक्षा",
    icon: FaShieldAlt,
    programs: [
      {
        title: "Helmet Distribution Drive",
        titleHi: "हेलमेट वितरण अभियान",
        description: "Distributing certified safety helmets to riders to reduce head injuries and save lives.",
        descriptionHi: "सिर की चोटों को कम करने और जीवन बचाने के लिए सवारों को प्रमाणित सुरक्षा हेलमेट वितरित करना।",
        image: helmet,
        cta: "Donate Now",
        href: "/services/safety/helmet",
        donationTitle: "Protect Lives: Nationwide Helmet Distribution Drive",
      },
    ],
  },
  {
    id: "social-welfare",
    label: "Social Welfare",
    labelHi: "सामाजिक कल्याण",
    icon: FaHandHoldingHeart,
    programs: [
      {
        title: "Kanyadan Yojna",
        titleHi: "कन्यादान योजना",
        description: "Supporting marriage assistance for daughters from economically vulnerable families.",
        descriptionHi: "आर्थिक रूप से कमजोर परिवारों की बेटियों के लिए विवाह सहायता।",
        image: kandyaDan,
        cta: "Donate Now",
        href: "/services/welfare/kanyadan",
        donationTitle: "Support a daughter's wedding through Kanyadan Yojna",
      },
      {
        title: "Dignified Last Rites",
        titleHi: "सम्मानजनक अंतिम संस्कार",
        description: "Helping underprivileged families perform respectful and dignified final rites for loved ones.",
        descriptionHi: "वंचित परिवारों को अपने प्रियजनों के लिए सम्मानजनक अंतिम संस्कार करने में मदद।",
        image: rites,
        cta: "Donate Now",
        href: "/services/welfare/rites",
        donationTitle: "Support Dignified Last Rites: A Respectful Farewell for the Underprivileged",
      },
    ],
  },
  {
    id: "medical-support",
    label: "Medical Support",
    labelHi: "चिकित्सा सहायता",
    icon: FaHeartbeat,
    programs: [
      {
        title: "Free Health Camp Checkups",
        titleHi: "मुफ्त स्वास्थ्य शिविर जाँच",
        description:
          "Regular free health camps offering doctor consultations, basic diagnostics, and early screening for vulnerable communities.",
        descriptionHi: "कमजोर समुदायों के लिए डॉक्टर परामर्श, बुनियादी निदान और प्रारंभिक जाँच के नियमित मुफ्त स्वास्थ्य शिविर।",
        image: medicalCamp,
        cta: "Donate Now",
        href: "/services/medical/camp",
        donationTitle: "Fund a Mega Free Health Checkup Camp for rural communities",
      },
      {
        title: "Cancer Treatment Support",
        titleHi: "कैंसर उपचार सहायता",
        description:
          "Financial aid for cancer treatment, including chemotherapy cycles, diagnostics, and essential medicines for patients in need.",
        descriptionHi: "जरूरतमंद रोगियों के लिए कीमोथेरेपी, निदान और आवश्यक दवाइयों सहित कैंसर उपचार के लिए वित्तीय सहायता।",
        image: medicalCancer,
        cta: "Donate Now",
        href: "/services/medical/cancer",
        donationTitle: "Support Life-Saving Cancer Treatments & Care",
      },
      {
        title: "Kidney Dialysis Support",
        titleHi: "किडनी डायलिसिस सहायता",
        description:
          "Helping low-income patients afford recurring dialysis sessions and related treatment costs for long-term kidney care.",
        descriptionHi: "कम आय वाले रोगियों को आवर्ती डायलिसिस सत्र और दीर्घकालिक किडनी देखभाल की लागत वहन करने में मदद।",
        image: medicalKidney,
        cta: "Donate Now",
        href: "/services/medical/kidney",
        donationTitle: "Support Life-Saving Kidney Dialysis & Care",
      },
    ],
  },
  {
    id: "infrastructure-development",
    label: "Infrastructure",
    labelHi: "बुनियादी ढांचा",
    icon: FaBuilding,
    programs: [
      {
        title: "Road Construction",
        titleHi: "सड़क निर्माण",
        description: "Build and upgrade roads, pathways, and connectivity for rural communities.",
        descriptionHi: "ग्रामीण समुदायों के लिए सड़कें, रास्ते और कनेक्टिविटी बनाएं और उन्नत करें।",
        image: road,
        badge: "Development Program",
        cta: "Donate Now",
        href: "/services/infrastructure/road-construction",
        donationTitle: "Support Rural Road Construction for Community Connectivity",
      },
    
    ],
  },
  {
    id: "women-empowerment",
    label: "Women",
    labelHi: "महिला",
    icon: FaFemale,
    programs: [
      {
        title: "Hope for Widowed Womens",
        titleHi: "विधवा महिलाओं के लिए आशा",
        description:"We provide regular financial support to widowed women to help them meet their daily needs.",
        descriptionHi: "हम विधवा महिलाओं को उनकी दैनिक जरूरतों को पूरा करने में मदद के लिए नियमित वित्तीय सहायता प्रदान करते हैं।",
        image: widow,
        badge: "Empowerment Program",
        cta: "Donate Now",
        href: "/services/women/widow-women",
        donationTitle: "Empower Widow Women with Financial and Social Support",
      },
      

    ],
  },
  // {
  //   id: "digital-india",
  //   label: "Digital India",
  //   icon: FaLaptopCode,
  //   programs: [
  //     {
  //       title: "Rural Digital Labs",
  //       description: "Computer labs and internet hubs for village students and youth.",
  //       image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop",
  //       badge: "Digital Program",
  //       cta: "Donate Now",
  //       href: "/donate",
  //     },
  //     {
  //       title: "Digital Literacy Camps",
  //       description: "Hands-on classes for online forms, banking, and digital safety.",
  //       image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
  //       badge: "Digital Program",
  //       cta: "Donate Now",
  //       href: "/donate",
  //     },
  //     {
  //       title: "Device Donation Drive",
  //       description: "Refurbished laptops and tablets for students from low-income homes.",
  //       image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=1200&auto=format&fit=crop",
  //       badge: "Digital Program",
  //       cta: "Donate Now",
  //       href: "/donate",
  //     },
  //   ],
  // },
];

const ALL_CAUSES_ID = "all-causes";
const FEATURED_CHILD_CAUSE_ID = "orphan";

const CATEGORY_OPTIONS = [
  { id: ALL_CAUSES_ID, label: "All Causes", labelHi: "सभी कारण", icon: FaThLarge },
  ...SERVICE_DATA.map((service) => ({
    id: service.id,
    label: service.label,
    labelHi: service.labelHi,
    icon: service.icon,
  })),
];

function ServicePage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isHi = language === "hi";
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
          serviceLabelHi: service.labelHi,
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
      serviceLabelHi: selectedService.labelHi,
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
        program.serviceLabel.toLowerCase().includes(normalizedQuery) ||
        (program.titleHi && program.titleHi.includes(normalizedQuery)) ||
        (program.descriptionHi && program.descriptionHi.includes(normalizedQuery)) ||
        (program.serviceLabelHi && program.serviceLabelHi.includes(normalizedQuery))
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
          <h1>{isHi ? "नमस्ते, परिवर्तनकर्ता!" : "Hello, Changemaker!"}</h1>
          <p>
            {isHi
              ? "प्रभाव डालने के लिए तैयार हैं? 10,000+ फंडरेजर ब्राउज़ करें और बदलाव लाने के लिए दान करें!"
              : "Ready to make an impact? Browse through 10,000+ fundraisers and donate to make a difference!"}
          </p>
        </div>
      </header>

      <div className="service-layout">
        <div className="service-topbar">
          <div className="title-block">
            <h1>{isHi ? "कारणों का पता लगाएं" : "Explore Causes"}</h1>
            <span className="title-rule" />
          </div>

          <div className="topbar-controls">
            <label className="search-control" htmlFor="service-search">
              <FaSearch aria-hidden="true" />
              <input
                id="service-search"
                type="text"
                placeholder={isHi ? "कोई कारण खोजें" : "Search for a cause"}
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
                  <span>{isHi ? (service.labelHi || service.label) : service.label}</span>
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
          <h2>{isHi ? "एक बार दान करें" : "DONATE ONE-TIME"}</h2>
          <span className="title-rule" />
        </div>

        <p className="programs-context">
          {isHi ? "उप-सेवाएं दिखाई जा रही हैं" : "Showing sub-services under"}{" "}
          <strong>{activeServiceId === ALL_CAUSES_ID ? (isHi ? "सभी कारण" : "All Causes") : (isHi ? (selectedService?.labelHi || selectedService?.label) : selectedService?.label)}</strong>
        </p>

        <div className="program-grid">
          {visiblePrograms.length > 0 ? (
            visiblePrograms.map((program) => (
              <article
                key={`${program.serviceId}-${program.title}`}
                className="program-card"
              >
                <Link
                  to={program.href}
                  className="program-media-link"
                  aria-label={`Read more about ${program.title}`}
                >
                  <div className="program-media">
                    <img src={program.image} alt={isHi ? (program.titleHi || program.title) : program.title} loading="lazy" />
                    <div className="program-readmore" aria-hidden="true">
                      <span>{isHi ? "और पढ़ें" : "Read More"}</span>
                      <span className="program-readmore-dots">...</span>
                    </div>
                  </div>
                </Link>
                <div className="program-body">
                  {activeServiceId === ALL_CAUSES_ID && (
                    <span className="program-service-tag">{isHi ? (program.serviceLabelHi || program.serviceLabel) : program.serviceLabel}</span>
                  )}
                  <h3>{isHi ? (program.titleHi || program.title) : program.title}</h3>
                  <p>{isHi ? (program.descriptionHi || program.description) : program.description}</p>
                  <Link
                    to="/donate"
                    state={{ 
                      serviceImage: program.image, 
                      serviceTitle: program.donationTitle 
                    }}
                    className="program-donate-btn"
                    aria-label={`${program.cta} now`}
                  >
                    {isHi ? "अभी दान करें" : program.cta}
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <h3>{isHi ? "कोई उप-सेवा नहीं मिली" : "No sub-services found"}</h3>
              <p>{isHi ? "कोई अन्य खोज शब्द आज़माएं या किसी अन्य सेवा पर जाएं।" : "Try another search term or switch to a different service."}</p>
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
          <h3>{isHi ? "कारण से फ़िल्टर करें" : "Filter by Cause"}</h3>
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
                <span>{isHi ? (cause.labelHi || cause.label) : cause.label}</span>
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
          <span>{isHi ? "कम दिखाएं" : "Show Less"}</span>
        </button>
      </div>

      <div className="mobile-cause-footer">
        <div className="mobile-cause-footer-title">
          <span className="line" />
          <h3>{isHi ? "कारण से फ़िल्टर करें" : "Filter by Cause"}</h3>
          <span className="line" />
        </div>

        <div className="mobile-cause-footer-actions">
          <button
            type="button"
            className={`mobile-quick-cause ${activeServiceId === ALL_CAUSES_ID ? "is-active" : ""}`}
            onClick={() => handleServiceChange(ALL_CAUSES_ID)}
          >
            <FaThLarge className="quick-icon" aria-hidden="true" />
            <span>{isHi ? "सभी कारण" : "All Causes"}</span>
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
            <span>{isHi ? (mobileQuickCause?.labelHi || mobileQuickCause?.label || "कारण") : (mobileQuickCause?.label || "Cause")}</span>
          </button>

          <button
            type="button"
            className="mobile-quick-cause more"
            onClick={() => setMobileFilterOpen(true)}
          >
            <span className="more-dots">...</span>
            <span>{isHi ? "और" : "More"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ServicePage;
