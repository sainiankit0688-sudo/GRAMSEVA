// FROZEN — DO NOT MODIFY — Phase 3 Complete
export interface EmergencyContact {
  id: string;
  title: string;
  titleHindi: string;
  number: string;
  description: string;
  descriptionHindi: string;
  icon: string;
  color: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  district: string;
  state: string;
  phone: string;
  emergencyAvailable: boolean;
  is24x7: boolean;
  lat: number;
  lng: number;
}

export interface PoliceStation {
  id: string;
  name: string;
  address: string;
  phone: string;
  district: string;
  lat: number;
  lng: number;
}

export interface FireStation {
  id: string;
  name: string;
  phone: string;
  address: string;
  coverageArea: string;
  lat: number;
  lng: number;
}

export interface AmbulanceProvider {
  id: string;
  name: string;
  number: string;
  type: 'Govt' | 'Private' | 'NGO';
  description: string;
  is24x7: boolean;
}

export interface DisasterStep {
  id: string;
  title: string;
  titleHindi: string;
  icon: string;
  color: string;
  dos: string[];
  donts: string[];
  emergencyKit: string[];
  evacuationSteps: string[];
}

export interface Helpline {
  id: string;
  title: string;
  titleHindi: string;
  number: string;
  category: string;
  description: string;
  descriptionHindi: string;
  icon: string;
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: '112', title: 'Universal Emergency', titleHindi: 'सार्वभौमिक आपातकालीन', number: '112', description: 'Single emergency number for police, fire, ambulance, and disaster response. Available 24x7 across India.', descriptionHindi: 'पुलिस, दमकल, एम्बुलेंस और आपदा प्रतिक्रिया के लिए एकल आपातकालीन नंबर। पूरे भारत में 24x7 उपलब्ध।', icon: '🆘', color: '#B71C1C' },
  { id: '100', title: 'Police', titleHindi: 'पुलिस', number: '100', description: 'Emergency police assistance. Report crimes, theft, accidents, and security threats.', descriptionHindi: 'आपातकालीन पुलिस सहायता। अपराध, चोरी, दुर्घटना और सुरक्षा खतरों की रिपोर्ट करें।', icon: '👮', color: '#1565C0' },
  { id: '101', title: 'Fire Brigade', titleHindi: 'दमकल', number: '101', description: 'Fire emergency reporting. Rescue operations, hazardous material incidents, and building collapses.', descriptionHindi: 'आग की आपात सूचना। बचाव अभियान, खतरनाक सामग्री दुर्घटनाएं और भवन ढहना।', icon: '🚒', color: '#E65100' },
  { id: '102', title: 'Ambulance', titleHindi: 'एम्बुलेंस', number: '102', description: 'Free emergency ambulance service. Patient transport, medical emergencies, and accident response.', descriptionHindi: 'मुफ्त आपातकालीन एम्बुलेंस सेवा। रोगी परिवहन, चिकित्सा आपात स्थिति और दुर्घटना प्रतिक्रिया।', icon: '🚑', color: '#C62828' },
  { id: '108', title: 'Emergency Medical', titleHindi: 'आपातकालीन चिकित्सा', number: '108', description: 'Centralized emergency medical service. Advanced life support ambulances with paramedics.', descriptionHindi: 'केंद्रीकृत आपातकालीन चिकित्सा सेवा। पैरामेडिक्स के साथ उन्नत जीवन समर्थन एम्बुलेंस।', icon: '🏥', color: '#2E7D32' },
  { id: '1091', title: 'Women Helpline', titleHindi: 'महिला हेल्पलाइन', number: '1091', description: '24x7 helpline for women in distress. Immediate police assistance, counseling, and shelter information.', descriptionHindi: 'संकटग्रस्त महिलाओं के लिए 24x7 हेल्पलाइन। तत्काल पुलिस सहायता, परामर्श और आश्रय की जानकारी।', icon: '👩', color: '#6A1B9A' },
  { id: '1098', title: 'Child Helpline', titleHindi: 'बाल हेल्पलाइन', number: '1098', description: 'Emergency assistance for children in need of care and protection. Report child abuse, trafficking, and missing children.', descriptionHindi: 'देखभाल और संरक्षण की जरूरत वाले बच्चों के लिए आपातकालीन सहायता। बाल शोषण, तस्करी और लापता बच्चों की रिपोर्ट करें।', icon: '👶', color: '#F57F17' },
  { id: '1930', title: 'Cyber Crime', titleHindi: 'साइबर क्राइम', number: '1930', description: 'National cyber crime reporting helpline. Report online fraud, identity theft, cyber bullying, and financial scams.', descriptionHindi: 'राष्ट्रीय साइबर अपराध रिपोर्टिंग हेल्पलाइन। ऑनलाइन धोखाधड़ी, पहचान चोरी, साइबर बदमाशी और वित्तीय घोटालों की रिपोर्ट करें।', icon: '💻', color: '#00838F' },
  { id: '181', title: 'Women Help', titleHindi: 'महिला सहायता', number: '181', description: 'National women helpline. Provides information, counseling, and referral services for women facing violence or harassment.', descriptionHindi: 'राष्ट्रीय महिला हेल्पलाइन। हिंसा या उत्पीड़न का सामना कर रही महिलाओं के लिए सूचना, परामर्श और रेफरल सेवाएं।', icon: '👩‍⚖️', color: '#AD1457' },
  { id: '1078', title: 'Disaster Relief', titleHindi: 'आपदा राहत', number: '1078', description: 'NDRF helpline for natural disasters. Report floods, earthquakes, cyclones, landslides and request rescue teams.', descriptionHindi: 'प्राकृतिक आपदाओं के लिए एनडीआरएफ हेल्पलाइन। बाढ़, भूकंप, चक्रवात, भूस्खलन की रिपोर्ट करें और बचाव दल का अनुरोध करें।', icon: '⛈️', color: '#00695C' },
  { id: '1070', title: 'State Disaster', titleHindi: 'राज्य आपदा', number: '1070', description: 'State emergency operations center. Coordinate disaster response at state level with local authorities.', descriptionHindi: 'राज्य आपातकालीन संचालन केंद्र। स्थानीय अधिकारियों के साथ राज्य स्तर पर आपदा प्रतिक्रिया का समन्वय।', icon: '🌊', color: '#37474F' },
];

