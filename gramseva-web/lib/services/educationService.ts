/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

export interface Scholarship {
  id: string;
  title: string;
  titleHindi: string;
  category: string;
  amount: string;
  eligibility: string;
  deadline: string;
  state: string;
  status: 'Open' | 'Coming' | 'Closed';
  icon: string;
  color: string;
  website: string;
}

export interface Exam {
  id: string;
  exam: string;
  examHindi: string;
  date: string;
  vacancies: string;
  level: string;
  status: 'Open' | 'Coming' | 'Closed';
  eligibility: string;
  syllabus: string;
  website: string;
  icon: string;
}

export interface EduCourse {
  id: string;
  title: string;
  titleHindi: string;
  provider: string;
  duration: string;
  mode: string;
  level: string;
  free: boolean;
  certificate: boolean;
  icon: string;
}

export interface StudyMaterial {
  id: string;
  subject: string;
  subjectHindi: string;
  category: string;
  files: number;
  pdfLinks: string[];
  videoLinks: string[];
  notes: string;
  icon: string;
}

export interface CareerPath {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  opportunities: string[];
  icon: string;
  color: string;
}

export interface Skill {
  id: string;
  name: string;
  nameHindi: string;
  duration: string;
  certification: boolean;
  provider: string;
  icon: string;
}

export interface College {
  id: string;
  name: string;
  state: string;
  type: string;
  courses: string[];
  website: string;
  icon: string;
}

export interface FaqItem {
  id: string;
  question: string;
  questionHindi: string;
  answer: string;
  answerHindi: string;
  category: string;
}

const SCHOLARSHIPS: Scholarship[] = [
  { id: 'nsp', title: 'National Scholarship Portal', titleHindi: 'राष्ट्रीय छात्रवृत्ति पोर्टल', category: 'Central Govt', amount: '₹500–₹35,000/year', eligibility: 'SC/ST/OBC/Minority/Economically backward students', deadline: '31 Oct 2024', state: 'All India', status: 'Open', icon: '🎓', color: '#2E7D32', website: 'https://scholarships.gov.in' },
  { id: 'pmss', title: 'PM Scholarship Scheme', titleHindi: 'पीएम छात्रवृत्ति योजना', category: 'Central Govt', amount: '₹2,500–₹3,000/month', eligibility: 'Wards of ex-servicemen/paramilitary forces', deadline: '15 Nov 2024', state: 'All India', status: 'Open', icon: '🏅', color: '#1565C0', website: 'https://pmss.com' },
  { id: 'mms', title: 'Mukhyamantri Medhavi Scholarship', titleHindi: 'मुख्यमंत्री मेधावी छात्रवृत्ति', category: 'State Govt', amount: 'Full tuition fee', eligibility: '85%+ in 12th, family income < ₹6 lakh', deadline: '30 Nov 2024', state: 'Madhya Pradesh', status: 'Open', icon: '🏆', color: '#6A1B9A', website: 'https://scholarships.gov.in' },
  { id: 'bhm', title: 'Begum Hazrat Mahal Scholarship', titleHindi: 'बेगम हजरत महल छात्रवृत्ति', category: 'Minority', amount: '₹5,000–₹6,000/year', eligibility: 'Minority community girls (9th–12th)', deadline: '30 Sep 2024', state: 'All India', status: 'Closed', icon: '👩‍🎓', color: '#C62828', website: 'https://bhmsscholarship.com' },
  { id: 'obc', title: 'OBC Post Matric Scholarship', titleHindi: 'ओबीसी पोस्ट मैट्रिक छात्रवृत्ति', category: 'Central Govt', amount: '₹1,500–₹10,000/year', eligibility: 'OBC students, family income < ₹3 lakh', deadline: '31 Dec 2024', state: 'All India', status: 'Open', icon: '📜', color: '#E65100', website: 'https://scholarships.gov.in' },
  { id: 'scst', title: 'SC/ST Post Matric Scholarship', titleHindi: 'एससी/एसटी पोस्ट मैट्रिक छात्रवृत्ति', category: 'Central Govt', amount: 'Full tuition + maintenance', eligibility: 'SC/ST students, family income < ₹2.5 lakh', deadline: '31 Dec 2024', state: 'All India', status: 'Open', icon: '⚖️', color: '#4527A0', website: 'https://scholarships.gov.in' },
  { id: 'up_medhavi', title: 'UP Medhavi Scholarship', titleHindi: 'यूपी मेधावी छात्रवृत्ति', category: 'State Govt', amount: '₹5,000–₹20,000/year', eligibility: 'UP domicile, 75%+ in 12th', deadline: '15 Dec 2024', state: 'Uttar Pradesh', status: 'Coming', icon: '🌟', color: '#00838F', website: 'https://upmedhavi.com' },
  { id: 'aaple', title: 'Aaple Sarkar Scholarship', titleHindi: 'आपले सरकार छात्रवृत्ति', category: 'State Govt', amount: '₹10,000–₹25,000/year', eligibility: 'Maharashtra domicile, 60%+ in 12th', deadline: '30 Nov 2024', state: 'Maharashtra', status: 'Open', icon: '🏛️', color: '#AD1457', website: 'https://aaplegov.in' },
];

