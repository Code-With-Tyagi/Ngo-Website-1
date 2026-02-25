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
import { welfareKanyadanTranslations as T } from "../../../utils/serviceTranslations.js";

// Ensure you have a relevant image in this path, or update the path accordingly
import kanyadanImage from "../../../assets/images/socialWelfare/kanyadan.png";
import "./kanyadan.css";

const DONATIONS = [
    { name: "Sourabh Bakshi", amount: 15000, note: "Blessings for the daughter" },
    { name: "Jayesh Shrivastava", amount: 7500, note: "Top Donor" },
    { name: "Priya Sharma", amount: 5000, note: "For a happy married life" },
    { name: "Rahul Verma", amount: 3000, note: "In memory of my parents" },
    { name: "Neha Gupta", amount: 2500, note: "Wedding support" },
    { name: "Kunal Jain", amount: 2100, note: "For household essentials" },
    { name: "Anonymous", amount: 1111, note: "Joined today" },
    { name: "A. Das", amount: 1500, note: "Kanyadan contribution" },
    { name: "Simran Kaur", amount: 1200, note: "Best wishes to the bride" },
    { name: "Rohit Singh", amount: 1000, note: "God bless the couple" },
    { name: "Meera Nair", amount: 900, note: "Small effort" },
    { name: "Vikash Kumar", amount: 800, note: "For a bright future" },
    { name: "Anonymous", amount: 700, note: "Blessings" },
    { name: "Anita Menon", amount: 500, note: "Happy to help" },
];

const FAQS = [
    {
        question: "How does this Kanyadan Yojna help families?",
        questionHi: "यह कन्यादान योजना परिवारों की कैसे मदद करती है?",
        answer: "Funds are utilized to cover essential wedding expenses, including the bride's attire, basic jewelry, household starter kits, and modest ceremony costs for families who cannot afford them.",
        answerHi: "धन का उपयोग आवश्यक शादी खर्चों को पूरा करने के लिए किया जाता है, जिसमें दुल्हन की पोशाक, बुनियादी गहने, घरेलू स्टार्टर किट और साधारण समारोह लागत शामिल हैं।",
    },
    {
        question: "How do you identify the families in need?",
        questionHi: "आप जरूरतमंद परिवारों की पहचान कैसे करते हैं?",
        answer: "We conduct thorough background checks and ground verifications to ensure that the support reaches underprivileged families who genuinely lack the financial means for their daughter's marriage.",
        answerHi: "हम पूरी पृष्ठभूमि जांच और जमीनी सत्यापन करते हैं ताकि यह सुनिश्चित हो सके कि सहायता उन वंचित परिवारों तक पहुँचे जिनके पास अपनी बेटी की शादी के लिए आर्थिक साधन नहीं है।",
    },
    {
        question: "Is my donation secure?",
        questionHi: "क्या मेरा दान सुरक्षित है?",
        answer: "Yes. Donations are processed through secure payment channels and campaign-level records are maintained for accountability.",
        answerHi: "हाँ। दान सुरक्षित भुगतान चैनलों के माध्यम से संसाधित किये जाते हैं और जवाबदेही के लिए अभियान रिकॉर्ड बनाए जाते हैं।",
    },
    {
        question: "Will I get a donation confirmation?",
        questionHi: "क्या मुझे दान की पुष्टि मिलेगी?",
        answer: "Yes. You will receive a confirmation and receipt as soon as your contribution is completed successfully.",
        answerHi: "हाँ। आपका योगदान सफलतापूर्वक पूरा होते ही आपको पुष्टि और रसीद प्राप्त होगी।",
    },
    {
        question: "Can I share this campaign with friends?",
        questionHi: "क्या मैं इस अभियान को दोस्तों के साथ साझा कर सकता हूँ?",
        answer: "Yes. You can use the Share button to quickly send this page to your contacts and help this cause reach more people.",
        answerHi: "हाँ। आप इस पृष्ठ को अपने संपर्कों को जल्दी भेजने के लिए शेयर बटन का उपयोग कर सकते हैं।",
    },
];

const STORY = [
    { en: "In many underprivileged communities, the marriage of a daughter brings immense joy, but it is often overshadowed by severe financial stress and the burden of lifelong debt.", hi: "कई वंचित समुदायों में, बेटी की शादी अपार खुशी लाती है, लेकिन यह अक्सर गंभीर आर्थिक तनाव और आजीवन कर्ज के बोझ से ढक जाती है।" },
    { en: "Our Kanyadan Yojna aims to relieve this burden by supporting families who cannot afford the basic expenses of a wedding. We help provide essential items, wedding attire, and cover basic ceremony costs.", hi: "हमारी कन्यादान योजना उन परिवारों का समर्थन करके इस बोझ को कम करना चाहती है जो शादी के बुनियादी खर्च वहन नहीं कर सकते। हम आवश्यक वस्तुएं, शादी की पोशाक और बुनियादी समारोह लागत प्रदान करते हैं।" },
    { en: "With your generous Kanyadan contribution, you can help a family celebrate their daughter's special day with dignity, respect, and joy, giving the newlywed couple a debt-free start to their new life.", hi: "आपके उदार कन्यादान योगदान से, आप एक परिवार को अपनी बेटी के विशेष दिन को सम्मान, संस्कार और खुशी के साथ मनाने में मदद कर सकते हैं।" },
];