const HOSPITALS: Hospital[] = [
  { id: 'aiims_delhi', name: 'AIIMS Delhi', address: 'Ansari Nagar, New Delhi', district: 'New Delhi', state: 'Delhi', phone: '011-26588500', emergencyAvailable: true, is24x7: true, lat: 28.5672, lng: 77.2100 },
  { id: 'sgpgi', name: 'SGPGI Lucknow', address: 'Raebareli Road, Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', phone: '0522-2494000', emergencyAvailable: true, is24x7: true, lat: 26.8467, lng: 80.9462 },
  { id: 'kgmu', name: 'King George\'s Medical University', address: 'Shahmina Road, Chowk, Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', phone: '0522-2257540', emergencyAvailable: true, is24x7: true, lat: 26.8667, lng: 80.9200 },
  { id: 'brd_gorakhpur', name: 'BRD Medical College', address: 'Gorakhpur Medical College Campus, Gorakhpur', district: 'Gorakhpur', state: 'Uttar Pradesh', phone: '0551-2201750', emergencyAvailable: true, is24x7: true, lat: 26.7487, lng: 83.3685 },
  { id: 'sir_sunderlal', name: 'Sir Sunderlal Hospital', address: 'Banaras Hindu University Campus, Varanasi', district: 'Varanasi', state: 'Uttar Pradesh', phone: '0542-2367588', emergencyAvailable: true, is24x7: true, lat: 25.2677, lng: 82.9913 },
  { id: 'civil_ahmedabad', name: 'Civil Hospital Ahmedabad', address: 'Asarwa, Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', phone: '079-22680000', emergencyAvailable: true, is24x7: true, lat: 23.0415, lng: 72.6058 },
  { id: 'sassoon_pune', name: 'Sassoon General Hospital', address: 'Jai Prakash Narayan Road, Pune', district: 'Pune', state: 'Maharashtra', phone: '020-26128000', emergencyAvailable: true, is24x7: true, lat: 18.5297, lng: 73.8709 },
  { id: 'nizams_hyd', name: 'Nizam\'s Institute of Medical Sciences', address: 'Punjagutta, Hyderabad', district: 'Hyderabad', state: 'Telangana', phone: '040-23489266', emergencyAvailable: true, is24x7: true, lat: 17.4194, lng: 78.4747 },
  { id: 'pgimer_chd', name: 'PGIMER Chandigarh', address: 'Sector 12, Chandigarh', district: 'Chandigarh', state: 'Chandigarh', phone: '0172-2747585', emergencyAvailable: true, is24x7: true, lat: 30.7678, lng: 76.7712 },
  { id: 'jipmer_pdy', name: 'JIPMER Puducherry', address: 'Dhanvantari Nagar, Puducherry', district: 'Puducherry', state: 'Puducherry', phone: '0413-2296444', emergencyAvailable: true, is24x7: true, lat: 11.9647, lng: 79.8172 },
  { id: 'cmc_vellore', name: 'Christian Medical College Vellore', address: 'Ida Scudder Road, Vellore', district: 'Vellore', state: 'Tamil Nadu', phone: '0416-2281000', emergencyAvailable: true, is24x7: true, lat: 12.9249, lng: 79.1380 },
  { id: 'rnth_gorakhpur', name: 'Rawat Nursing Home', address: 'Mohaddiganj, Gorakhpur', district: 'Gorakhpur', state: 'Uttar Pradesh', phone: '0551-2331441', emergencyAvailable: false, is24x7: true, lat: 26.7598, lng: 83.3743 },
];

