import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaChevronDown,
    FaHandHoldingHeart,
    FaRegClock,
    FaShieldAlt,
    FaUserCircle,
} from "react-icons/fa";
import { useLanguage, translate } from "../../../utils/useLanguage.jsx";
import { orphanHealthTranslations } from "../../../utils/serviceTranslations.js";
// Ensure you have a suitable image at this path
import orphanHealth from "../../../assets/images/orphanage/health.jpg";
import "./health.css";

const DONATIONS = [
    { name: "Rajesh Khanna", amount: 25000, note: "For emergency funds" },
    { name: "Ananya Sharma", amount: 12000, note: "Top Donor" },
    { name: "Mohit Agarwal", amount: 8000, note: "Vaccination drive" },
    { name: "Priya Singh", amount: 5000, note: "Monthly supporter" },
    { name: "Karan Johar", amount: 4500, note: "Quick recovery" },
    { name: "Sneha Patel", amount: 3000, note: "For essential medicines" },
    { name: "Anonymous", amount: 2500, note: "Joined today" },
    { name: "V. R. Iyer", amount: 2000, note: "With gratitude" },
    { name: "Jaspreet Singh", amount: 1500, note: "Stay healthy" },
    { name: "Nisha Gupta", amount: 1100, note: "Best wishes" },
    { name: "Amit Verma", amount: 1000, note: "Small effort" },
    { name: "Deepak Kumar", amount: 800, note: "For the kids" },
    { name: "Anonymous", amount: 500, note: "Blessings" },
    { name: "Riya Sen", amount: 500, note: "Support healthcare" },
];

const FAQS = [
    {
        question: "How does this healthcare fundraiser help children?",
        answer:
            "Funds are strictly utilized for regular medical checkups, vaccinations, emergency treatments, dental care, and essential medicines for children in orphanage care.",
        questionHi: "यह स्वास्थ्यसेवा धन संचय बच्चों को कैसे मदद करता है?",
        answerHi: "धन को नियमित चिकित्सा जांच, टीकाकरण, आपातकालीन उपचार, दंत चिकित्सा देखभाल और अनाथालय देखभाल में बच्चों के लिए आवश्यक दवाओं के लिए कड़ाई से उपयोग किया जाता है।",
    },
    {
        question: "Is my donation secure?",
        answer:
            "Yes. Donations are processed through secure payment channels and campaign-level records are maintained for accountability.",
        questionHi: "क्या मेरा दान सुरक्षित है?",
        answerHi: "हाँ। दान को सुरक्षित भुगतान चैनलों के माध्यम से संसाधित किया जाता है और जवाबदेही के लिए अभियान-स्तरीय रिकॉर्ड बनाए रखे जाते हैं।",
    },
    {
        question: "Will I get a donation confirmation?",
        answer:
            "Yes. You receive confirmation as soon as your contribution is completed successfully.",
        questionHi: "क्या मुझे दान की पुष्टि मिलेगी?",
        answerHi: "हाँ। आप अपना योगदान सफलतापूर्वक पूर्ण होते ही पुष्टि प्राप्त करते हैं।",
    },
    {
        question: "Can I support this fundraiser monthly?",
        answer:
            "Yes. You can return and donate again any time, or set up a recurring donation to ensure long-term medical security for the children.",
        questionHi: "क्या मैं इस धन संचय को मासिक समर्थन कर सकता हूँ?",
        answerHi: "हाँ। आप कभी भी वापस आ सकते हैं और फिर से दान कर सकते हैं, या बच्चों के लिए दीर्घकालीन चिकित्सा सुरक्षा सुनिश्चित करने के लिए एक आवर्ती दान स्थापित कर सकते हैं।",
    },
    {
        question: "Can I share this campaign with friends?",
        answer:
            "Yes. You can use the Share button to quickly send this page to your contacts and help this medical cause reach more people.",
        questionHi: "क्या मैं इस अभियान को दोस्तों के साथ साझा कर सकता हूँ?",
        answerHi: "हाँ। आप इस पृष्ठ को अपने संपर्कों को जल्दी भेजने के लिए साझा बटन का उपयोग कर सकते हैं और इस चिकित्सा कारण को अधिक लोगों तक पहुंचने में मदद कर सकते हैं।",
    },
];