const EXAMS: Exam[] = [
  { id: 'upsc', exam: 'UPSC Civil Services', examHindi: 'यूपीएससी सिविल सेवा', date: '26 May 2024', vacancies: '1,056', level: 'Central', status: 'Open', eligibility: 'Bachelor\'s degree, 21–32 years', syllabus: 'Prelims (GS + CSAT), Mains (9 papers), Interview', website: 'https://upsc.gov.in', icon: '🏛️' },
  { id: 'ssc_cgl', exam: 'SSC CGL', examHindi: 'एसएससी सीजीएल', date: 'Jul–Aug 2024', vacancies: '17,727', level: 'Central', status: 'Open', eligibility: 'Bachelor\'s degree, 18–32 years', syllabus: 'Tier 1 (4 sections), Tier 2 (3 papers)', website: 'https://ssc.nic.in', icon: '📋' },
  { id: 'railway', exam: 'Railway NTPC', examHindi: 'रेलवे एनटीपीसी', date: 'Sep 2024', vacancies: '11,558', level: 'Central', status: 'Coming', eligibility: '12th/Bachelor\'s, 18–33 years', syllabus: 'CBT 1 (General), CBT 2 (Trade specific)', website: 'https://indianrailways.gov.in', icon: '🚂' },
  { id: 'ibps_po', exam: 'IBPS PO', examHindi: 'आईबीपीएस पीओ', date: 'Oct 2024', vacancies: '4,455', level: 'Banking', status: 'Open', eligibility: 'Bachelor\'s degree, 20–30 years', syllabus: 'Prelims (3 sections), Mains (4+1), Interview', website: 'https://ibps.in', icon: '🏦' },
  { id: 'up_police', exam: 'UP Police Constable', examHindi: 'यूपी पुलिस कांस्टेबल', date: 'Dec 2024', vacancies: '60,244', level: 'State', status: 'Coming', eligibility: '12th pass, 18–22 years, UP domicile', syllabus: 'Written exam, PET, Medical test', website: 'https://uppbpb.gov.in', icon: '👮' },
  { id: 'ctet', exam: 'CTET', examHindi: 'सीटेट', date: 'Jul 2024', vacancies: '–', level: 'Teaching', status: 'Closed', eligibility: '12th with 50% + D.Ed/2nd year B.Ed/D.El.Ed', syllabus: 'Paper 1 (Primary), Paper 2 (Upper Primary)', website: 'https://ctet.nic.in', icon: '📖' },
  { id: 'neet', exam: 'NEET UG', examHindi: 'नीट यूजी', date: '5 May 2024', vacancies: '1,08,000+', level: 'Medical', status: 'Closed', eligibility: '12th PCB, 50% (GEN) / 40% (SC/ST/OBC)', syllabus: 'Physics, Chemistry, Biology (180 questions)', website: 'https://neet.nta.nic.in', icon: '🩺' },
  { id: 'jee', exam: 'JEE Advanced', examHindi: 'जेईई एडवांस्ड', date: '26 May 2024', vacancies: '17,000+', level: 'Engineering', status: 'Closed', eligibility: 'Top 2.5L in JEE Main', syllabus: 'Physics, Chemistry, Mathematics', website: 'https://jeeadv.ac.in', icon: '⚙️' },
];