const POLICE_STATIONS: PoliceStation[] = [
  { id: 'gorakhpur_city', name: 'Gorakhpur City Kotwali', address: 'Mohanpur Road, Gorakhpur', phone: '0551-2341010', district: 'Gorakhpur', lat: 26.7551, lng: 83.3719 },
  { id: 'lucknow_hazratganj', name: 'Hazratganj Police Station', address: 'Hazratganj, Lucknow', phone: '0522-2622150', district: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { id: 'varanasi_cantt', name: 'Varanasi Cantt Police Station', address: 'Cantonment Area, Varanasi', phone: '0542-2501080', district: 'Varanasi', lat: 25.3356, lng: 82.9937 },
  { id: 'allahabad_george', name: 'George Town Police Station', address: 'George Town, Prayagraj', phone: '0532-2440440', district: 'Prayagraj', lat: 25.4500, lng: 81.8500 },
  { id: 'noida_sector20', name: 'Sector 20 Police Station', address: 'Sector 20, Noida', phone: '0120-2440033', district: 'Gautam Buddha Nagar', lat: 28.5867, lng: 77.3150 },
  { id: 'kanpur_kotwali', name: 'Kanpur Kotwali', address: 'Moti Jheel, Kanpur', phone: '0512-2313130', district: 'Kanpur Nagar', lat: 26.4499, lng: 80.3319 },
  { id: 'agra_sadar', name: 'Agra Sadar Police Station', address: 'Sadar Bazar, Agra', phone: '0562-2225500', district: 'Agra', lat: 27.1767, lng: 78.0081 },
  { id: 'meerut_kotwali', name: 'Meerut Kotwali', address: 'Begum Bridge Road, Meerut', phone: '0121-2660520', district: 'Meerut', lat: 28.9845, lng: 77.7061 },
  { id: 'patna_kotwali', name: 'Patna Kotwali', address: 'Sher Shah Road, Patna', phone: '0612-2325430', district: 'Patna', lat: 25.6100, lng: 85.1400 },
  { id: 'bhopal_hanuman', name: 'Hanumanganj Police Station', address: 'Hanumanganj, Bhopal', phone: '0755-2540204', district: 'Bhopal', lat: 23.2500, lng: 77.4200 },
];

const FIRE_STATIONS: FireStation[] = [
  { id: 'delhi_cp', name: 'Connaught Place Fire Station', phone: '011-23342012', address: 'Connaught Place, New Delhi', coverageArea: 'Central Delhi', lat: 28.6315, lng: 77.2167 },
  { id: 'mumbai_byculla', name: 'Byculla Fire Station', phone: '022-23751234', address: 'Byculla, Mumbai', coverageArea: 'South Mumbai', lat: 18.9780, lng: 72.8325 },
  { id: 'lucknow_fire', name: 'Lucknow Fire Station', phone: '0522-2690140', address: 'Hazratganj, Lucknow', coverageArea: 'Lucknow City', lat: 26.8467, lng: 80.9462 },
  { id: 'kanpur_fire', name: 'Kanpur Fire Station', phone: '0512-2332000', address: 'Moti Jheel, Kanpur', coverageArea: 'Kanpur City', lat: 26.4499, lng: 80.3319 },
  { id: 'varanasi_fire', name: 'Varanasi Fire Station', phone: '0542-2222030', address: 'Lanka, Varanasi', coverageArea: 'Varanasi City', lat: 25.2820, lng: 82.9756 },
  { id: 'gorakhpur_fire', name: 'Gorakhpur Fire Station', phone: '0551-2340500', address: 'Golghar, Gorakhpur', coverageArea: 'Gorakhpur City & nearby', lat: 26.7551, lng: 83.3719 },
  { id: 'patna_fire', name: 'Patna Fire Station', phone: '0612-2320400', address: 'Kadamkuan, Patna', coverageArea: 'Patna City', lat: 25.6100, lng: 85.1400 },
  { id: 'bhopal_fire', name: 'Bhopal Fire Station', phone: '0755-2753500', address: 'MP Nagar, Bhopal', coverageArea: 'Bhopal City', lat: 23.2500, lng: 77.4200 },
];

const AMBULANCE_PROVIDERS: AmbulanceProvider[] = [
  { id: '108_emergency', name: '108 Emergency Ambulance', number: '108', type: 'Govt', description: 'Free centralized emergency medical service with advanced life support ambulances. Available 24x7 across India.', is24x7: true },
  { id: '102_patient', name: '102 Patient Transport', number: '102', type: 'Govt', description: 'Free patient transport service for pregnant women, infants, and critically ill patients to government hospitals.', is24x7: true },
  { id: 'ziqitza', name: 'Ziqitza Healthcare', number: '1800-102-5663', type: 'Private', description: 'Private ambulance service providing emergency medical response, hospital transfers, and event standby services.', is24x7: true },
  { id: 'red_cross', name: 'Indian Red Cross Ambulance', number: '011-23716441', type: 'NGO', description: 'NGO-run ambulance service for emergency medical transport and disaster response. Services in major cities.', is24x7: false },
  { id: 'st_john', name: 'St. John Ambulance', number: '011-23318049', type: 'NGO', description: 'Voluntary ambulance service providing first aid, emergency transport, and disaster relief across India.', is24x7: false },
  { id: 'emri', name: 'EMRI Green Health Services', number: '108', type: 'Govt', description: 'Emergency Management and Research Institute. Provides integrated emergency response with ambulances, fire, and police coordination.', is24x7: true },
];

const DISASTER_STEPS: DisasterStep[] = [
  {
    id: 'flood', title: 'Flood Safety', titleHindi: 'बाढ़ सुरक्षा', icon: '🌊', color: '#00695C',
    dos: ['Move to higher ground immediately', 'Keep emergency kit ready', 'Turn off electricity and gas', 'Listen to weather alerts on radio/TV', 'Drink only boiled/bottled water', 'Help elderly and disabled persons'],
    donts: ['Do not walk through moving water', 'Do not swim in flood waters', 'Do not touch electrical equipment in water', 'Do not drive through flooded roads', 'Do not leave children unattended', 'Do not ignore evacuation orders'],
    emergencyKit: ['Drinking water (3L per person/day)', 'Non-perishable food for 3 days', 'First aid kit and medicines', 'Flashlight with extra batteries', 'Whistle to signal for help', 'Important documents in waterproof bag', 'Cash and emergency contacts', 'Mobile phone with power bank'],
    evacuationSteps: ['Move to higher ground or upper floors', 'Follow designated evacuation routes', 'Use ropes to secure family members', 'Carry emergency kit with you', 'Help children, elderly, and disabled', 'Do not return home until authorities declare it safe'],
  },
  {
    id: 'fire', title: 'Fire Safety', titleHindi: 'आग सुरक्षा', icon: '🔥', color: '#C62828',
    dos: ['Call 101 immediately', 'Use fire extinguisher if trained', 'Cover mouth and nose with wet cloth', 'Stay low under smoke', 'Test door handle before opening', 'Close doors behind you'],
    donts: ['Do not use elevators', 'Do not break windows unnecessarily', 'Do not jump from tall buildings', 'Do not hide in closets/bathrooms', 'Do not re-enter burning building', 'Do not use water on electrical fires'],
    emergencyKit: ['Fire extinguisher (ABC type)', 'Smoke detectors', 'Fire blanket', 'Emergency escape ladder', 'Flashlight', 'Whistle', 'First aid kit for burns', 'Emergency contact list'],
    evacuationSteps: ['Alert everyone in the building', 'Stay low and crawl if there is smoke', 'Use stairs, never elevators', 'Check doors with back of hand', 'Close doors behind you to slow fire spread', 'Designate a meeting point outside', 'Call 101 from outside the building'],
  },
  {
    id: 'earthquake', title: 'Earthquake Safety', titleHindi: 'भूकंप सुरक्षा', icon: '🏚️', color: '#37474F',
    dos: ['Drop, Cover, and Hold On', 'Take cover under sturdy furniture', 'Stay away from windows and glass', 'If outside, move to open area', 'Keep calm and reassure others', 'Prepare for aftershocks'],
    donts: ['Do not use elevators', 'Do not stand near buildings/walls', 'Do not run outside during shaking', 'Do not light matches or candles', 'Do not use phone except for emergencies', 'Do not park near overpasses/bridges'],
    emergencyKit: ['Drinking water and food supplies', 'First aid kit', 'Flashlight and extra batteries', 'Portable radio', 'Whistle', 'Dust masks', 'Wrench for turning off utilities', 'Emergency contact list'],
    evacuationSteps: ['During shaking: Drop, Cover, Hold On', 'After shaking stops, evacuate calmly', 'Use stairs, inspect for damage', 'Go to open area away from buildings', 'Check for injuries, give first aid', 'Listen to radio for official instructions', 'Be prepared for aftershocks'],
  },
  {
    id: 'heatwave', title: 'Heatwave Safety', titleHindi: 'लू सुरक्षा', icon: '☀️', color: '#E65100',
    dos: ['Drink plenty of water regularly', 'Wear light, loose cotton clothing', 'Stay indoors during peak heat (12-4 PM)', 'Use ORS and homemade drinks', 'Take cool showers', 'Check on elderly and sick neighbors'],
    donts: ['Do not go out in direct sun without need', 'Do not drink alcohol, caffeine or tea', 'Do not leave children/pets in parked cars', 'Do not do strenuous outdoor work', 'Do not skip meals', 'Do not ignore heat stroke symptoms'],
    emergencyKit: ['Oral Rehydration Solution (ORS)', 'Electrolyte drinks', 'Cooling towels', 'Battery-operated fan', 'Sunscreen and hat', 'Umbrella for shade', 'Water bottle', 'First aid for heat-related illness'],
    evacuationSteps: ['Move to shaded or air-conditioned area', 'Apply cool wet cloths to body', 'Drink cool water slowly', 'Fan the person for air circulation', 'Call 102 if heat stroke is suspected', 'Monitor body temperature continuously'],
  },
  {
    id: 'coldwave', title: 'Cold Wave Safety', titleHindi: 'शीत लहर सुरक्षा', icon: '❄️', color: '#1565C0',
    dos: ['Wear multiple layers of warm clothes', 'Cover head, ears, hands, and feet', 'Stay indoors as much as possible', 'Use safe heating devices', 'Eat warm, high-energy food', 'Keep emergency supplies ready'],
    donts: ['Do not use charcoal/gas heaters indoors', 'Do not drink alcohol to stay warm', 'Do not ignore shivering (early hypothermia sign)', 'Do not stay in wet clothes', 'Do not sleep in unventilated room with heater', 'Do not expose skin in extreme cold'],
    emergencyKit: ['Warm blankets and sleeping bags', 'Extra warm clothes', 'Hot water bottles', 'Flashlight with batteries', 'Non-perishable warm food', 'Thermos for hot drinks', 'First aid kit', 'Firewood/coal if available'],
    evacuationSteps: ['Move to warm indoor shelter', 'Remove wet clothing immediately', 'Wrap in warm blankets', 'Drink warm liquids gradually', 'Seek medical help if hypothermia signs appear', 'Avoid sudden temperature changes'],
  },
  {
    id: 'lightning', title: 'Lightning Safety', titleHindi: 'बिजली गिरने से सुरक्षा', icon: '⚡', color: '#F57F17',
    dos: ['Seek shelter in a building or hard-top car', 'Stay away from tall isolated trees', 'Unplug electrical appliances', 'Stay away from water and plumbing', 'Wait 30 minutes after last thunderclap', 'Keep emergency kit nearby'],
    donts: ['Do not stand in open fields', 'Do not use corded electronics', 'Do not take bath/shower during storm', 'Do not use metal objects (umbrellas, golf clubs)', 'Do not stay near concrete walls/floors', 'Do not lie flat on ground'],
    emergencyKit: ['Portable charger/power bank', 'Flashlight with batteries', 'First aid kit', 'Whistle', 'Battery-operated radio', 'Emergency contact list'],
    evacuationSteps: ['Immediately seek indoor shelter', 'If no shelter, crouch low with feet together', 'Avoid open vehicles, sheds, and picnic shelters', 'Move away from elevated areas', 'Within building: avoid windows and doors', '30-30 rule: 30 seconds flash-to-bang, wait 30 min'],
  },
  {
    id: 'cyclone', title: 'Cyclone Safety', titleHindi: 'चक्रवात सुरक्षा', icon: '🌀', color: '#00838F',
    dos: ['Stay indoors and away from windows', 'Secure loose objects in compound', 'Store drinking water and food for 5-7 days', 'Keep documents in waterproof bags', 'Listen to weather updates', 'Move to cyclone shelter if ordered'],
    donts: ['Do not go outside during cyclone', 'Do not drive through flooded roads', 'Do not use phone unless emergency', 'Do not stay in coastal areas', 'Do not ignore cyclone warnings', 'Do not return until declared safe'],
    emergencyKit: ['Drinking water (5L per person/day)', 'Dry rations for 7 days', 'First aid kit', 'Flashlight and candles', 'Battery-operated radio', 'Waterproof bags for documents', 'Cash and emergency contacts', 'Cooking stove and fuel'],
    evacuationSteps: ['Pack emergency kit and documents', 'Secure your home (board windows, sandbags)', 'Follow official evacuation routes', 'Move to designated cyclone shelter', 'Help neighbors, elderly, and disabled', 'Stay in shelter until all-clear', 'Check for structural damage before returning'],
  },
];

const HELPLINES: Helpline[] = [
  { id: 'women_1091', title: 'Women Helpline', titleHindi: 'महिला हेल्पलाइन', number: '1091', category: 'Women', description: '24x7 helpline for women in distress. Immediate police assistance and counseling.', descriptionHindi: 'संकटग्रस्त महिलाओं के लिए 24x7 हेल्पलाइन। तत्काल पुलिस सहायता और परामर्श।', icon: '👩' },
  { id: 'women_181', title: 'Women Help (181)', titleHindi: 'महिला सहायता (181)', number: '181', category: 'Women', description: 'National women helpline for information, counseling, and referral services.', descriptionHindi: 'सूचना, परामर्श और रेफरल सेवाओं के लिए राष्ट्रीय महिला हेल्पलाइन।', icon: '👩‍⚖️' },
  { id: 'child_1098', title: 'Child Helpline', titleHindi: 'बाल हेल्पलाइन', number: '1098', category: 'Child', description: 'Emergency assistance for children in need of care and protection.', descriptionHindi: 'देखभाल की जरूरत वाले बच्चों के लिए आपातकालीन सहायता।', icon: '👶' },
  { id: 'senior_14567', title: 'Senior Citizen Helpline', titleHindi: 'वरिष्ठ नागरिक हेल्पलाइन', number: '14567', category: 'Senior Citizen', description: 'Helpline for senior citizens providing police assistance, security, and emergency support.', descriptionHindi: 'वरिष्ठ नागरिकों के लिए पुलिस सहायता, सुरक्षा और आपातकालीन सहायता हेल्पलाइन।', icon: '👴' },
  { id: 'mental_health', title: 'KIRAN Mental Health', titleHindi: 'किरण मानसिक स्वास्थ्य', number: '1800-599-0019', category: 'Mental Health', description: '24x7 mental health helpline providing psychological counseling, crisis intervention, and suicide prevention.', descriptionHindi: 'मनोवैज्ञानिक परामर्श, संकट हस्तक्षेप और आत्महत्या रोकथाम के लिए 24x7 मानसिक स्वास्थ्य हेल्पलाइन।', icon: '🧠' },
  { id: 'farmer_kisan', title: 'Kisan Call Centre', titleHindi: 'किसान कॉल सेंटर', number: '1800-180-1551', category: 'Farmer', description: 'Farmer helpline for agricultural queries, scheme information, and expert advice on farming practices.', descriptionHindi: 'कृषि प्रश्नों, योजना की जानकारी और कृषि पद्धतियों पर विशेषज्ञ सलाह के लिए किसान हेल्पलाइन।', icon: '🌾' },
  { id: 'cyber_1930', title: 'Cyber Crime', titleHindi: 'साइबर क्राइम', number: '1930', category: 'Cyber Crime', description: 'National cyber crime reporting helpline. Report online fraud, identity theft, and financial scams.', descriptionHindi: 'राष्ट्रीय साइबर अपराध रिपोर्टिंग हेल्पलाइन। ऑनलाइन धोखाधड़ी, पहचान चोरी की रिपोर्ट करें।', icon: '💻' },
  { id: 'railway_139', title: 'Railway Helpline', titleHindi: 'रेलवे हेल्पलाइन', number: '139', category: 'Railway', description: 'Indian Railways helpline for PNR status, train enquiries, complaints, and emergency assistance at stations.', descriptionHindi: 'पीएनआर स्थिति, ट्रेन पूछताछ, शिकायतों के लिए भारतीय रेलवे हेल्पलाइन।', icon: '🚂' },
  { id: 'electricity_1912', title: 'Electricity Helpline', titleHindi: 'बिजली हेल्पलाइन', number: '1912', category: 'Electricity', description: 'National electricity complaint helpline. Report power outages, billing issues, and electrical emergencies.', descriptionHindi: 'राष्ट्रीय बिजली शिकायत हेल्पलाइन। बिजली कटौती, बिलिंग समस्याओं की रिपोर्ट करें।', icon: '💡' },
  { id: 'gas_1906', title: 'Gas Leakage Helpline', titleHindi: 'गैस रिसाव हेल्पलाइन', number: '1906', category: 'Gas Leakage', description: 'National gas leakage emergency helpline. Report LPG/PNG gas leaks, cylinder fires, and pipeline emergencies.', descriptionHindi: 'राष्ट्रीय गैस रिसाव आपातकालीन हेल्पलाइन। एलपीजी/पीएनजी गैस रिसाव की रिपोर्ट करें।', icon: '🔥' },
  { id: 'animal_1962', title: 'Animal Helpline', titleHindi: 'पशु हेल्पलाइन', number: '1962', category: 'Animal', description: 'Animal welfare helpline. Report injured animals, animal cruelty, street dog issues, and wildlife emergencies.', descriptionHindi: 'पशु कल्याण हेल्पलाइन। घायल जानवरों, पशु क्रूरता की रिपोर्ट करें।', icon: '🐾' },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh', 'Puducherry',
];

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  return EMERGENCY_CONTACTS;
}