function KanyadanYojnaPage() {
    const { language } = useLanguage();
    const t = (key) => translate(key, T, language);
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
    const modalTitle = donationModalType === "top" ? (language === 'hi' ? 'शीर्ष दान' : 'Top Donations') : (language === 'hi' ? 'सभी दान' : 'All Donations');

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
                    title: "Kanyadan Yojna Support",
                    text: "Support the marriage of daughters from underprivileged families.",
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
        <section className="kanyadan-detail-page">
            <div className="kanyadan-detail-shell">
                <div className="kanyadan-content-grid">
                    <aside className="kanyadan-side-stack">
                        <article className="campaign-card">
                            <div className="campaign-image-wrap">
                                <img src={kanyadanImage} alt="Kanyadan Yojna wedding support" />
                                <span className="campaign-chip">Tax Benefits Available</span>
                            </div>

                            <div className="campaign-body">
                                <h1>{t("title")}</h1>
                                <p className="campaign-org">{t("organization")}</p>

                                <div className="campaign-amounts">
                                    <strong>Rs 2,61,000</strong>
                                    <span>{language === 'hi' ? 'के' : 'raised of'} Rs 5,00,000 {language === 'hi' ? 'लक्ष्य' : 'goal'}</span>
                                </div>

                                <div className="campaign-progress" aria-hidden="true">
                                    <span className="campaign-progress-fill" style={{ width: "52%" }} />
                                </div>

                                <div className="campaign-stats">
                                    <div>
                                        <strong>124</strong>
                                        <span>{language === 'hi' ? 'दानकर्ता' : 'Donors'}</span>
                                    </div>
                                    <div>
                                        <strong>14</strong>
                                        <span>{language === 'hi' ? 'दिन बचे' : 'Days left'}</span>
                                    </div>
                                    <div>
                                        <strong>52%</strong>
                                        <span>{language === 'hi' ? 'वित्त पोषित' : 'Funded'}</span>
                                    </div>
                                </div>

                                <div className="campaign-actions">
                                    <Link to="/donate" state={{ serviceImage: kanyadanImage, serviceTitle: t("title") }} className="campaign-btn campaign-btn-primary">
                                        {t("donateNow")}
                                    </Link>
                                    <button
                                        type="button"
                                        className="campaign-btn campaign-btn-secondary"
                                        onClick={handleShare}
                                    >
                                        {shareLabel === "Share" ? t("share") : shareLabel}
                                    </button>
                                </div>
                            </div>
                        </article>
                    </aside>

                    <div className="kanyadan-main-stack">
                        <section className="kanyadan-section-card">
                            <h2>{language === 'hi' ? 'कहानी' : 'Story'}</h2>
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
                                {storyExpanded ? (language === 'hi' ? 'कम दिखाएं' : 'Read Less') : (language === 'hi' ? 'और पढ़ें' : 'Read More')}
                            </button>
                        </section>

                        <section className="kanyadan-section-card">
                            <div className="section-head">
                                <h2>{language === 'hi' ? 'हाल के दान' : 'Recent Donations'}</h2>
                                <span>114 {language === 'hi' ? 'दान' : 'Donations'}</span>
                            </div>

                            <div className="donation-list">
                                {sortedDonations.slice(0, 3).map((donation) => (
                                    <article key={`${donation.name}-${donation.amount}`} className="donation-item">
                                        <FaUserCircle aria-hidden="true" />
                                        <div>
                                            <h3>{donation.name}</h3>
                                            <p>{formatAmount(donation.amount)}</p>
                                        </div>
                                        <span>{donation.note}</span>
                                    </article>
                                ))}
                            </div>

                            <div className="section-links">
                                <button type="button" onClick={() => setDonationModalType("top")}>
                                    {language === 'hi' ? 'शीर्ष दान देखें' : 'View Top Donations'}
                                </button>
                                <button type="button" onClick={() => setDonationModalType("all")}>
                                    {language === 'hi' ? 'सभी दान देखें' : 'View All Donations'}
                                </button>
                            </div>
                        </section>

                        <section className="support-panel">
                            <h2>{t("supportTitle") || "Support the fundraiser"}</h2>
                            <p>{t("supportDesc") || "Every small share and Kanyadan contribution counts."}</p>
                            <div className="support-actions">
                                <Link to="/donate" state={{ serviceImage: kanyadanImage, serviceTitle: t("title") }} className="campaign-btn campaign-btn-primary">
                                    {t("donateNow")}
                                </Link>
                                <button
                                    type="button"
                                    className="campaign-btn campaign-btn-secondary"
                                    onClick={handleShare}
                                >
                                    {t("share")}
                                </button>
                            </div>
                        </section>

                        <section className="kanyadan-section-card">
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
                                        <p>Your support helps families marry their daughters with dignity.</p>
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

                        <section className="kanyadan-section-card faq-section">
                            <h2>{language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'FAQs'}</h2>
                            <p className="faq-intro">{language === 'hi' ? 'दान करने से पहले आपको जो कुछ जानने की जरूरत है।' : 'Everything you need to know before you donate.'}</p>

                            <div className="faq-list">
                                {FAQS.map((faq, index) => {
                                    const isOpen = openFaq === index;
                                    return (
                                        <article key={index} className={`faq-item ${isOpen ? "open" : ""}`}>
                                            <button
                                                type="button"
                                                className="faq-question"
                                                onClick={() => setOpenFaq(isOpen ? null : index)}
                                                aria-expanded={isOpen}
                                            >
                                                <span>{language === 'hi' ? faq.questionHi : faq.question}</span>
                                                <FaChevronDown aria-hidden="true" />
                                            </button>
                                            {isOpen && <p className="faq-answer">{language === 'hi' ? faq.answerHi : faq.answer}</p>}
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
                                        <h3>{donation.name}</h3>
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

export default KanyadanYojnaPage;