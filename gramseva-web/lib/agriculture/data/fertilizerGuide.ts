/**
 * Fertilizer Guide Data
 *
 * Reference data from Android FertilizerGuideActivity.
 * Organized into fertilizer types and crop-wise NPK recommendations.
 */

import type { FertilizerRecommendation, FertilizerType } from '../types';

// ─── Fertilizer Types ─────────────────────────────────────────────────────────

export const fertilizerTypes: FertilizerType[] = [
  {
    name: 'Urea',
    nameHindi: 'यूरिया',
    formula: '46-0-0',
    uses: 'Primary nitrogen source for vegetative growth. Most widely used fertilizer in India.',
    usesHindi: 'वानस्पतिक वृद्धि के लिए प्राथमिक नाइट्रोजन स्रोत। भारत में सबसे अधिक उपयोग होने वाला उर्वरक।',
    icon: '🔵',
  },
  {
    name: 'DAP (Di-Ammonium Phosphate)',
    nameHindi: 'डीएपी (डाइ-अमोनियम फॉस्फेट)',
    formula: '18-46-0',
    uses: 'Rich in phosphorus. Promotes root development and flowering.',
    usesHindi: 'फॉस्फोरस से भरपूर। जड़ विकास और फूल आने को बढ़ावा देता है।',
    icon: '🟠',
  },
  {
    name: 'MOP (Muriate of Potash)',
    nameHindi: 'एमओपी (म्यूरेट ऑफ पोटाश)',
    formula: '0-0-60',
    uses: 'Potassium source. Improves disease resistance and overall plant health.',
    usesHindi: 'पोटैशियम स्रोत। रोग प्रतिरोधक क्षमता और समग्र पौधे के स्वास्थ्य में सुधार करता है।',
    icon: '🔴',
  },
  {
    name: 'SSP (Single Super Phosphate)',
    nameHindi: 'एसएसपी (सिंगल सुपर फॉस्फेट)',
    formula: '0-16-0 + Ca + S',
    uses: 'Provides phosphorus, calcium, and sulfur. Good for oilseeds and pulses.',
    usesHindi: 'फॉस्फोरस, कैल्शियम और सल्फर प्रदान करता है। तिलहन और दालों के लिए अच्छा।',
    icon: '🟡',
  },
  {
    name: 'NPK Complex',
    nameHindi: 'एनपीके जटिल',
    formula: 'Various (10-26-26, 20-20-0, etc.)',
    uses: 'Balanced nutrition with Nitrogen, Phosphorus, and Potassium in one granule.',
    usesHindi: 'एक दाने में नाइट्रोजन, फॉस्फोरस और पोटैशियम का संतुलित पोषण।',
    icon: '🟣',
  },
  {
    name: 'Zinc Sulphate',
    nameHindi: 'जिंक सल्फेट',
    formula: 'ZnSO₄',
    uses: 'Micronutrient for preventing zinc deficiency. Common in rice and wheat.',
    usesHindi: 'जिंक की कमी को रोकने के लिए सूक्ष्म पोषक तत्व। चावल और गेहूं में सामान्य।',
    icon: '⚪',
  },
];

// ─── Crop-wise NPK Recommendations ────────────────────────────────────────────

