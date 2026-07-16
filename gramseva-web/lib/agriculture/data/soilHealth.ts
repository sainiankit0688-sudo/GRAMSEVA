/**
 * Soil Health Data
 *
 * Reference data for soil types and health management
 * based on Indian agricultural soil science.
 */

import type { SoilTypeInfo } from '../types';

export const soilTypes: SoilTypeInfo[] = [
  {
    type: 'Alluvial Soil',
    typeHindi: 'जलोढ़ मिट्टी',
    description: 'Found in Indo-Gangetic plains. Very fertile, rich in minerals. Covers about 43% of India\'s land area.',
    descriptionHindi: 'इंडो-गैंगेटिक मैदानों में पाई जाती है। बहुत उपजाऊ, खनिजों से भरपूर। भारत के लगभग 43% भूमि को कवर करती है।',
    suitableCrops: ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Maize', 'Pulses'],
    suitableCropsHindi: ['गेहूं', 'धान', 'गन्ना', 'कपास', 'मक्का', 'दालें'],
    tips: ['Maintains good moisture retention', 'Responds well to organic matter addition', 'May need zinc in some areas'],
    tipsHindi: ['अच्छी नमी बनाए रखती है', 'जैविक पदार्थ डालने पर अच्छा प्रतिसाद', 'कुछ क्षेत्रों में जिंक की आवश्यकता'],
    icon: '🟤',
    color: '#8D6E63',
  },
  {
    type: 'Black Soil',
    typeHindi: 'काली मिट्टी',
    description: 'Found in Deccan Plateau. Excellent for cotton. High clay content with good moisture retention.',
    descriptionHindi: 'दक्कन पठार में पाई जाती है। कपास के लिए उत्कृष्ट। उच्च मिट्टी सामग्री, अच्छी नमी धारण क्षमता।',
    suitableCrops: ['Cotton', 'Soybean', 'Sorghum', 'Sunflower', 'Groundnut', 'Castor'],
    suitableCropsHindi: ['कपास', 'सोयाबीन', 'ज्वार', 'सूरजमुखी', 'मूंगफली', 'अरंडी'],
    tips: ['Cracks during dry season — good for aeration', 'Needs less irrigation than sandy soils', 'Apply lime to maintain pH above 6.5'],
    tipsHindi: ['सूखे मौसम में दरारें — हवा के लिए अच्छा', 'बलुई मिट्टी से कम सिंचाई की आवश्यकता', 'pH 6.5 से ऊपर रखने के लिए चूना डालें'],
    icon: '⬛',
    color: '#424242',
  },
  {
    type: 'Red Soil',
    typeHindi: 'लाल मिट्टी',
    description: 'Found in Tamil Nadu, Karnataka, Andhra Pradesh. Rich in iron oxide but low in nutrients.',
    descriptionHindi: 'तमिलनाडु, कर्नाटक, आंध्र प्रदेश में पाई जाती है। आयरन ऑक्साइड से भरपूर लेकिन पोषक तत्वों में कम।',
    suitableCrops: ['Rice', 'Groundnut', 'Ragi', 'Cotton', 'Potato', 'Tobacco'],
    suitableCropsHindi: ['धान', 'मूंगफली', 'रागी', 'कपास', 'आलू', 'तम्बाकू'],
    tips: ['Needs heavy organic manuring', 'Responds well to phosphate fertilizers', 'Loamy variety is more productive'],
    tipsHindi: ['भारी जैविक खाद की आवश्यकता', 'फॉस्फेट उर्वरकों पर अच्छा प्रतिसाद', 'दोमट किस्म अधिक उत्पादक'],
    icon: '🔴',
    color: '#C62828',
  },
  {
    type: 'Laterite Soil',
    typeHindi: 'लैटेराइट मिट्टी',
    description: 'Found in Western Ghats and high rainfall areas. Leached soil, low in fertility.',
    descriptionHindi: 'पश्चिमी घाट और अधिक वर्षा वाले क्षेत्रों में पाई जाती है। क्षरित मिट्टी, उपजाऊ में कम।',
    suitableCrops: ['Tea', 'Coffee', 'Rubber', 'Cashew', 'Rice', 'Coconut'],
    suitableCropsHindi: ['चाय', 'कॉफी', 'रबर', 'काजू', 'धान', 'नारियल'],
    tips: ['Needs heavy manuring and compost', 'Not ideal for grain crops', 'Best for plantation crops'],
    tipsHindi: ['भारी खाद और कम्पोस्ट की आवश्यकता', 'अनान की फसलों के लिए आदर्श नहीं', 'बागान फसलों के लिए सर्वोत्तम'],
    icon: '🟠',
    color: '#E65100',
  },
  {
    type: 'Sandy Soil',
    typeHindi: 'बलुई मिट्टी',
    description: 'Found in Rajasthan and coastal areas. Large particles, poor water retention, easy to work.',
    descriptionHindi: 'राजस्थान और तटीय क्षेत्रों में पाई जाती है। बड़े कण, कम जल धारण क्षमता, काम करने में आसान।',
    suitableCrops: ['Watermelon', 'Peanut', 'Sweet Potato', 'Cactus', 'Melon'],
    suitableCropsHindi: ['तरबूज', 'मूंगफली', 'शकरकंद', 'कैक्टस', 'खरबूजा'],
    tips: ['Needs frequent irrigation', 'Add organic matter to improve water retention', 'Low nutrient holding capacity'],
    tipsHindi: ['बार-बार सिंचाई की आवश्यकता', 'जल धारण सुधारने के लिए जैविक पदार्थ डालें', 'कम पोषक तत्व धारण क्षमता'],
    icon: '🟨',
    color: '#F9A825',
  },
  {
    type: 'Saline Soil',
    typeHindi: 'लवणीय मिट्टी',
    description: 'Found in arid regions, coastal belts, and waterlogged areas. High salt content restricts growth.',
    descriptionHindi: 'शुष्क क्षेत्रों, तटीय क्षेत्रों और जलभराव वाले क्षेत्रों में पाई जाती है। अधिक नमक वृद्धि को प्रतिबंधित करता है।',
    suitableCrops: ['Barley', 'Cotton', 'Sugar beet', 'Date Palm', 'Ber'],
    suitableCropsHindi: ['जौ', 'कपास', 'चीनी चुकंदर', 'खजूर', 'बेर'],
    tips: ['Improve drainage first', 'Apply gypsum to reduce salinity', 'Gypsum + organic matter is effective'],
    tipsHindi: ['पहले जल निकासी सुधारें', 'लवणता कम करने के लिए जिप्सम डालें', 'जिप्सम + जैविक पदार्थ प्रभावी'],
    icon: '⚪',
    color: '#78909C',
  },
];