export async function searchEmergencyContacts(query: string): Promise<EmergencyContact[]> {
  const q = query.toLowerCase();
  return EMERGENCY_CONTACTS.filter(
    (c) => c.title.toLowerCase().includes(q) || c.titleHindi.includes(q) || c.number.includes(q),
  );
}

export async function getHospitals(state?: string, search?: string): Promise<Hospital[]> {
  let results = HOSPITALS;
  if (state && state !== 'All') results = results.filter((h) => h.state === state);
  if (search) {
    const q = search.toLowerCase();
    results = results.filter((h) => h.name.toLowerCase().includes(q) || h.district.toLowerCase().includes(q) || h.address.toLowerCase().includes(q));
  }
  return results;
}

export async function getHospitalById(id: string): Promise<Hospital | undefined> {
  return HOSPITALS.find((h) => h.id === id);
}

export async function getPoliceStations(district?: string): Promise<PoliceStation[]> {
  if (district && district !== 'All') return POLICE_STATIONS.filter((p) => p.district === district);
  return POLICE_STATIONS;
}

export async function getFireStations(): Promise<FireStation[]> {
  return FIRE_STATIONS;
}

export async function getAmbulanceProviders(type?: string): Promise<AmbulanceProvider[]> {
  if (type && type !== 'All') return AMBULANCE_PROVIDERS.filter((a) => a.type === type);
  return AMBULANCE_PROVIDERS;
}

