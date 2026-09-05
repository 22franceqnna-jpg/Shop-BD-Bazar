export interface UpazilaInfo {
  name: string;
  isDhakaCity?: boolean;
  isOtherDhaka?: boolean;
}

export interface DistrictInfo {
  name: string;
  upazilas: (string | UpazilaInfo)[];
}

export interface DivisionInfo {
  name: string;
  districts: DistrictInfo[];
}

export const BANGLADESH_DIVISIONS: DivisionInfo[] = [
  {
    name: "Dhaka",
    districts: [
      {
        name: "Dhaka",
        upazilas: [
          // Dhaka City Thanas (Inside Dhaka City -> ৳70)
          { name: "Dhanmondi", isDhakaCity: true },
          { name: "Gulshan", isDhakaCity: true },
          { name: "Banani", isDhakaCity: true },
          { name: "Uttara", isDhakaCity: true },
          { name: "Mirpur", isDhakaCity: true },
          { name: "Mohammadpur", isDhakaCity: true },
          { name: "Motijheel", isDhakaCity: true },
          { name: "Tejgaon", isDhakaCity: true },
          { name: "Badda", isDhakaCity: true },
          { name: "Khilgaon", isDhakaCity: true },
          { name: "Rampura", isDhakaCity: true },
          { name: "Malibagh", isDhakaCity: true },
          { name: "Moghbazar", isDhakaCity: true },
          { name: "Lalbagh", isDhakaCity: true },
          { name: "Chawkbazar", isDhakaCity: true },
          { name: "Kotwali (Old Dhaka)", isDhakaCity: true },
          { name: "Sutrapur", isDhakaCity: true },
          { name: "Wari", isDhakaCity: true },
          { name: "Jatrabari", isDhakaCity: true },
          { name: "Demra", isDhakaCity: true },
          { name: "Shahbagh", isDhakaCity: true },
          { name: "Paltan", isDhakaCity: true },
          { name: "Shyamoli", isDhakaCity: true },
          { name: "Adabor", isDhakaCity: true },
          { name: "Kafrul", isDhakaCity: true },
          { name: "Cantonment", isDhakaCity: true },
          { name: "Bashundhara R/A", isDhakaCity: true },
          { name: "Baridhara", isDhakaCity: true },
          { name: "Niketan", isDhakaCity: true },
          { name: "Hazaribagh", isDhakaCity: true },
          { name: "Kamrangirchar", isDhakaCity: true },
          // Dhaka District Suburbs (Other Dhaka City Areas -> ৳100)
          { name: "Savar", isOtherDhaka: true },
          { name: "Ashulia", isOtherDhaka: true },
          { name: "Keraniganj", isOtherDhaka: true },
          { name: "Dhamrai", isOtherDhaka: true },
          { name: "Dohar", isOtherDhaka: true },
          { name: "Nawabganj", isOtherDhaka: true }
        ]
      },
      {
        name: "Gazipur",
        upazilas: [
          { name: "Gazipur Sadar", isOtherDhaka: true },
          { name: "Tongi", isOtherDhaka: true },
          { name: "Kaliakair", isOtherDhaka: true },
          { name: "Kapasia", isOtherDhaka: true },
          { name: "Sreepur", isOtherDhaka: true },
          { name: "Kaliganj", isOtherDhaka: true }
        ]
      },
      {
        name: "Narayanganj",
        upazilas: [
          { name: "Narayanganj Sadar", isOtherDhaka: true },
          { name: "Bandar", isOtherDhaka: true },
          { name: "Fatullah", isOtherDhaka: true },
          { name: "Siddhirganj", isOtherDhaka: true },
          { name: "Rupganj", isOtherDhaka: true },
          { name: "Araihazar", isOtherDhaka: true },
          { name: "Sonargaon", isOtherDhaka: true }
        ]
      },
      {
        name: "Faridpur",
        upazilas: ["Faridpur Sadar", "Boalmari", "Alfadanga", "Madhukhali", "Bhanga", "Nagarkanda", "Charbhadrasan", "Sadarpur", "Saltha"]
      },
      {
        name: "Gopalganj",
        upazilas: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"]
      },
      {
        name: "Kishoreganj",
        upazilas: ["Kishoreganj Sadar", "Bhairab", "Bajitpur", "Kuliarchar", "Pakundia", "Katiadi", "Karimganj", "Tarail", "Hossainpur", "Itna", "Mithamain", "Nikli", "Ashtagram"]
      },
      {
        name: "Madaripur",
        upazilas: ["Madaripur Sadar", "Shibchar", "Kalkini", "Rajoir"]
      },
      {
        name: "Manikganj",
        upazilas: ["Manikganj Sadar", "Singair", "Saturia", "Ghior", "Daulatpur", "Harirampur", "Shibalaya"]
      },
      {
        name: "Munshiganj",
        upazilas: ["Munshiganj Sadar", "Sreenagar", "Sirajdikhan", "Louhajang", "Tongibari", "Gazaria"]
      },
      {
        name: "Narsingdi",
        upazilas: ["Narsingdi Sadar", "Palash", "Belabo", "Monohardi", "Shibpur", "Raipura"]
      },
      {
        name: "Rajbari",
        upazilas: ["Rajbari Sadar", "Goalanda", "Pangsha", "Baliakandi", "Kalukhali"]
      },
      {
        name: "Shariatpur",
        upazilas: ["Shariatpur Sadar", "Damudya", "Naria", "Janjira", "Bhedarganj", "Gosairhat"]
      },
      {
        name: "Tangail",
        upazilas: ["Tangail Sadar", "Mirzapur", "Nagarpur", "Sakhipur", "Basail", "Delduar", "Kalihati", "Ghatail", "Bhuapur", "Gopalpur", "Madhupur", "Dhanbari"]
      }
    ]
  },
  {
    name: "Chattogram",
    districts: [
      {
        name: "Chattogram",
        upazilas: ["Panchlaish", "Kotwali", "Khulshi", "Halishahar", "Pahartali", "Agrabad", "Bakalia", "Bayazid", "Chandgaon", "Patenga", "Double Mooring", "Hathazari", "Raozan", "Rangunia", "Fatikchhari", "Sitakunda", "Mirsharai", "Patiya", "Boalkhali", "Anwara", "Chandanaish", "Lohagara", "Satkania", "Banshkhali", "Karnaphuli", "Sandwip"]
      },
      {
        name: "Cox's Bazar",
        upazilas: ["Cox's Bazar Sadar", "Ramu", "Chakaria", "Pekua", "Kutubdia", "Maheshkhali", "Ukhia", "Teknaf"]
      },
      {
        name: "Cumilla",
        upazilas: ["Cumilla Sadar", "Sadar South", "Burichang", "Brahmanpara", "Debidwar", "Daudkandi", "Chandina", "Muradnagar", "Titas", "Homna", "Meghna", "Barura", "Chauddagram", "Laksam", "Monohargonj", "Nangalkot", "Lalmai"]
      },
      {
        name: "Feni",
        upazilas: ["Feni Sadar", "Daganbhuiyan", "Chhagalnaiya", "Parshuram", "Fulgazi", "Sonagazi"]
      },
      {
        name: "Brahmanbaria",
        upazilas: ["Brahmanbaria Sadar", "Kasba", "Nasirnagar", "Nabinagar", "Bancharampur", "Sarail", "Ashuganj", "Akhaura", "Bijoynagar"]
      },
      {
        name: "Noakhali",
        upazilas: ["Noakhali Sadar", "Begumganj", "Chatkhil", "Senbagh", "Companiganj", "Hatiya", "Subarnachar", "Kabirhat", "Sonaimuri"]
      },
      {
        name: "Lakshmipur",
        upazilas: ["Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"]
      },
      {
        name: "Chandpur",
        upazilas: ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab North", "Matlab South", "Shahrasti"]
      },
      {
        name: "Bandarban",
        upazilas: ["Bandarban Sadar", "Rowangchhari", "Ruma", "Thanchi", "Lama", "Alikadam", "Naikhongchhari"]
      },
      {
        name: "Rangamati",
        upazilas: ["Rangamati Sadar", "Kaptai", "Kawkhali", "Baghaichhari", "Barkal", "Langadu", "Rajasthali", "Belaichhari", "Juraichhari", "Naniarchar"]
      },
      {
        name: "Khagrachhari",
        upazilas: ["Khagrachhari Sadar", "Dighinala", "Panchhari", "Mahalchhari", "Matiranga", "Manikchhari", "Ramgarh", "Guimara", "Lakshmichhari"]
      }
    ]
  },
  {
    name: "Rajshahi",
    districts: [
      {
        name: "Rajshahi",
        upazilas: ["Boalia", "Rajpara", "Motihar", "Shah Makhdum", "Paba", "Godagari", "Tanore", "Mohanpur", "Bagmara", "Durgapur", "Puthia", "Charghat", "Bagha"]
      },
      {
        name: "Bogura",
        upazilas: ["Bogura Sadar", "Shajahanpur", "Sherpur", "Dhunat", "Sariakandi", "Gabtali", "Sonatala", "Shibganj", "Kahaloo", "Nandigram", "Adamdighi", "Dupchanchia"]
      },
      {
        name: "Pabna",
        upazilas: ["Pabna Sadar", "Ishwardi", "Atgharia", "Chatmohar", "Bhangura", "Faridpur", "Santhia", "Bera", "Sujanagar"]
      },
      {
        name: "Sirajganj",
        upazilas: ["Sirajganj Sadar", "Shahjadpur", "Ullapara", "Belkuchi", "Kamarkhanda", "Raiganj", "Tarash", "Kazipur", "Chauhali"]
      },
      {
        name: "Naogaon",
        upazilas: ["Naogaon Sadar", "Mohadevpur", "Manda", "Niamatpur", "Atrai", "Raninagar", "Patnitala", "Dhamoirhat", "Sapahar", "Porsha", "Badalgachhi"]
      },
      {
        name: "Natore",
        upazilas: ["Natore Sadar", "Singra", "Baraigram", "Gurudaspur", "Lalpur", "Bagatipara", "Naldanga"]
      },
      {
        name: "Chapai Nawabganj",
        upazilas: ["Chapai Nawabganj Sadar", "Shibganj", "Gomastapur", "Nachole", "Bholahat"]
      },
      {
        name: "Joypurhat",
        upazilas: ["Joypurhat Sadar", "Panchbibi", "Kalai", "Khetlal", "Akkelpur"]
      }
    ]
  },
  {
    name: "Khulna",
    districts: [
      {
        name: "Khulna",
        upazilas: ["Khulna Sadar", "Sonadanga", "Khalishpur", "Daulatpur", "Khan Jahan Ali", "Rupsha", "Dighalia", "Terokhada", "Dumuria", "Batiaghata", "Dacope", "Paikgachha", "Koyra", "Phultala"]
      },
      {
        name: "Jashore",
        upazilas: ["Jashore Sadar", "Jhikargachha", "Chaugachha", "Sharsha", "Manirampur", "Keshabpur", "Abhaynagar", "Bagherpara"]
      },
      {
        name: "Kushtia",
        upazilas: ["Kushtia Sadar", "Kumarkhali", "Khoksa", "Mirpur", "Bheramara", "Daulatpur"]
      },
      {
        name: "Satkhira",
        upazilas: ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"]
      },
      {
        name: "Bagerhat",
        upazilas: ["Bagerhat Sadar", "Fakirhat", "Mollahat", "Kachua", "Sarankhola", "Morelganj", "Rampal", "Mongla", "Chitalmari"]
      },
      {
        name: "Jhenaidah",
        upazilas: ["Jhenaidah Sadar", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa", "Harinakunda"]
      },
      {
        name: "Chuadanga",
        upazilas: ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"]
      },
      {
        name: "Meherpur",
        upazilas: ["Meherpur Sadar", "Gangni", "Mujibnagar"]
      },
      {
        name: "Magura",
        upazilas: ["Magura Sadar", "Sreepur", "Mohammadpur", "Shalikha"]
      },
      {
        name: "Narail",
        upazilas: ["Narail Sadar", "Lohagara", "Kalia"]
      }
    ]
  },
  {
    name: "Barishal",
    districts: [
      {
        name: "Barishal",
        upazilas: ["Barishal Sadar", "Bakerganj", "Babuganj", "Wazirpur", "Banaripara", "Gournadi", "Agailjhara", "Mehendiganj", "Muladi", "Hizla"]
      },
      {
        name: "Patuakhali",
        upazilas: ["Patuakhali Sadar", "Dumki", "Mirzaganj", "Bauphal", "Galachipa", "Dashmina", "Kalapara", "Rangabali"]
      },
      {
        name: "Bhola",
        upazilas: ["Bhola Sadar", "Daulatkhan", "Burhanuddin", "Tazumuddin", "Manpura", "Lalmohan", "Char Fasson"]
      },
      {
        name: "Pirojpur",
        upazilas: ["Pirojpur Sadar", "Nesarabad (Swarupkati)", "Kaukhali", "Bhandaria", "Mathbaria", "Nazirpur", "Indurkani"]
      },
      {
        name: "Barguna",
        upazilas: ["Barguna Sadar", "Amtali", "Taltali", "Patharghata", "Betagi", "Bamna"]
      },
      {
        name: "Jhalokathi",
        upazilas: ["Jhalokathi Sadar", "Kathalia", "Nalchity", "Rajapur"]
      }
    ]
  },
  {
    name: "Sylhet",
    districts: [
      {
        name: "Sylhet",
        upazilas: ["Sylhet Sadar", "South Surma", "Beanibazar", "Golapganj", "Zakiganj", "Kanaighat", "Jaintiapur", "Gowainghat", "Companiganj", "Balaganj", "Bishwanath", "Fenchuganj", "Osmani Nagar"]
      },
      {
        name: "Moulvibazar",
        upazilas: ["Moulvibazar Sadar", "Sreemangal", "Kamalganj", "Kulaura", "Rajnagar", "Barlekha", "Juri"]
      },
      {
        name: "Habiganj",
        upazilas: ["Habiganj Sadar", "Madhabpur", "Chunarughat", "Bahubal", "Nabiganj", "Baniachong", "Ajmiriganj", "Lakhai", "Shayestaganj"]
      },
      {
        name: "Sunamganj",
        upazilas: ["Sunamganj Sadar", "South Sunamganj", "Chhatak", "Jagannathpur", "Dowarabazar", "Tahirpur", "Dharampasha", "Jamalganj", "Shalla", "Derai", "Bishwamvarpur"]
      }
    ]
  },
  {
    name: "Rangpur",
    districts: [
      {
        name: "Rangpur",
        upazilas: ["Rangpur Sadar", "Badarganj", "Gangachhara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"]
      },
      {
        name: "Dinajpur",
        upazilas: ["Dinajpur Sadar", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Phulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"]
      },
      {
        name: "Kurigram",
        upazilas: ["Kurigram Sadar", "Nageshwari", "Bhurungamari", "Phulbari", "Rajarhat", "Ulipur", "Chilmari", "Rowmari", "Char Rajibpur"]
      },
      {
        name: "Gaibandha",
        upazilas: ["Gaibandha Sadar", "Sadullapur", "Govindaganj", "Sundarganj", "Saghata", "Palashbari", "Phulchhari"]
      },
      {
        name: "Nilphamari",
        upazilas: ["Nilphamari Sadar", "Saidpur", "Jaldhaka", "Kishoreganj", "Domar", "Dimla"]
      },
      {
        name: "Thakurgaon",
        upazilas: ["Thakurgaon Sadar", "Pirganj", "Ranisankail", "Haripur", "Baliadangi"]
      },
      {
        name: "Panchagarh",
        upazilas: ["Panchagarh Sadar", "Debiganj", "Boda", "Atwari", "Tetulia"]
      },
      {
        name: "Lalmonirhat",
        upazilas: ["Lalmonirhat Sadar", "Aditmari", "Kaliganj", "Hatibandha", "Patgram"]
      }
    ]
  },
  {
    name: "Mymensingh",
    districts: [
      {
        name: "Mymensingh",
        upazilas: ["Mymensingh Sadar", "Muktagachha", "Trishal", "Bhaluka", "Fulbaria", "Gaffargaon", "Gauripur", "Ishwarganj", "Haluaghat", "Dhobaura", "Nandail", "Phulpur", "Tara Khanda"]
      },
      {
        name: "Jamalpur",
        upazilas: ["Jamalpur Sadar", "Melandaha", "Islampur", "Dewanganj", "Sarishabari", "Madarganj", "Bakshiganj"]
      },
      {
        name: "Netrokona",
        upazilas: ["Netrokona Sadar", "Kendua", "Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Madan", "Mohanganj", "Purbadhala", "Khaliajuri"]
      },
      {
        name: "Sherpur",
        upazilas: ["Sherpur Sadar", "Nalitabari", "Nakla", "Jhenaigati", "Sreebardi"]
      }
    ]
  }
];

export function getDeliveryZone(division: string, district: string, upazila: string): 'dhaka_city' | 'other_dhaka' | 'outside_dhaka' {
  if (!division) return 'outside_dhaka';
  
  if (division.toLowerCase() !== 'dhaka') {
    return 'outside_dhaka';
  }

  // Check Dhaka district specifics
  if (district.toLowerCase() === 'dhaka') {
    const dhakaDiv = BANGLADESH_DIVISIONS.find(d => d.name === 'Dhaka');
    const dhakaDist = dhakaDiv?.districts.find(dst => dst.name === 'Dhaka');
    const foundUpazila = dhakaDist?.upazilas.find(u => {
      const name = typeof u === 'string' ? u : u.name;
      return name.toLowerCase() === upazila.toLowerCase();
    });

    if (foundUpazila && typeof foundUpazila !== 'string') {
      if (foundUpazila.isDhakaCity) return 'dhaka_city';
      if (foundUpazila.isOtherDhaka) return 'other_dhaka';
    }
    // Default for Dhaka district if not classified as suburb
    return 'dhaka_city';
  }

  // Adjacent Dhaka division districts (Gazipur, Narayanganj) count as Other Dhaka areas
  if (district.toLowerCase() === 'gazipur' || district.toLowerCase() === 'narayanganj') {
    return 'other_dhaka';
  }

  return 'outside_dhaka';
}