const COURSES: EduCourse[] = [
  { id: 'digital_literacy', title: 'Digital Literacy', titleHindi: 'डिजिटल साक्षरता', provider: 'NIELIT', duration: '3 months', mode: 'Online/Offline', level: 'Beginner', free: true, certificate: true, icon: '💻' },
  { id: 'computer_basics', title: 'Computer Basics', titleHindi: 'कंप्यूटर बेसिक्स', provider: 'PMGDISHA', duration: '20 days', mode: 'Offline', level: 'Beginner', free: true, certificate: true, icon: '🖥️' },
  { id: 'skill_dev', title: 'Skill Development', titleHindi: 'कौशल विकास', provider: 'NSDC', duration: '6 months', mode: 'Offline', level: 'Intermediate', free: true, certificate: true, icon: '🔧' },
  { id: 'english', title: 'English Speaking', titleHindi: 'अंग्रेज़ी बोलना', provider: 'Spoken Tutorial IIT Bombay', duration: 'Self-paced', mode: 'Online', level: 'Beginner', free: true, certificate: true, icon: '🗣️' },
  { id: 'financial', title: 'Financial Literacy', titleHindi: 'वित्तीय साक्षरता', provider: 'NCFE', duration: '1 month', mode: 'Online', level: 'Beginner', free: true, certificate: false, icon: '💰' },
  { id: 'agri_tech', title: 'Agriculture Technology', titleHindi: 'कृषि तकनीक', provider: 'ICAR', duration: '3 months', mode: 'Online', level: 'Intermediate', free: true, certificate: true, icon: '🌾' },
  { id: 'coding', title: 'Coding for Beginners', titleHindi: 'कोडिंग बेसिक्स', provider: 'NIELIT', duration: '6 months', mode: 'Online', level: 'Beginner', free: false, certificate: true, icon: '👨‍💻' },
  { id: 'banking', title: 'Banking & Finance', titleHindi: 'बैंकिंग और वित्त', provider: 'NIIT', duration: '3 months', mode: 'Online', level: 'Intermediate', free: false, certificate: true, icon: '🏦' },
];

const STUDY_MATERIALS: StudyMaterial[] = [
  { id: 'gk', subject: 'General Knowledge', subjectHindi: 'सामान्य ज्ञान', category: 'Competitive Exams', files: 12, pdfLinks: [], videoLinks: [], notes: 'Covers history, geography, polity, economy, science & tech', icon: '🌍' },
  { id: 'math', subject: 'Mathematics', subjectHindi: 'गणित', category: 'Competitive Exams', files: 8, pdfLinks: [], videoLinks: [], notes: 'Arithmetic, Algebra, Geometry, Trigonometry, Data Interpretation', icon: '🔢' },
  { id: 'hindi', subject: 'Hindi Literature', subjectHindi: 'हिंदी साहित्य', category: 'Language', files: 6, pdfLinks: [], videoLinks: [], notes: 'Grammar, Poetry, Prose, Comprehension', icon: '📝' },
  { id: 'science', subject: 'Science', subjectHindi: 'विज्ञान', category: 'Competitive Exams', files: 10, pdfLinks: [], videoLinks: [], notes: 'Physics, Chemistry, Biology for competitive exams', icon: '🔬' },
  { id: 'current', subject: 'Current Affairs', subjectHindi: 'करंट अफेयर्स', category: 'Competitive Exams', files: 15, pdfLinks: [], videoLinks: [], notes: 'Monthly current affairs, national & international events', icon: '📰' },
  { id: 'history', subject: 'Indian History', subjectHindi: 'भारतीय इतिहास', category: 'Competitive Exams', files: 7, pdfLinks: [], videoLinks: [], notes: 'Ancient, Medieval, Modern Indian History', icon: '🏛️' },
  { id: 'reasoning', subject: 'Logical Reasoning', subjectHindi: 'तार्किक तर्कशक्ति', category: 'Competitive Exams', files: 9, pdfLinks: [], videoLinks: [], notes: 'Verbal & non-verbal reasoning, puzzles, critical thinking', icon: '🧠' },
  { id: 'english_grammar', subject: 'English Grammar', subjectHindi: 'अंग्रेज़ी व्याकरण', category: 'Language', files: 5, pdfLinks: [], videoLinks: [], notes: 'Tenses, Articles, Prepositions, Vocabulary, Comprehension', icon: '📚' },
];