const STORY = [
    {
        en: "Access to proper healthcare is vital for a child's growth, yet many children in orphanage care lack the necessary funds for regular checkups, vaccinations, and emergency medical treatments.",
        hi: "उचित स्वास्थ्यसेवा तक पहुंच बच्चे के विकास के लिए महत्वपूर्ण है, फिर भी अनाथालय देखभाल में कई बच्चों के पास नियमित जांच, टीकाकरण और आपातकालीन चिकित्सा उपचार के लिए आवश्यक धन नहीं है।",
    },
    {
        en: "This healthcare fundraiser aims to build a robust medical fund to cover hospital bills, essential medicines, routine doctor visits, and specialized care for children who fall ill or have chronic conditions.",
        hi: "यह स्वास्थ्य सेवा धन संचय अभियान अस्पताल के बिल, आवश्यक दवाएं, नियमित डॉक्टर की यात्राएं और बीमार बच्चों या पुरानी बीماरियों वाले बच्चों के लिए विशेष देखभाल को कवर करने के लिए एक मजबूत चिकित्सा कोष बनाने का लक्ष्य रखता है।",
    },
    {
        en: "With your generous support, we can ensure these children receive timely and professional medical attention, helping them recover quickly, stay strong, and live healthy, active lives.",
        hi: "आपके उदार समर्थन से, हम सुनिश्चित कर सकते हैं कि ये बच्चे समय पर और पेशेवर चिकित्सा ध्यान प्राप्त करते हैं, जिससे वे जल्दी ठीक हो जाते हैं, मजबूत रहते हैं और स्वस्थ, सक्रिय जीवन जीते हैं।",
    },
];

