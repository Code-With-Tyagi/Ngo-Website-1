
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
import { mealTranslations } from "../../../utils/serviceTranslations.js";
import orphanMeal from "../../../assets/images/orphanage/food.webp";
import "./meal.css";

const DONATIONS = [
    { name: "Sanjay Singhania", amount: 10000, note: "For healthy meals" },
    { name: "Meena Kumari", amount: 5000, note: "Supporting nutrition" },
    { name: "Rahul Deshmukh", amount: 2500, note: "Happy meals for kids" },
    { name: "Anita Rao", amount: 1500, note: "Keep it up" },
    { name: "Anonymous", amount: 1000, note: "Small help" },
    { name: "Vikram Malhotra", amount: 2100, note: "For fruits and milk" },
    { name: "Sunita Reddy", amount: 1500, note: "Blessed to help" },
    { name: "Anonymous", amount: 1100, note: "Nutrition first" },
    { name: "Dr. Aditya", amount: 501, note: "Good work" },
];

const FAQS = [
    {
        question: "How does this meal fundraiser help children?",
        answer: "Funds are used to provide high-quality, nutritious meals, including fresh fruits, milk, and balanced diets, ensuring healthy development for orphans.",
        questionHi: "यह भोजन धन संचय बच्चों को कैसे मदद करता है?",
        answerHi: "धन का उपयोग ताजे फल, दूध और संतुलित आहार सहित उच्च गुणवत्ता वाले पौष्टिक भोजन प्रदान करने के लिए किया जाता है, जो अनाथों के स्वस्थ विकास को सुनिश्चित करता है।",
    },
    {
        question: "Is my donation secure?",
        answer: "Yes. Donations are processed through secure payment channels and campaign-level records are maintained for accountability.",
        questionHi: "क्या मेरा दान सुरक्षित है?",
        answerHi: "हाँ। दान को सुरक्षित भुगतान चैनलों के माध्यम से संसाधित किया जाता है और जवाबदेही के लिए अभियान-स्तरीय रिकॉर्ड बनाए रखे जाते हैं।",
    },
    {
        question: "Will I get donation confirmation?",
        answer: "Yes. You receive confirmation as soon as your contribution is completed successfully.",
        questionHi: "क्या मुझे दान की पुष्टि मिलेगी?",
        answerHi: "हाँ। आप अपना योगदान सफलतापूर्वक पूर्ण होते ही पुष्टि प्राप्त करते हैं।",
    },
    {
        question: "Can I support this fundraiser monthly?",
        answer: "Yes. You can return and donate again any time, or support related child welfare campaigns regularly.",
        questionHi: "क्या मैं इस धन संचय को मासिक समर्थन कर सकता हूँ?",
        answerHi: "हाँ। आप कभी भी वापस आ सकते हैं और फिर से दान कर सकते हैं, या संबंधित बाल कल्याण अभियानों को नियमित रूप से समर्थन कर सकते हैं।",
    },
    {
        question: "Can I share this campaign with friends?",
        answer: "Yes. You can use the Share button to quickly send this page to your contacts and help this cause reach more people.",
        questionHi: "क्या मैं इस अभियान को दोस्तों के साथ साझा कर सकता हूँ?",
        answerHi: "हाँ। आप इस पृष्ठ को अपने संपर्कों को जल्दी भेजने के लिए साझा बटन का उपयोग कर सकते हैं।",
    },
];

