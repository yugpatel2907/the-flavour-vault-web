export interface MenuItem {
  id: string;
  name: string;
  category: 'biryani' | 'bucket' | 'starters-nonveg' | 'starters-veg' | 'curries-nonveg' | 'curries-veg' | 'rotis' | 'kebabs-nonveg' | 'kebabs-veg' | 'tandoori' | 'chinese';
  price: number;
  isVeg: boolean | null;
  spicyLevel?: 1 | 2 | 3;
  description?: string;
  spiceModelType?: 'star-anise' | 'clove' | 'cardamom' | 'chilli' | 'ember' | 'pot';
}

export const menuCategories = [
  { id: 'all', label: 'ALL DISHES' },
  { id: 'biryani', label: 'AUTHENTIC BIRYANI' },
  { id: 'bucket', label: 'BUCKET BIRYANI (5 SERVE)' },
  { id: 'starters-nonveg', label: 'NON-VEG STARTERS' },
  { id: 'starters-veg', label: 'VEG STARTERS' },
  { id: 'curries-nonveg', label: 'NON-VEG CURRIES' },
  { id: 'curries-veg', label: 'VEG CURRIES' },
  { id: 'rotis', label: 'INDIAN ROTIS & NAAN' },
  { id: 'kebabs-nonveg', label: 'NON-VEG KEBABS' },
  { id: 'kebabs-veg', label: 'VEG KEBABS' },
  { id: 'tandoori', label: 'TANDOORI / GRILL' },
  { id: 'chinese', label: 'CHINESE SPECIALTIES' },
] as const;