function OrphanageHealthPage() {
    const { language } = useLanguage();
    const [storyExpanded, setStoryExpanded] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    const [shareLabel, setShareLabel] = useState("Share");
    const [donationModalType, setDonationModalType] = useState(null);

    const isDonationModalOpen = donationModalType !== null;
    const sortedDonations = useMemo(
        () => [...DONATIONS].sort((a, b) => b.amount - a.amount),
        []
    );
    const modalDonations =
        donationModalType === "top" ? sortedDonations.slice(0, 10) : sortedDonations;
    const modalTitle = donationModalType === "top" ? translate("topDonations", orphanHealthTranslations, language) : translate("allDonations", orphanHealthTranslations, language);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!isDonationModalOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const closeOnEscape = (event) => {
            if (event.key === "Escape") {
                setDonationModalType(null);
            }
        };

        window.addEventListener("keydown", closeOnEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [isDonationModalOpen]);

    const formatAmount = (amount) => `Rs ${amount.toLocaleString("en-IN")}`;

    const handleShare = async () => {
        const pageUrl = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: translate("title", orphanHealthTranslations, language),
                    text: translate("supportDesc", orphanHealthTranslations, language),
                    url: pageUrl,
                });
                return;
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(pageUrl);
                setShareLabel(translate("linkCopied", orphanHealthTranslations, language));
                window.setTimeout(() => setShareLabel(translate("share", orphanHealthTranslations, language)), 1600);
            }
        } catch {
            setShareLabel(translate("share", orphanHealthTranslations, language));
        }
    };

    return (
        <section className="health-detail-page">
            <div className="health-detail-shell">
                <div className="health-content-grid">
                    <aside className="health-side-stack">
                        <article className="campaign-card">
                            <div className="campaign-image-wrap">
                                <img src={orphanHealth} alt="Children receiving medical checkups" />
                                <span className="campaign-chip">Tax Benefits Available</span>
                            </div>

                            <div className="campaign-body">
                                <h1>{translate("title", orphanHealthTranslations, language)}</h1>
                                <p className="campaign-org">{translate("organization", orphanHealthTranslations, language)}</p>

                                <div className="campaign-amounts">
                                    <strong>Rs 3,45,000</strong>
                                    <span>{translate("raisedOf", orphanHealthTranslations, language)} Rs 5,00,000 {translate("goal", orphanHealthTranslations, language)}</span>
                                </div>

                                <div className="campaign-progress" aria-hidden="true">
                                    <span className="campaign-progress-fill" style={{ width: "69%" }} />
                                </div>

                                <div className="campaign-stats">
                                    <div>
                                        <strong>189</strong>
                                        <span>{translate("donors", orphanHealthTranslations, language)}</span>
                                    </div>
                                    <div>
                                        <strong>21</strong>
                                        <span>{translate("daysLeft", orphanHealthTranslations, language)}</span>
                                    </div>
                                    <div>
                                        <strong>69%</strong>
                                        <span>{translate("funded", orphanHealthTranslations, language)}</span>
                                    </div>
                                </div>

                                <div className="campaign-actions">
                                    <Link to="/donate" state={{ serviceImage: orphanHealth, serviceTitle: translate("title", orphanHealthTranslations, language) }} className="campaign-btn campaign-btn-primary">
                                        {translate("donateNow", orphanHealthTranslations, language)}
                                    </Link>
                                    <button
                                        type="button"
                                        className="campaign-btn campaign-btn-secondary"
                                        onClick={handleShare}
                                    >
                                        {shareLabel === translate("share", orphanHealthTranslations, language) ? translate("share", orphanHealthTranslations, language) : translate("linkCopied", orphanHealthTranslations, language)}
                                    </button>
                                </div>
                            </div>
                        </article>
                    </aside>

                    <div className="health-main-stack">
                        <section className="health-section-card">
                            <h2>{translate("storyTitle", orphanHealthTranslations, language) || "Story"}</h2>
                            <div className={`story-content ${storyExpanded ? "expanded" : ""}`}>
                                {STORY.map((paragraph, idx) => (
                                    <p key={idx}>{language === 'hi' ? paragraph.hi : paragraph.en}</p>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="text-action"
                                onClick={() => setStoryExpanded((current) => !current)}
                            >
                                {storyExpanded ? translate("readLess", orphanHealthTranslations, language) || "Read Less" : translate("readMore", orphanHealthTranslations, language) || "Read More"}
                            </button>
                        </section>

                        <section className="health-section-card">
                            <div className="section-head">
                                <h2>{translate("recentDonations", orphanHealthTranslations, language) || "Recent Donations"}</h2>
                                <span>189 Donations</span>
                            </div>

                            <div className="donation-list">
                                {sortedDonations.slice(0, 3).map((donation) => (
                                    <article key={`${donation.name}-${donation.amount}`} className="donation-item">
                                        <FaUserCircle aria-hidden="true" />
                                        <div>
                                            <h3>{donation.name === "Anonymous" ? translate("anonymous", orphanHealthTranslations, language) : donation.name}</h3>
                                            <p>{formatAmount(donation.amount)}</p>
                                        </div>
                                        <span>{donation.note}</span>
                                    </article>
                                ))}
                            </div>

                            <div className="section-links">
                                <button type="button" onClick={() => setDonationModalType("top")}>
                                    {translate("topDonations", orphanHealthTranslations, language) || "View Top Donations"}
                                </button>
                                <button type="button" onClick={() => setDonationModalType("all")}>
                                    {translate("allDonations", orphanHealthTranslations, language) || "View All Donations"}
                                </button>
                            </div>
                        </section>

                        <section className="support-panel">
                            <h2>{translate("supportTitle", orphanHealthTranslations, language)}</h2>
                            <p>{translate("supportDesc", orphanHealthTranslations, language)}</p>
                            <div className="support-actions">
                                <Link to="/donate" state={{ serviceImage: orphanHealth, serviceTitle: translate("title", orphanHealthTranslations, language) }} className="campaign-btn campaign-btn-primary">
                                    {translate("donateNow", orphanHealthTranslations, language)}
                                </Link>
                                <button
                                    type="button"
                                    className="campaign-btn campaign-btn-secondary"
                                    onClick={handleShare}
                                >
                                    {translate("share", orphanHealthTranslations, language)}
                                </button>
                            </div>
                        </section>

                        <section className="health-section-card">
                            <h2>Organizers</h2>
                            <div className="organizer-list">
                                <article className="organizer-item">
                                    <span className="organizer-logo">GA</span>
                                    <div>
                                        <h3>Guardian of Angels Trust</h3>
                                        <p>Verified Charity</p>
                                    </div>
                                </article>
                                <article className="organizer-item">
                                    <span className="organizer-logo organizer-logo-alt">g</span>
                                    <div>
                                        <h3>Give</h3>
                                        <p>Organizer</p>
                                    </div>
                                </article>
                            </div>
                        </section>

                        <section className="trust-strip">
                            <h2>India&apos;s trusted online donation platform</h2>
                            <div className="trust-grid">
                                <article>
                                    <FaShieldAlt aria-hidden="true" />
                                    <div>
                                        <h3>Easy</h3>
                                        <p>Donate quickly and securely in a few steps.</p>
                                    </div>
                                </article>
                                <article>
                                    <FaHandHoldingHeart aria-hidden="true" />
                                    <div>
                                        <h3>Impactful</h3>
                                        <p>Your support provides life-saving medicines and timely medical care.</p>
                                    </div>
                                </article>
                                <article>
                                    <FaRegClock aria-hidden="true" />
                                    <div>
                                        <h3>Credible</h3>
                                        <p>Campaign records and charity details are maintained clearly.</p>
                                    </div>
                                </article>
                            </div>
                        </section>

                        <section className="health-section-card faq-section">
                            <h2>{translate("faqTitle", orphanHealthTranslations, language) || "FAQs"}</h2>
                            <p className="faq-intro">{translate("faqIntro", orphanHealthTranslations, language) || "Everything you need to know before you donate."}</p>

                            <div className="faq-list">
                                {FAQS.map((faq, index) => {
                                    const isOpen = openFaq === index;
                                    const question = language === 'hi' ? faq.questionHi : faq.question;
                                    const answer = language === 'hi' ? faq.answerHi : faq.answer;
                                    return (
                                        <article key={faq.question} className={`faq-item ${isOpen ? "open" : ""}`}>
                                            <button
                                                type="button"
                                                className="faq-question"
                                                onClick={() => setOpenFaq(isOpen ? null : index)}
                                                aria-expanded={isOpen}
                                            >
                                                <span>{question}</span>
                                                <FaChevronDown aria-hidden="true" />
                                            </button>
                                            {isOpen && <p className="faq-answer">{answer}</p>}
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {isDonationModalOpen && (
                <div
                    className="donation-modal-backdrop"
                    role="presentation"
                    onClick={() => setDonationModalType(null)}
                >
                    <div
                        className="donation-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label={modalTitle}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="donation-modal-head">
                            <h3>{modalTitle}</h3>
                            <button
                                type="button"
                                className="donation-modal-close"
                                onClick={() => setDonationModalType(null)}
                                aria-label="Close donations popup"
                            >
                                x
                            </button>
                        </div>
                        <p className="donation-modal-subtitle">
                            Showing {modalDonations.length} contributions to this fundraiser
                        </p>
                        <div className="donation-modal-list">
                            {modalDonations.map((donation) => (
                                <article
                                    key={`${donation.name}-${donation.amount}-modal`}
                                    className="donation-item donation-item-modal"
                                >
                                    <FaUserCircle aria-hidden="true" />
                                    <div>
                                        <h3>{donation.name === "Anonymous" ? translate("anonymous", orphanHealthTranslations, language) : donation.name}</h3>
                                        <p>{formatAmount(donation.amount)}</p>
                                    </div>
                                    <span>{donation.note}</span>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default OrphanageHealthPage;