const STORY = [
    {
        en: "Proper nutrition is the foundation of a healthy childhood. Many children in orphanage care lack access to balanced and diverse meals necessary for their growth.",
        hi: "उचित पोषण एक स्वस्थ बचपन की नींव है। अनाथालय देखभाल में कई बच्चों को अपने विकास के लिए आवश्यक संतुलित और विविध भोजन तक पहुंच नहीं है।",
    },
    {
        en: "The 'Nutritious Meal' initiative ensures that every child receives the essential vitamins and minerals they need for physical and cognitive development.",
        hi: "'पौष्टिक भोजन' पहल सुनिश्चित करती है कि प्रत्येक बच्चे को उनके शारीरिक और संज्ञानात्मक विकास के लिए आवश्यक आवश्यक विटामिन और खनिज मिलें।",
    },
    {
        en: "Your support helps us provide fresh, healthy, and hygienic meals every day, giving these children the energy to learn, play, and thrive.",
        hi: "आपका समर्थन हमें हर दिन ताजा, स्वस्थ और स्वच्छ भोजन प्रदान करने में मदद करता है, जिससे इन बच्चों को सीखने, खेलने और फलने-फूलने की शक्ति मिलती है।",
    },
];

function Meal() {
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
    const modalTitle = donationModalType === "top" ? translate("topDonations", mealTranslations, language) : translate("allDonations", mealTranslations, language);

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
                    title: "Nutritious Meal Support",
                    text: "Support healthy meals for children in orphanage care.",
                    url: pageUrl,
                });
                return;
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(pageUrl);
                setShareLabel("Link Copied");
                window.setTimeout(() => setShareLabel("Share"), 1600);
            }
        } catch {
            setShareLabel("Share");
        }
    };

    return (
        <section className="meal-detail-page">
            <div className="meal-detail-shell">
                <div className="meal-content-grid">
                    <aside className="meal-side-stack">
                        <article className="campaign-card">
                            <div className="campaign-image-wrap">
                                <img src={orphanMeal} alt="Children enjoying nutritious meals" />
                                <span className="campaign-chip">Healthy Choice</span>
                            </div>

                            <div className="campaign-body">
                                <h1>{translate("title", mealTranslations, language)}</h1>
                                <p className="campaign-org">{translate("organization", mealTranslations, language)}</p>

                                <div className="campaign-amounts">
                                    <strong>Rs 1,50,000</strong>
                                    <span>{translate("raisedOf", mealTranslations, language)} Rs 3,00,000 {translate("goal", mealTranslations, language)}</span>
                                </div>

                                <div className="campaign-progress" aria-hidden="true">
                                    <span className="campaign-progress-fill" style={{ width: "50%" }} />
                                </div>

                                <div className="campaign-stats">
                                    <div>
                                        <strong>85</strong>
                                        <span>{translate("donors", mealTranslations, language)}</span>
                                    </div>
                                    <div>
                                        <strong>20</strong>
                                        <span>{translate("daysLeft", mealTranslations, language)}</span>
                                    </div>
                                    <div>
                                        <strong>50%</strong>
                                        <span>{translate("funded", mealTranslations, language)}</span>
                                    </div>
                                </div>

                                <div className="campaign-actions">
                                    <Link to="/donate" state={{ serviceImage: orphanMeal, serviceTitle: translate("title", mealTranslations, language) }} className="campaign-btn campaign-btn-primary">
                                        {translate("donateNow", mealTranslations, language)}
                                    </Link>
                                    <button
                                        type="button"
                                        className="campaign-btn campaign-btn-secondary"
                                        onClick={handleShare}
                                    >
                                        {shareLabel === "Share" ? translate("share", mealTranslations, language) : translate("linkCopied", mealTranslations, language)}
                                    </button>
                                </div>
                            </div>
                        </article>
                    </aside>

                    <div className="meal-main-stack">
                        <section className="meal-section-card">
                            <h2>{translate("storyTitle", mealTranslations, language)}</h2>
                            <div className={`story-content ${storyExpanded ? "expanded" : ""}`}>
                                {STORY.map((item, idx) => (
                                    <p key={idx}>{language === 'hi' ? item.hi : item.en}</p>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="text-action"
                                onClick={() => setStoryExpanded((current) => !current)}
                            >
                                {storyExpanded ? translate("readLess", mealTranslations, language) : translate("readMore", mealTranslations, language)}
                            </button>
                        </section>

                        <section className="meal-section-card">
                            <div className="section-head">
                                <h2>{translate("recentDonations", mealTranslations, language)}</h2>
                                <span>{DONATIONS.length} {translate("donationsLabel", mealTranslations, language) || "Donations"}</span>
                            </div>

                            <div className="donation-list">
                                {sortedDonations.slice(0, 3).map((donation) => (
                                    <article key={`${donation.name}-${donation.amount}`} className="donation-item">
                                        <FaUserCircle aria-hidden="true" />
                                        <div>
                                            <h3>{donation.name === "Anonymous" ? translate("anonymous", mealTranslations, language) : donation.name}</h3>
                                            <p>{formatAmount(donation.amount)}</p>
                                        </div>
                                        <span>{donation.note}</span>
                                    </article>
                                ))}
                            </div>

                            <div className="section-links">
                                <button type="button" onClick={() => setDonationModalType("top")}>
                                    {translate("topDonations", mealTranslations, language)}
                                </button>
                                <button type="button" onClick={() => setDonationModalType("all")}>
                                    {translate("allDonations", mealTranslations, language)}
                                </button>
                            </div>
                        </section>

                        <section className="support-panel">
                            <h2>{translate("supportTitle", mealTranslations, language)}</h2>
                            <p>{translate("supportDesc", mealTranslations, language)}</p>
                            <div className="support-actions">
                                <Link to="/donate" state={{ serviceImage: orphanMeal, serviceTitle: translate("title", mealTranslations, language) }} className="campaign-btn campaign-btn-primary">
                                    {translate("donateNow", mealTranslations, language)}
                                </Link>
                                <button
                                    type="button"
                                    className="campaign-btn campaign-btn-secondary"
                                    onClick={handleShare}
                                >
                                    {translate("share", mealTranslations, language)}
                                </button>
                            </div>
                        </section>

                        <section className="meal-section-card">
                            <h2>Organizers</h2>
                            <div className="organizer-list">
                                <article className="organizer-item">
                                    <span className="organizer-logo">GA</span>
                                    <div>
                                        <h3>Guardian of Angels Trust</h3>
                                        <p>Verified Charity</p>
                                    </div>
                                </article>
                            </div>
                        </section>

                        <section className="trust-strip">
                            <h2>Building a healthy foundation for the future</h2>
                            <div className="trust-grid">
                                <article>
                                    <FaShieldAlt aria-hidden="true" />
                                    <div>
                                        <h3>Verified Impact</h3>
                                        <p>Every rupee is spent on fresh and balanced food for the children.</p>
                                    </div>
                                </article>
                                <article>
                                    <FaHandHoldingHeart aria-hidden="true" />
                                    <div>
                                        <h3>Compassionate Feed</h3>
                                        <p>Meals are prepared with care and love by our dedicated kitchen staff.</p>
                                    </div>
                                </article>
                                <article>
                                    <FaRegClock aria-hidden="true" />
                                    <div>
                                        <h3>Consistent Care</h3>
                                        <p>Daily meal schedules maintained strictly for optimal child health.</p>
                                    </div>
                                </article>
                            </div>
                        </section>

                        <section className="meal-section-card faq-section">
                            <h2>{translate("faqTitle", mealTranslations, language)}</h2>
                            <p className="faq-intro">{translate("faqIntro", mealTranslations, language)}</p>

                            <div className="faq-list">
                                {FAQS.map((faq, index) => {
                                    const isOpen = openFaq === index;
                                    const question = language === 'hi' ? faq.questionHi : faq.question;
                                    const answer = language === 'hi' ? faq.answerHi : faq.answer;
                                    return (
                                        <article key={index} className={`faq-item ${isOpen ? "open" : ""}`}>
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
                                        <h3>{donation.name === "Anonymous" ? translate("anonymous", mealTranslations, language) : donation.name}</h3>
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

export default Meal;