// ─── Soil Testing Schedule ────────────────────────────────────────────────────

export const soilTestingSchedule = [
  { parameter: 'pH Level', parameterHindi: 'pH स्तर', idealRange: '6.0 - 7.5', frequency: 'Annual', frequencyHindi: 'वार्षिक' },
  { parameter: 'Nitrogen (N)', parameterHindi: 'नाइट्रोजन (N)', idealRange: '250-500 kg/ha', frequency: 'Annual', frequencyHindi: 'वार्षिक' },
  { parameter: 'Phosphorus (P)', parameterHindi: 'फॉस्फोरस (P)', idealRange: '10-25 kg/ha', frequency: 'Annual', frequencyHindi: 'वार्षिक' },
  { parameter: 'Potassium (K)', parameterHindi: 'पोटैशियम (K)', idealRange: '100-250 kg/ha', frequency: 'Annual', frequencyHindi: 'वार्षिक' },
  { parameter: 'Organic Carbon', parameterHindi: 'जैविक कार्बन', idealRange: '> 0.5%', frequency: 'Annual', frequencyHindi: 'वार्षिक' },
  { parameter: 'Electrical Conductivity', parameterHindi: 'विद्युत चालकता', idealRange: '< 2 dS/m', frequency: 'Annual', frequencyHindi: 'वार्षिक' },
];