export const fertilizerRecommendations: FertilizerRecommendation[] = [
  {
    crop: 'Wheat',
    cropHindi: 'गेहूं',
    nitrogen: '120 kg/ha',
    phosphorus: '60 kg/ha',
    potassium: '40 kg/ha',
    tip: 'Apply 50% N at sowing, rest in 2 splits at first irrigation and tillering stage.',
    tipHindi: 'बुआई के समय 50% नाइट्रोजन डालें, बाकी पहली सिंचाई और तना फूटने के समय दो बराबर हिस्सों में डालें।',
  },
  {
    crop: 'Rice',
    cropHindi: 'धान',
    nitrogen: '80 kg/ha',
    phosphorus: '40 kg/ha',
    potassium: '40 kg/ha',
    tip: 'Apply N in 3 equal splits: basal, 30 DAS, and 60 DAS for best results.',
    tipHindi: 'नाइट्रोजन को 3 बराबर हिस्सों में डालें: रोपाई, 30 दिन और 60 दिन बाद।',
  },
  {
    crop: 'Maize',
    cropHindi: 'मक्का',
    nitrogen: '150 kg/ha',
    phosphorus: '75 kg/ha',
    potassium: '50 kg/ha',
    tip: 'Side-dress with N at knee-high stage. Apply full P and K at sowing.',
    tipHindi: 'घुटने ऊंचाई पर नाइट्रोजन की पत्ती डालें। सारा फॉस्फोरस और पोटैशियम बुआई में डालें।',
  },
  {
    crop: 'Sugarcane',
    cropHindi: 'गन्ना',
    nitrogen: '250 kg/ha',
    phosphorus: '100 kg/ha',
    potassium: '120 kg/ha',
    tip: 'Split N application every 30 days. Heavy feeder — needs consistent nutrition.',
    tipHindi: 'हर 30 दिन में नाइट्रोजन डालें। भारी उपभोक्ता — लगातार पोषण की आवश्यकता।',
  },
  {
    crop: 'Cotton',
    cropHindi: 'कपास',
    nitrogen: '120 kg/ha',
    phosphorus: '60 kg/ha',
    potassium: '60 kg/ha',
    tip: 'Apply N in 3 splits: basal, at square initiation, and at boll development.',
    tipHindi: 'नाइट्रोजन 3 हिस्सों में डालें: बुआई, फूल आने और टिकोरा बनने पर।',
  },
  {
    crop: 'Groundnut',
    cropHindi: 'मूंगफली',
    nitrogen: '20 kg/ha',
    phosphorus: '40 kg/ha',
    potassium: '40 kg/ha',
    tip: 'Legume — needs minimal N. Apply Rhizobium inoculant for biological N fixation.',
    tipHindi: 'दलहन — कम नाइट्रोजन की आवश्यकता। जैविक नाइट्रोजन स्थिरीकरण के लिए राइजोबियम टीकाकरण करें।',
  },
  {
    crop: 'Soybean',
    cropHindi: 'सोयाबीन',
    nitrogen: '30 kg/ha',
    phosphorus: '60 kg/ha',
    potassium: '40 kg/ha',
    tip: 'Apply P and K at sowing. Inoculate seeds with Rhizobium for best nitrogen supply.',
    tipHindi: 'बुआई में फॉस्फोरस और पोटैशियम डालें। बेहतर नाइट्रोजन के लिए बीज को राइजोबियम से टीकाकरण करें।',
  },
  {
    crop: 'Mustard',
    cropHindi: 'सरसों',
    nitrogen: '60 kg/ha',
    phosphorus: '25 kg/ha',
    potassium: '20 kg/ha',
    tip: 'Apply 50% N at sowing, balance at first flowering. Sulphur improves oil content.',
    tipHindi: 'बुआई में 50% नाइट्रोजन, बाकी पहले फूल आने पर। सल्फर तेल बढ़ाता है।',
  },
];

// ─── Micronutrients ───────────────────────────────────────────────────────────

export const micronutrients = [
  {
    name: 'Zinc',
    nameHindi: 'जिंक',
    deficiency: 'Stunted growth, white streaks on leaves',
    deficiencyHindi: 'बौनी वृद्धि, पत्तियों पर सफेद धारियां',
    solution: 'Zinc Sulphate 25 kg/ha soil application or 0.5% foliar spray',
    solutionHindi: 'जिंक सल्फेट 25 किग्रा/हेक्टेयर मिट्टी में या 0.5% पत्ती छिड़काव',
    affectedCrops: ['Rice', 'Wheat', 'Maize'],
    icon: '⚪',
  },
  {
    name: 'Iron',
    nameHindi: 'लोहा',
    deficiency: 'Interveinal chlorosis — yellow leaves with green veins',
    deficiencyHindi: 'पत्तियों के बीच पीलापन — हरी नसों वाली पीली पत्तियां',
    solution: 'Ferrous Sulphate 0.5% foliar spray at 15-day intervals',
    solutionHindi: 'फेरस सल्फेट 0.5% पत्ती छिड़काव 15 दिन के अंतराल पर',
    affectedCrops: ['Rice', 'Groundnut', 'Soybean'],
    icon: '🟤',
  },
  {
    name: 'Boron',
    nameHindi: 'बोरॉन',
    deficiency: 'Hollow stem, poor grain filling, cracked fruits',
    deficiencyHindi: 'खोखला तना, दाना भरने में कमी, फल फटना',
    solution: 'Borax 10 kg/ha soil application or 0.2% foliar spray',
    solutionHindi: 'बोरेक्स 10 किग्रा/हेक्टेयर मिट्टी में या 0.2% पत्ती छिड़काव',
    affectedCrops: ['Groundnut', 'Mustard', 'Cotton'],
    icon: '🟨',
  },
  {
    name: 'Sulphur',
    nameHindi: 'सल्फर',
    deficiency: 'General yellowing, poor oil content in oilseeds',
    deficiencyHindi: 'सामान्य पीलापन, तिलहन में तेल कम',
    solution: 'Elemental Sulphur 20-30 kg/ha or gypsum 200 kg/ha',
    solutionHindi: 'एलीमेंटल सल्फर 20-30 किग्रा/हेक्टेयर या जिप्सम 200 किग्रा/हेक्टेयर',
    affectedCrops: ['Mustard', 'Groundnut', 'Rice'],
    icon: '🟡',
  },
];