export async function getDisasterSteps(): Promise<DisasterStep[]> {
  return DISASTER_STEPS;
}

export async function getDisasterStepById(id: string): Promise<DisasterStep | undefined> {
  return DISASTER_STEPS.find((d) => d.id === id);
}

export async function getHelplines(category?: string): Promise<Helpline[]> {
  if (category && category !== 'All') return HELPLINES.filter((h) => h.category === category);
  return HELPLINES;
}

export async function getHelplineById(id: string): Promise<Helpline | undefined> {
  return HELPLINES.find((h) => h.id === id);
}

export async function searchHelplines(query: string): Promise<Helpline[]> {
  const q = query.toLowerCase();
  return HELPLINES.filter(
    (h) => h.title.toLowerCase().includes(q) || h.titleHindi.includes(q) || h.number.includes(q) || h.category.toLowerCase().includes(q),
  );
}

export function getIndianStates(): string[] {
  return INDIAN_STATES;
}

export const emergencyService = {
  getEmergencyContacts,
  searchEmergencyContacts,
  getHospitals,
  getHospitalById,
  getPoliceStations,
  getFireStations,
  getAmbulanceProviders,
  getDisasterSteps,
  getDisasterStepById,
  getHelplines,
  getHelplineById,
  searchHelplines,
  getIndianStates,
};