const CAREER_PATHS: CareerPath[] = [
  { id: 'govt_jobs', title: 'Government Jobs', titleHindi: 'सरकारी नौकरियां', description: 'Stable career with pension, benefits, and job security through competitive exams like UPSC, SSC, Railway, Banking, State PSC.', descriptionHindi: 'यूपीएससी, एसएससी, रेलवे, बैंकिंग, राज्य पीएससी जैसी प्रतियोगी परीक्षाओं के माध्यम से पेंशन, लाभ और नौकरी की सुरक्षा के साथ स्थिर करियर।', opportunities: ['UPSC Civil Services', 'SSC CGL/CHSL', 'Railway NTPC/Group D', 'Bank PO/Clerk', 'State PCS', 'Defence Services'], icon: '🏛️', color: '#1565C0' },
  { id: 'private_jobs', title: 'Private Sector', titleHindi: 'निजी क्षेत्र', description: 'Diverse opportunities in IT, finance, marketing, operations, and management with competitive salaries and growth.', descriptionHindi: 'प्रतिस्पर्धी वेतन और विकास के साथ आईटी, वित्त, विपणन, संचालन और प्रबंधन में विविध अवसर।', opportunities: ['IT/Tech Companies', 'Banking/Finance', 'Consulting', 'Manufacturing', 'Retail/E-commerce', 'Startups'], icon: '💼', color: '#2E7D32' },
  { id: 'higher_studies', title: 'Higher Studies', titleHindi: 'उच्च शिक्षा', description: 'Pursue degree/diploma courses at Indian or international universities. Options include graduation, post-graduation, PhD, and professional courses.', descriptionHindi: 'भारतीय या अंतरराष्ट्रीय विश्वविद्यालयों में डिग्री/डिप्लोमा पाठ्यक्रम। स्नातक, परास्नातक, पीएचडी और व्यावसायिक पाठ्यक्रम शामिल हैं।', opportunities: ['Engineering (B.Tech/M.Tech)', 'Medical (MBBS/MD)', 'Management (BBA/MBA)', 'Law (LLB/LLM)', 'Pure Sciences (B.Sc/M.Sc/PhD)', 'Design/Fashion'], icon: '🎓', color: '#6A1B9A' },
  { id: 'entrepreneurship', title: 'Entrepreneurship', titleHindi: 'उद्यमिता', description: 'Start your own business with government schemes like Startup India, Mudra Loan, and PMEGP. Access training, funding, and mentorship.', descriptionHindi: 'स्टार्टअप इंडिया, मुद्रा लोन और पीएमईजीपी जैसी सरकारी योजनाओं से अपना व्यवसाय शुरू करें। प्रशिक्षण, फंडिंग और मेंटरशिप प्राप्त करें।', opportunities: ['Agri-business', 'Food Processing', 'Handicrafts', 'IT Services', 'Retail Shop', 'Manufacturing Unit'], icon: '🚀', color: '#E65100' },
];