export const ambrociaMenu: MenuItem[] = [
  // --- AUTHENTIC BIRYANI ---
  { id: 'b1', name: 'Veg Biryani', category: 'biryani', price: 160, isVeg: true, spicyLevel: 1, description: 'Fragrant basmati rice layered with garden fresh vegetables & saffron.' },
  { id: 'b2', name: 'Egg Biryani', category: 'biryani', price: 160, isVeg: false, spicyLevel: 2, description: 'Boiled eggs cooked in rich Hyderabadi biryani masala.' },
  { id: 'b3', name: 'Chicken Biryani', category: 'biryani', price: 220, isVeg: false, spicyLevel: 2, description: 'Classic Hyderabadi dum chicken biryani with mirchi ka salan.' },
  { id: 'b4', name: 'Chicken Boneless Biryani', category: 'biryani', price: 300, isVeg: false, spicyLevel: 2, description: 'Tender boneless chicken pieces infused with star anise and spices.' },
  { id: 'b5', name: 'Chicken Biryani Hundi', category: 'biryani', price: 430, isVeg: false, spicyLevel: 2, description: 'Clay handi cooked biryani with aromatic saffron & fried onions.' },
  { id: 'b6', name: 'Chicken Family Pack', category: 'biryani', price: 660, isVeg: false, spicyLevel: 2, description: 'Large family portion chicken biryani served with raita and salan.' },
  { id: 'b7', name: 'Mutton Biryani', category: 'biryani', price: 390, isVeg: false, spicyLevel: 3, description: 'Slow-cooked tender mutton marinated in mint and Hyderabadi spices.' },
  { id: 'b8', name: 'Prawns Biryani', category: 'biryani', price: 330, isVeg: false, spicyLevel: 2, description: 'Succulent coastal prawns tossed with ginger, garlic and fragrant spices.' },
  { id: 'b9', name: 'Fish Biryani', category: 'biryani', price: 330, isVeg: false, spicyLevel: 2, description: 'Fresh fish fillets spiced with carom seeds in saffron basmati rice.' },
  { id: 'b10', name: 'Lollipop Biryani', category: 'biryani', price: 320, isVeg: false, spicyLevel: 2, description: 'Crispy fried chicken lollipops over aromatic ghee biryani rice.' },
  { id: 'b11', name: 'Tandoori Biryani', category: 'biryani', price: 320, isVeg: false, spicyLevel: 3, description: 'Smoky charcoal tandoori chicken cooked dum style with basmati rice.' },
  { id: 'b12', name: "Ambrosia's Nawabi Spl (Family Pack)", category: 'biryani', price: 830, isVeg: false, spicyLevel: 3, description: "Royal grand biryani with mutton, chicken & spiced egg family pack." },
  { id: 'b13', name: 'Plain Biryani Rice', category: 'biryani', price: 150, isVeg: true, spicyLevel: 1, description: 'Aromatic saffron basmati biryani rice.' },
  { id: 'b14', name: 'Ulavacharu Biryani', category: 'biryani', price: 340, isVeg: false, spicyLevel: 2, description: 'Traditional horsegram soup reduction blended with rich biryani spices.' },
  { id: 'b15', name: 'Fry Piece Biryani', category: 'biryani', price: 300, isVeg: false, spicyLevel: 3, description: 'Crispy fried marinated chicken pieces over aromatic ghee rice.' },
  { id: 'b16', name: 'Chicken Tikka Biryani', category: 'biryani', price: 330, isVeg: false, spicyLevel: 2, description: 'Charcoal-grilled chicken tikka layered with rich spiced basmati rice.' },
  { id: 'b17', name: 'Gongura Chicken Biryani', category: 'biryani', price: 330, isVeg: false, spicyLevel: 3, description: 'Authentic Andhra style tanginess infused with gongura leaves and chicken.' },
  { id: 'b18', name: 'Kaju Biryani', category: 'biryani', price: 220, isVeg: true, spicyLevel: 1, description: 'Golden roasted cashews tossed with cardamom, clove, and saffron basmati rice.' },
  { id: 'b19', name: 'Paneer Biryani', category: 'biryani', price: 205, isVeg: true, spicyLevel: 1, description: 'Soft cottage cheese cubes marinated in aromatic spices and mint basmati rice.' },
  { id: 'b20', name: 'Mushroom Biryani', category: 'biryani', price: 205, isVeg: true, spicyLevel: 1, description: 'Fresh button mushrooms sautéed in royal Hyderabadi spice blend.' },

  // --- BUCKET BIRYANI (5 SERVE) ---
  { id: 'bb1', name: 'Bucket Chicken Biryani (5 Serve)', category: 'bucket', price: 999, isVeg: false, spicyLevel: 2, description: 'Generous 5-portion bucket of authentic Hyderabadi chicken biryani with boiled eggs & raita.' },
  { id: 'bb2', name: 'Bucket Boneless Chicken Biryani (5 Serve)', category: 'bucket', price: 1400, isVeg: false, spicyLevel: 2, description: 'Feast bucket loaded with juicy boneless chicken biryani and extra salan.' },
  { id: 'bb3', name: 'Bucket Fry Piece Chicken Biryani (5 Serve)', category: 'bucket', price: 1380, isVeg: false, spicyLevel: 3, description: 'Spiced crispy fried chicken pieces over family size biryani rice bucket.' },
  { id: 'bb4', name: 'Bucket Mutton Biryani (5 Serve)', category: 'bucket', price: 1820, isVeg: false, spicyLevel: 3, description: 'Grand royal mutton biryani bucket slow cooked over charcoal wood fires.' },

  // --- NON-VEG STARTERS ---
  { id: 'ns1', name: 'Chicken 65', category: 'starters-nonveg', price: 220, isVeg: false, spicyLevel: 3, description: 'Iconic spicy red fried chicken tossed with curry leaves and green chillies.' },
  { id: 'ns2', name: 'Chilly Chicken', category: 'starters-nonveg', price: 235, isVeg: false, spicyLevel: 2, description: 'Indo-Chinese style chicken with bell peppers and green chillies.' },
  { id: 'ns3', name: 'Chicken Manchuria', category: 'starters-nonveg', price: 235, isVeg: false, spicyLevel: 2, description: 'Crispy chicken bites tossed in garlic soya sauce.' },
  { id: 'ns4', name: 'Chicken Majestic', category: 'starters-nonveg', price: 280, isVeg: false, spicyLevel: 2, description: 'Tender chicken strips coated in yogurt, mint, garlic, and green chilli glaze.' },
  { id: 'ns5', name: 'Andhra Chicken Fry', category: 'starters-nonveg', price: 240, isVeg: false, spicyLevel: 3, description: 'Fiery roasted chicken sautéed with crushed black pepper and onions.' },
  { id: 'ns6', name: 'Chicken Roast (Full)', category: 'starters-nonveg', price: 430, isVeg: false, spicyLevel: 3, description: 'Slow-roasted spicy chicken with dry onion masala.' },
  { id: 'ns7', name: 'Chicken Lollipop (Dry / Sauce)', category: 'starters-nonveg', price: 260, isVeg: false, spicyLevel: 2, description: 'Crispy chicken lollipops served with tangy dipping sauce.' },
  { id: 'ns8', name: 'Dragon Chicken', category: 'starters-nonveg', price: 280, isVeg: false, spicyLevel: 2, description: 'Indo-Chinese style crispy chicken strips with cashews and dried red peppers.' },
  { id: 'ns9', name: 'Mutton Fry / Pepper Fry', category: 'starters-nonveg', price: 300, isVeg: false, spicyLevel: 3, description: 'Tender mutton pieces tossed with crushed black pepper and curry leaves.' },
  { id: 'ns10', name: 'Prawns Fry / Manchuria', category: 'starters-nonveg', price: 315, isVeg: false, spicyLevel: 2, description: 'Fresh prawns tossed in spicy Manchurian sauce.' },
  { id: 'ns11', name: 'Loose Prawns / Chilli Prawns', category: 'starters-nonveg', price: 315, isVeg: false, spicyLevel: 3, description: 'Golden fried prawns tossed with capsicum, garlic, and red chilli pepper.' },
  { id: 'ns12', name: 'Prawns 65', category: 'starters-nonveg', price: 310, isVeg: false, spicyLevel: 3, description: 'Crispy fried prawns in 65 spicy glaze.' },
  { id: 'ns13', name: 'Fish Fry', category: 'starters-nonveg', price: 275, isVeg: false, spicyLevel: 2, description: 'Tawa pan fried spiced fish fillets.' },
  { id: 'ns14', name: 'Apollo Fish', category: 'starters-nonveg', price: 355, isVeg: false, spicyLevel: 2, description: 'Hyderabadi style crispy fish coated in tangy yogurt and curry leaf temper.' },
  { id: 'ns15', name: 'Chilli Fish', category: 'starters-nonveg', price: 300, isVeg: false, spicyLevel: 2, description: 'Crispy fish cooked with soya chilli capsicum sauce.' },
  { id: 'ns16', name: 'Pepper Chicken (Dry / Sauce)', category: 'starters-nonveg', price: 195, isVeg: false, spicyLevel: 3, description: 'Pepper roasted chicken coated in aromatic gravy.' },
  { id: 'ns17', name: 'Chicken 555', category: 'starters-nonveg', price: 275, isVeg: false, spicyLevel: 2, description: 'Batter fried chicken tossed in sweet spicy chilli garlic sauce.' },
  { id: 'ns18', name: 'Lemon Chicken', category: 'starters-nonveg', price: 275, isVeg: false, spicyLevel: 1, description: 'Tangy lemon-infused stir fried chicken.' },
  { id: 'ns19', name: 'Chicken Pakoda', category: 'starters-nonveg', price: 195, isVeg: false, spicyLevel: 2, description: 'Crispy gram-flour spiced chicken fritters.' },
  { id: 'ns20', name: 'Chilli Egg', category: 'starters-nonveg', price: 140, isVeg: false, spicyLevel: 2, description: 'Boiled egg slices tossed in chilli garlic pepper sauce.' },
  { id: 'ns21', name: 'Crispy Honey Chicken', category: 'starters-nonveg', price: 285, isVeg: false, spicyLevel: 1, description: 'Crispy chicken strips glazed with honey and sesame seeds.' },
  { id: 'ns22', name: 'Crab Lollipop / Fish Finger', category: 'starters-nonveg', price: 310, isVeg: false, spicyLevel: 2, description: 'Golden fried seafood lollipops served with tartar sauce.' },

  // --- VEG STARTERS ---
  { id: 'vs1', name: 'Gobi 65 / Aloo 65', category: 'starters-veg', price: 175, isVeg: true, spicyLevel: 2, description: 'Crispy cauliflower or potato tossed in 65 temper.' },
  { id: 'vs2', name: 'Paneer 65 / Mushroom 65', category: 'starters-veg', price: 205, isVeg: true, spicyLevel: 2, description: 'Cottage cheese or mushroom fried in spicy yogurt glaze.' },
  { id: 'vs3', name: 'Veg Manchuria / Gobi Manchuria', category: 'starters-veg', price: 195, isVeg: true, spicyLevel: 2, description: 'Vegetable or Gobi dumplings in ginger garlic soy sauce.' },
  { id: 'vs4', name: 'Mushroom / Paneer Manchuria', category: 'starters-veg', price: 210, isVeg: true, spicyLevel: 2, description: 'Mushroom or Paneer tossed in savory Manchurian sauce.' },
  { id: 'vs5', name: 'Chilli / Paneer Mushroom', category: 'starters-veg', price: 210, isVeg: true, spicyLevel: 2, description: 'Paneer & Mushroom tossed with capsicum and red chillies.' },
  { id: 'vs6', name: 'Crispy Corn', category: 'starters-veg', price: 185, isVeg: true, spicyLevel: 2, description: 'Golden sweetcorn kernels fried crispy and tossed with pepper and lemon juice.' },
  { id: 'vs7', name: 'Baby Corn Manchuria', category: 'starters-veg', price: 185, isVeg: true, spicyLevel: 2, description: 'Crispy baby corn tossed in soy chilli sauce.' },
  { id: 'vs8', name: 'Chilli Potato', category: 'starters-veg', price: 190, isVeg: true, spicyLevel: 2, description: 'Fried potato fingers in spicy chilli garlic sauce.' },
  { id: 'vs9', name: 'Paneer / Mushroom Popcorn', category: 'starters-veg', price: 215, isVeg: true, spicyLevel: 1, description: 'Bite-sized crunchy paneer popcorn with dip.' },

  // --- NON-VEG CURRIES ---
  { id: 'nc1', name: 'Egg Burji / Curry', category: 'curries-nonveg', price: 115, isVeg: false, spicyLevel: 2, description: 'Spiced scrambled eggs or boiled egg curry.' },
  { id: 'nc2', name: 'Chicken / Mutton Moghlai', category: 'curries-nonveg', price: 255, isVeg: false, spicyLevel: 2, description: 'Rich egg-infused Mughlai cashew gravy.' },
  { id: 'nc3', name: 'Chicken / Mutton Afghani', category: 'curries-nonveg', price: 255, isVeg: false, spicyLevel: 1, description: 'Creamy yogurt, poppy seed, and black pepper gravy.' },
  { id: 'nc4', name: 'Fish Curry', category: 'curries-nonveg', price: 255, isVeg: false, spicyLevel: 2, description: 'Traditional coastal fish curry in tangy tamarind tomato sauce.' },
  { id: 'nc5', name: 'Prawn Masala', category: 'curries-nonveg', price: 265, isVeg: false, spicyLevel: 2, description: 'Prawns cooked in onion tomato spicy thick gravy.' },
  { id: 'nc6', name: 'Chicken Tikka Masala', category: 'curries-nonveg', price: 275, isVeg: false, spicyLevel: 2, description: 'Grilled chicken tikka in spiced tomato cream sauce.' },
  { id: 'nc7', name: 'Chicken Masala', category: 'curries-nonveg', price: 205, isVeg: false, spicyLevel: 2, description: 'Classic North Indian home style chicken curry.' },
  { id: 'nc8', name: 'Dum-Ka-Chicken', category: 'curries-nonveg', price: 225, isVeg: false, spicyLevel: 2, description: 'Slow-cooked Hyderabadi chicken with fried onions & cream.' },
  { id: 'nc9', name: 'Chicken Chatpata', category: 'curries-nonveg', price: 220, isVeg: false, spicyLevel: 3, description: 'Tangy and spicy chicken curry with raw spices.' },
  { id: 'nc10', name: 'Ginger Chicken / Kadai Chicken', category: 'curries-nonveg', price: 230, isVeg: false, spicyLevel: 2, description: 'Kadai cooked chicken with bell peppers & ginger.' },
  { id: 'nc11', name: 'Butter Chicken Masala', category: 'curries-nonveg', price: 255, isVeg: false, spicyLevel: 1, description: 'Tandoori chicken in a silky, buttery tomato, cashew & fenugreek gravy.' },
  { id: 'nc12', name: 'Hyderabadi Chicken', category: 'curries-nonveg', price: 235, isVeg: false, spicyLevel: 3, description: 'Rich dark onion and poppy seed gravy cooked with aromatic Hyderabadi spices.' },
  { id: 'nc13', name: "Ambrosia's Spl Chicken", category: 'curries-nonveg', price: 255, isVeg: false, spicyLevel: 3, description: "Chef's signature spicy egg-topped chicken gravy." },
  { id: 'nc14', name: 'Mutton Masala / Curry', category: 'curries-nonveg', price: 295, isVeg: false, spicyLevel: 3, description: 'Tender mutton cooked in traditional slow-simmered onion tomato gravy.' },
  { id: 'nc15', name: 'Mutton Chatpata', category: 'curries-nonveg', price: 300, isVeg: false, spicyLevel: 3, description: 'Tangy spiced mutton curry.' },
  { id: 'nc16', name: 'Ginger Mutton / Kadai Mutton', category: 'curries-nonveg', price: 300, isVeg: false, spicyLevel: 3, description: 'Fresh mutton tossed in kadhai spice mix.' },

  // --- VEG CURRIES ---
  { id: 'vc1', name: 'Dal Fry / Dal Tadka', category: 'curries-veg', price: 160, isVeg: true, spicyLevel: 1, description: 'Yellow lentils tempered with cumin, garlic, ghee, and fresh coriander.' },
  { id: 'vc2', name: 'Aloo Masala / Aloo Gobi Masala', category: 'curries-veg', price: 170, isVeg: true, spicyLevel: 1, description: 'Potatoes and cauliflower simmered with cumin and turmeric.' },
  { id: 'vc3', name: 'Veg Chatpata', category: 'curries-veg', price: 180, isVeg: true, spicyLevel: 2, description: 'Tangy mixed vegetable gravy.' },
  { id: 'vc4', name: 'Mixed Veg Curry', category: 'curries-veg', price: 195, isVeg: true, spicyLevel: 1, description: 'Garden vegetables in onion tomato curry.' },
  { id: 'vc5', name: 'Paneer Butter Masala', category: 'curries-veg', price: 210, isVeg: true, spicyLevel: 1, description: 'Rich cottage cheese cubes cooked in lush cream tomato gravy.' },
  { id: 'vc6', name: 'Paneer Pasanda', category: 'curries-veg', price: 215, isVeg: true, spicyLevel: 1, description: 'Stuffed paneer triangles in smooth cashew gravy.' },
  { id: 'vc7', name: 'Mushroom Masala', category: 'curries-veg', price: 210, isVeg: true, spicyLevel: 1, description: 'Fresh mushrooms in thick spiced masala.' },
  { id: 'vc8', name: 'Kadai Mushroom / Paneer', category: 'curries-veg', price: 215, isVeg: true, spicyLevel: 2, description: 'Paneer or Mushroom tossed with bell peppers & coriander seeds.' },
  { id: 'vc9', name: "Ambrosia's Spl Veg", category: 'curries-veg', price: 240, isVeg: true, spicyLevel: 1, description: 'Chef special veg combination in rich saffron gravy.' },
  { id: 'vc10', name: 'Kaju Masala', category: 'curries-veg', price: 250, isVeg: true, spicyLevel: 1, description: 'Golden roasted whole cashews in spicy tomato onion gravy.' },
  { id: 'vc11', name: 'Kaju Tomato', category: 'curries-veg', price: 250, isVeg: true, spicyLevel: 1, description: 'Cashews simmered in tangy tomato curry.' },
  { id: 'vc12', name: 'Kaju Paneer', category: 'curries-veg', price: 255, isVeg: true, spicyLevel: 1, description: 'Whole cashews and paneer in a rich royal creamy cashew gravy.' },
  { id: 'vc13', name: 'Baby Corn Masala', category: 'curries-veg', price: 200, isVeg: true, spicyLevel: 1, description: 'Tender baby corn in aromatic gravy.' },

  // --- INDIAN ROTIS & NAAN ---
  { id: 'r1', name: 'Tandoori Roti', category: 'rotis', price: 30, isVeg: true, spicyLevel: 1, description: 'Whole wheat flatbread baked in clay tandoor.' },
  { id: 'r2', name: 'Butter Roti', category: 'rotis', price: 35, isVeg: true, spicyLevel: 1, description: 'Tandoori roti topped with butter.' },
  { id: 'r3', name: 'Plain Naan', category: 'rotis', price: 40, isVeg: true, spicyLevel: 1, description: 'Leavened soft flatbread.' },
  { id: 'r4', name: 'Butter Naan', category: 'rotis', price: 45, isVeg: true, spicyLevel: 1, description: 'Soft tandoori naan brushed with butter.' },
  { id: 'r5', name: 'Garlic Butter Naan', category: 'rotis', price: 60, isVeg: true, spicyLevel: 1, description: 'Tandoor baked flatbread topped with minced garlic and melted ghee.' },

  // --- NON-VEG KEBABS ---
  { id: 'nk1', name: 'Murgh-Malai Kebab', category: 'kebabs-nonveg', price: 245, isVeg: false, spicyLevel: 1, description: 'Melt-in-mouth chicken marinated in cream, cheese, cardamom and white pepper.' },
  { id: 'nk2', name: 'Chicken Tikka Kebab', category: 'kebabs-nonveg', price: 240, isVeg: false, spicyLevel: 2, description: 'Clay-oven charred chicken cubes in Kashmiri chilli and yogurt marinade.' },
  { id: 'nk3', name: 'Reshmi Kebab', category: 'kebabs-nonveg', price: 255, isVeg: false, spicyLevel: 1, description: 'Silky minced chicken skewers seasoned with mace, nutmeg, and fresh herbs.' },
  { id: 'nk4', name: 'Tangri Kebab (Half / Full)', category: 'kebabs-nonveg', price: 200, isVeg: false, spicyLevel: 2, description: 'Juicy chicken drumsticks marinated in aromatic spices.' },
  { id: 'nk5', name: 'Chicken Afghani Tikka', category: 'kebabs-nonveg', price: 255, isVeg: false, spicyLevel: 1, description: 'Rich cashew and yogurt marinated chicken tikka.' },

  // --- VEG KEBABS ---
  { id: 'vk1', name: 'Veg Seekh Kebab', category: 'kebabs-veg', price: 230, isVeg: true, spicyLevel: 1, description: 'Minced vegetable skewers grilled with tandoori spices.' },
  { id: 'vk2', name: 'Paneer Tikka Kebab', category: 'kebabs-veg', price: 240, isVeg: true, spicyLevel: 2, description: 'Cottage cheese, bell peppers & onions roasted on skewers with tandoori spices.' },
  { id: 'vk3', name: 'Mushroom Tikka Kebab', category: 'kebabs-veg', price: 250, isVeg: true, spicyLevel: 2, description: 'Button mushrooms marinated in tandoori spices and grilled.' },

  // --- TANDOORI / GRILL ---
  { id: 'tg1', name: 'Tandoori Chicken Full', category: 'tandoori', price: 440, isVeg: false, spicyLevel: 2, description: 'Whole chicken marinated in traditional tandoori spices, slow roasted in clay oven.' },
  { id: 'tg2', name: 'Tandoori Chicken Half', category: 'tandoori', price: 220, isVeg: false, spicyLevel: 2, description: 'Half tandoori chicken roasted to perfection.' },
  { id: 'tg3', name: 'Grill Chicken Full', category: 'tandoori', price: 450, isVeg: false, spicyLevel: 2, description: 'Charcoal flame grilled chicken brushed with melted butter and chaat masala.' },
  { id: 'tg4', name: 'Grill Chicken Half', category: 'tandoori', price: 230, isVeg: false, spicyLevel: 2, description: 'Half charcoal flame grilled chicken.' },

  // --- CHINESE SPECIALTIES ---
  { id: 'c1', name: 'Veg Noodles / Egg Noodles', category: 'chinese', price: 145, isVeg: null, spicyLevel: 1, description: 'Wok tossed noodles with fresh veggies or egg.' },
  { id: 'c2', name: 'Schezwan Veg / Egg Noodles', category: 'chinese', price: 155, isVeg: null, spicyLevel: 3, description: 'Spicy Schezwan sauce tossed noodles.' },
  { id: 'c3', name: 'Veg Fried Rice / Egg Fried Rice', category: 'chinese', price: 145, isVeg: null, spicyLevel: 1, description: 'Classic wok-fried rice.' },
  { id: 'c4', name: 'Schezwan Veg / Egg Fried Rice', category: 'chinese', price: 155, isVeg: null, spicyLevel: 3, description: 'Fiery Schezwan fried rice.' },
  { id: 'c5', name: 'Chicken Noodles', category: 'chinese', price: 175, isVeg: false, spicyLevel: 1, description: 'Stir fried noodles with shredded chicken.' },
  { id: 'c6', name: 'Schezwan Chicken Noodles', category: 'chinese', price: 185, isVeg: false, spicyLevel: 3, description: 'Wok tossed noodles with shredded chicken and fiery red Schezwan sauce.' },
  { id: 'c7', name: 'Chicken Fried Rice', category: 'chinese', price: 175, isVeg: false, spicyLevel: 1, description: 'Classic wok-fried rice with egg, tender chicken, and vegetables.' },
  { id: 'c8', name: 'Schezwan Chicken Fried Rice', category: 'chinese', price: 185, isVeg: false, spicyLevel: 3, description: 'Spicy Schezwan fried rice with chicken.' },
  { id: 'c9', name: 'Paneer Fried Rice', category: 'chinese', price: 175, isVeg: true, spicyLevel: 1, description: 'Wok-fried rice with cottage cheese cubes.' },
  { id: 'c10', name: 'Gobi Fried Rice', category: 'chinese', price: 175, isVeg: true, spicyLevel: 1, description: 'Crispy cauliflower tossed fried rice.' },
  { id: 'c11', name: 'Mushroom Fried Rice', category: 'chinese', price: 175, isVeg: true, spicyLevel: 1, description: 'Button mushrooms stir fried with rice.' },
  { id: 'c12', name: 'Curd Rice', category: 'chinese', price: 135, isVeg: true, spicyLevel: 1, description: 'Traditional refreshing curd rice with mustard tempering.' },
  { id: 'c13', name: 'Zeera Rice', category: 'chinese', price: 120, isVeg: true, spicyLevel: 1, description: 'Fragrant basmati rice tossed with roasted cumin seeds.' },
];