const SKILLS: Skill[] = [
  { id: 'plumbing', name: 'Plumbing', nameHindi: 'प्लंबिंग', duration: '3 months', certification: true, provider: 'NSDC/ITI', icon: '🔧' },
  { id: 'tailoring', name: 'Tailoring & Embroidery', nameHindi: 'सिलाई और कढ़ाई', duration: '6 months', certification: true, provider: 'RUDSETI/KVIC', icon: '🧵' },
  { id: 'electrician', name: 'Electrician', nameHindi: 'इलेक्ट्रीशियन', duration: '6 months', certification: true, provider: 'ITI/NSDC', icon: '⚡' },
  { id: 'computer_op', name: 'Computer Operator', nameHindi: 'कंप्यूटर ऑपरेटर', duration: '3 months', certification: true, provider: 'NIELIT/RSLDC', icon: '💻' },
  { id: 'beautician', name: 'Beautician', nameHindi: 'ब्यूटीशियन', duration: '3 months', certification: true, provider: 'RUDSETI', icon: '💄' },
  { id: 'driving', name: 'Driving', nameHindi: 'ड्राइविंग', duration: '1 month', certification: true, provider: 'RSLDC/Transport Dept', icon: '🚗' },
  { id: 'carpentry', name: 'Carpentry', nameHindi: 'बढ़ईगीरी', duration: '6 months', certification: true, provider: 'ITI/NSDC', icon: '🪚' },
  { id: 'welding', name: 'Welding', nameHindi: 'वेल्डिंग', duration: '3 months', certification: true, provider: 'ITI/NSDC', icon: '🔥' },
];

const COLLEGES: College[] = [
  { id: 'ddu', name: 'DDU Gorakhpur University', state: 'Uttar Pradesh', type: 'Government', courses: ['BA', 'B.Sc', 'B.Com', 'MA', 'M.Sc', 'M.Com'], website: 'https://ddugu.ac.in', icon: '🏛️' },
  { id: 'bhu', name: 'Banaras Hindu University', state: 'Uttar Pradesh', type: 'Central University', courses: ['BA', 'B.Sc', 'B.Tech', 'MBBS', 'LLB', 'MA', 'M.Sc', 'PhD'], website: 'https://bhu.ac.in', icon: '🎓' },
  { id: 'amity', name: 'Amity University Lucknow', state: 'Uttar Pradesh', type: 'Private', courses: ['B.Tech', 'MBA', 'BA', 'B.Sc', 'LLB', 'B.Ed'], website: 'https://amity.edu', icon: '🏫' },
  { id: 'patna_u', name: 'Patna University', state: 'Bihar', type: 'Government', courses: ['BA', 'B.Sc', 'B.Com', 'MA', 'LLB', 'B.Ed'], website: 'https://patnauniversity.ac.in', icon: '🏛️' },
  { id: 'mmmu', name: 'MMMUT Gorakhpur', state: 'Uttar Pradesh', type: 'Government', courses: ['B.Tech', 'M.Tech', 'MBA', 'MCA', 'PhD'], website: 'https://mmmut.ac.in', icon: '⚙️' },
  { id: 'delhi_u', name: 'University of Delhi', state: 'Delhi', type: 'Central University', courses: ['BA', 'B.Sc', 'B.Com', 'B.Tech', 'MA', 'M.Sc', 'MBA', 'PhD'], website: 'https://du.ac.in', icon: '🎓' },
  { id: 'aligarh', name: 'Aligarh Muslim University', state: 'Uttar Pradesh', type: 'Central University', courses: ['BA', 'B.Sc', 'B.Tech', 'MBBS', 'LLB', 'MA', 'PhD'], website: 'https://amu.ac.in', icon: '🏛️' },
  { id: 'gkp_engg', name: 'Kamla Nehru Institute of Technology', state: 'Uttar Pradesh', type: 'Government', courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'], website: 'https://knit.ac.in', icon: '⚙️' },
];

const FAQS: FaqItem[] = [
  { id: 'faq1', question: 'How do I apply for a scholarship?', questionHindi: 'छात्रवृत्ति के लिए आवेदन कैसे करें?', answer: 'Visit the National Scholarship Portal (scholarships.gov.in), register with your Aadhaar and bank details, fill the application form, upload required documents, and submit before the deadline.', answerHindi: 'राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) पर जाएं, आधार और बैंक विवरण के साथ पंजीकरण करें, आवेदन पत्र भरें, आवश्यक दस्तावेज अपलोड करें और समय सीमा से पहले जमा करें।', category: 'Scholarships' },
  { id: 'faq2', question: 'What documents are needed for scholarship application?', questionHindi: 'छात्रवृत्ति आवेदन के लिए किन दस्तावेजों की आवश्यकता है?', answer: 'Aadhaar card, income certificate, caste certificate (if applicable), previous mark sheets, bank account details, passport-size photo, and domicile certificate.', answerHindi: 'आधार कार्ड, आय प्रमाण पत्र, जाति प्रमाण पत्र (यदि लागू हो), पिछली अंक तालिकाएं, बैंक खाता विवरण, पासपोर्ट आकार का फोटो और निवास प्रमाण पत्र।', category: 'Scholarships' },
  { id: 'faq3', question: 'How to prepare for UPSC Civil Services?', questionHindi: 'यूपीएससी सिविल सेवा की तैयारी कैसे करें?', answer: 'Start with NCERTs (6th–12th), then move to standard reference books. Read newspapers daily for current affairs. Take mock tests regularly. Optional subject selection is crucial — choose wisely.', answerHindi: 'एनसीईआरटी (6वीं-12वीं) से शुरू करें, फिर मानक संदर्भ पुस्तकों पर जाएं। करंट अफेयर्स के लिए प्रतिदिन समाचार पत्र पढ़ें। नियमित रूप से मॉक टेस्ट दें। वैकल्पिक विषय का चयन महत्वपूर्ण है — समझदारी से चुनें।', category: 'Exams' },
  { id: 'faq4', question: 'What are free government skill training programs?', questionHindi: 'मुफ्त सरकारी कौशल प्रशिक्षण कार्यक्रम क्या हैं?', answer: 'PMKVY (Pradhan Mantri Kaushal Vikas Yojana), DDU-GKY (Deen Dayal Upadhyaya Grameen Kaushalya Yojana), NULM (National Urban Livelihood Mission), and RUDSETI programs offer free skill training with certification.', answerHindi: 'पीएमकेवीवाई, डीडीयू-जीकेवाई, एनयूएलएम और आरयूडीएसईटीआई कार्यक्रम प्रमाणन के साथ मुफ्त कौशल प्रशिक्षण प्रदान करते हैं।', category: 'Skills' },
  { id: 'faq5', question: 'How to get a student loan for higher education?', questionHindi: 'उच्च शिक्षा के लिए छात्र ऋण कैसे प्राप्त करें?', answer: 'Approach any nationalized bank with admission proof, fee structure, and collateral documents. Government offers interest subsidy schemes like Vidya Lakshmi. Loan amount up to ₹10 lakh without collateral for premier institutes.', answerHindi: 'प्रवेश प्रमाण, फीस संरचना और संपार्श्विक दस्तावेजों के साथ किसी भी राष्ट्रीयकृत बैंक से संपर्क करें। सरकार विद्या लक्ष्मी जैसी ब्याज सब्सिडी योजनाएं प्रदान करती है। प्रतिष्ठित संस्थानों के लिए बिना संपार्श्विक ₹10 लाख तक का ऋण।', category: 'Career Guidance' },
  { id: 'faq6', question: 'Which competitive exams can I take after 12th?', questionHindi: '12वीं के बाद कौन सी प्रतियोगी परीक्षाएं दे सकता हूं?', answer: 'NEET (medical), JEE Main/Advanced (engineering), CUET (central universities), NDA (defence), CLAT (law), IPMAT (management), NATA (architecture), and state-level entrance exams.', answerHindi: 'नीट (मेडिकल), जेईई मेन/एडवांस्ड (इंजीनियरिंग), क्यूएटी (केंद्रीय विश्वविद्यालय), एनडीए (रक्षा), क्लैट (कानून), आईपीएमएटी (प्रबंधन), नाटा (आर्किटेक्चर) और राज्य स्तरीय प्रवेश परीक्षाएं।', category: 'Exams' },
  { id: 'faq7', question: 'How to find colleges near me in rural areas?', questionHindi: 'ग्रामीण क्षेत्रों में अपने नजदीकी कॉलेज कैसे खोजें?', answer: 'Use the UGC website or state education department portals. Look for nearby degree colleges, ITIs, polytechnics, and skill development centers. Many districts have at least one government degree college.', answerHindi: 'यूजीसी वेबसाइट या राज्य शिक्षा विभाग पोर्टल का उपयोग करें। पास के डिग्री कॉलेजों, आईटीआई, पॉलिटेक्निक और कौशल विकास केंद्रों की तलाश करें। कई जिलों में कम से कम एक सरकारी डिग्री कॉलेज है।', category: 'College Info' },
  { id: 'faq8', question: 'What career options are available after graduation?', questionHindi: 'स्नातक के बाद कौन से करियर विकल्प उपलब्ध हैं?', answer: 'Government jobs (UPSC/SSC/State PSC), private sector (IT, banking, finance, marketing), higher studies (MBA, M.Tech, LLB), entrepreneurship (Startup India, Mudra loan), or skill-based self-employment.', answerHindi: 'सरकारी नौकरियां (यूपीएससी/एसएससी/राज्य पीएससी), निजी क्षेत्र (आईटी, बैंकिंग, वित्त, विपणन), उच्च शिक्षा (एमबीए, एम.टेक, एलएलबी), उद्यमिता (स्टार्टअप इंडिया, मुद्रा लोन) या कौशल-आधारित स्वरोजगार।', category: 'Career Guidance' },
];

export async function getScholarships(category?: string): Promise<Scholarship[]> {
  if (!category || category === 'All') return SCHOLARSHIPS;
  return SCHOLARSHIPS.filter((s) => s.category === category || s.state === category);
}

export async function getScholarshipById(id: string): Promise<Scholarship | undefined> {
  return SCHOLARSHIPS.find((s) => s.id === id);
}

export async function searchScholarships(query: string): Promise<Scholarship[]> {
  const q = query.toLowerCase();
  return SCHOLARSHIPS.filter((s) => s.title.toLowerCase().includes(q) || s.titleHindi.includes(q));
}

export async function getExams(): Promise<Exam[]> {
  return EXAMS;
}

export async function getCourses(category?: string): Promise<EduCourse[]> {
  if (!category || category === 'All') return COURSES;
  return COURSES.filter((c) => c.level === category);
}

export async function getStudyMaterials(category?: string): Promise<StudyMaterial[]> {
  if (!category || category === 'All') return STUDY_MATERIALS;
  return STUDY_MATERIALS.filter((m) => m.category === category);
}

export async function getCareerPaths(): Promise<CareerPath[]> {
  return CAREER_PATHS;
}

export async function getSkills(): Promise<Skill[]> {
  return SKILLS;
}

export async function getColleges(): Promise<College[]> {
  return COLLEGES;
}

export async function getFaqs(category?: string): Promise<FaqItem[]> {
  if (!category || category === 'All') return FAQS;
  return FAQS.filter((f) => f.category === category);
}

export const educationService = {
  getScholarships,
  getScholarshipById,
  searchScholarships,
  getExams,
  getCourses,
  getStudyMaterials,
  getCareerPaths,
  getSkills,
  getColleges,
  getFaqs,
};
