// Script to bulk insert Greek municipality categories and subcategories
// Based on the Greek municipality navigation structure

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where } = require('firebase/firestore');

// Your Firebase config (you'll need to add this)
const firebaseConfig = {
  // Add your Firebase config here
  // apiKey: "your-api-key",
  // authDomain: "your-auth-domain",
  // projectId: "your-project-id",
  // storageBucket: "your-storage-bucket",
  // messagingSenderId: "your-messaging-sender-id",
  // appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Greek Municipality Categories Structure
const categoryStructure = [
  {
    // Main Category 1: Municipality
    name: { en: 'Municipality', el: 'Δήμος' },
    description: { en: 'Municipal government and administration', el: 'Δημοτική διοίκηση και διακυβέρνηση' },
    icon: 'building',
    color: 'blue',
    isActive: true,
    showInNavbar: true,
    slug: 'municipality',
    subcategories: [
      {
        name: { en: 'Vision & Mission', el: 'Όραμα & Αποστολή' },
        description: { en: 'Our vision and mission statement', el: 'Το όραμα και η αποστολή μας' },
        icon: 'eye',
        color: 'blue',
        slug: 'vision-mission'
      },
      {
        name: { en: 'Mayor', el: 'Δήμαρχος' },
        description: { en: 'Information about the Mayor', el: 'Πληροφορίες για τον Δήμαρχο' },
        icon: 'user',
        color: 'blue',
        slug: 'mayor'
      },
      {
        name: { en: 'Administration', el: 'Διοίκηση' },
        description: { en: 'Municipal administration structure', el: 'Δομή δημοτικής διοίκησης' },
        icon: 'users',
        color: 'blue',
        slug: 'administration'
      },
      {
        name: { en: 'Municipal Council', el: 'Δημοτικό Συμβούλιο' },
        description: { en: 'Municipal council members and meetings', el: 'Μέλη και συνεδριάσεις δημοτικού συμβουλίου' },
        icon: 'users',
        color: 'blue',
        slug: 'municipal-council'
      },
      {
        name: { en: 'Municipal Committees', el: 'Δημοτικές Επιτροπές' },
        description: { en: 'Various municipal committees', el: 'Διάφορες δημοτικές επιτροπές' },
        icon: 'users',
        color: 'blue',
        slug: 'municipal-committees'
      },
      {
        name: { en: 'Decisions', el: 'Αποφάσεις' },
        description: { en: 'Municipal decisions and resolutions', el: 'Δημοτικές αποφάσεις και ψηφίσματα' },
        icon: 'file-text',
        color: 'blue',
        slug: 'decisions'
      }
    ]
  },
  {
    // Main Category 2: Services
    name: { en: 'Services', el: 'Υπηρεσίες' },
    description: { en: 'Municipal services and departments', el: 'Δημοτικές υπηρεσίες και τμήματα' },
    icon: 'settings',
    color: 'green',
    isActive: true,
    showInNavbar: true,
    slug: 'services',
    subcategories: [
      {
        name: { en: 'Structure', el: 'Δομή' },
        description: { en: 'Organizational structure of services', el: 'Οργανωτική δομή υπηρεσιών' },
        icon: 'organization',
        color: 'green',
        slug: 'structure'
      },
      {
        name: { en: 'Social Programs', el: 'Κοινωνικά Προγράμματα' },
        description: { en: 'Community and social programs', el: 'Κοινοτικά και κοινωνικά προγράμματα' },
        icon: 'heart',
        color: 'green',
        slug: 'social-programs'
      }
    ]
  },
  {
    // Main Category 3: Culture
    name: { en: 'Culture', el: 'Πολιτισμός' },
    description: { en: 'Cultural activities and events', el: 'Πολιτιστικές δραστηριότητες και εκδηλώσεις' },
    icon: 'palette',
    color: 'purple',
    isActive: true,
    showInNavbar: true,
    slug: 'culture',
    subcategories: []
  },
  {
    // Main Category 4: Citizen Services
    name: { en: 'Citizen Services', el: 'Εξυπηρέτηση Πολιτών' },
    description: { en: 'Services for citizens', el: 'Υπηρεσίες για τους πολίτες' },
    icon: 'users',
    color: 'orange',
    isActive: true,
    showInNavbar: true,
    slug: 'citizen-services',
    subcategories: [
      {
        name: { en: 'Service Office', el: 'Γραφείο Εξυπηρέτησης' },
        description: { en: 'Citizen service office information', el: 'Πληροφορίες γραφείου εξυπηρέτησης πολιτών' },
        icon: 'info',
        color: 'orange',
        slug: 'service-office'
      },
      {
        name: { en: 'Complaints', el: 'Παράπονα' },
        description: { en: 'Submit complaints and feedback', el: 'Υποβολή παραπόνων και σχολίων' },
        icon: 'message-square',
        color: 'orange',
        slug: 'complaints'
      },
      {
        name: { en: 'Forms & Applications', el: 'Έντυπα / Αιτήσεις' },
        description: { en: 'Download forms and submit applications', el: 'Λήψη εντύπων και υποβολή αιτήσεων' },
        icon: 'file-text',
        color: 'orange',
        slug: 'forms-applications'
      },
      {
        name: { en: 'Online Payments', el: 'Διαδικτυακές Πληρωμές' },
        description: { en: 'e-payments and online payment services', el: 'Ηλεκτρονικές πληρωμές και διαδικτυακές υπηρεσίες πληρωμής' },
        icon: 'credit-card',
        color: 'orange',
        slug: 'online-payments'
      },
      {
        name: { en: 'Offers', el: 'Προσφορές' },
        description: { en: 'Current offers and announcements', el: 'Τρέχουσες προσφορές και ανακοινώσεις' },
        icon: 'tag',
        color: 'orange',
        slug: 'offers'
      },
      {
        name: { en: 'Community Leaders', el: 'Κοινοτάρχες' },
        description: { en: 'Information about community leaders', el: 'Πληροφορίες για κοινοτάρχες' },
        icon: 'crown',
        color: 'orange',
        slug: 'community-leaders'
      }
    ]
  },
  {
    // Main Category 5: Civil Marriages
    name: { en: 'Civil Marriages', el: 'Πολιτικοί Γάμοι' },
    description: { en: 'Civil marriage services and information', el: 'Υπηρεσίες και πληροφορίες πολιτικών γάμων' },
    icon: 'heart',
    color: 'pink',
    isActive: true,
    showInNavbar: true,
    slug: 'civil-marriages',
    subcategories: []
  },
  {
    // Main Category 6: Contact
    name: { en: 'Contact', el: 'Επικοινωνία' },
    description: { en: 'Contact information and communication', el: 'Στοιχεία επικοινωνίας και επικοινωνία' },
    icon: 'phone',
    color: 'gray',
    isActive: true,
    showInNavbar: true,
    slug: 'contact',
    subcategories: []
  }
];

async function checkCategoryExists(slug) {
  try {
    const q = query(collection(db, 'pageCategories'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking category existence:', error);
    return false;
  }
}

async function insertCategories() {
  try {
    console.log('🚀 Starting bulk insertion of Greek municipality categories...\n');
    
    let mainCategoriesCreated = 0;
    let subcategoriesCreated = 0;
    let skipped = 0;
    
    for (const categoryData of categoryStructure) {
      const { subcategories, ...mainCategoryData } = categoryData;
      
      console.log(`📂 Processing main category: ${mainCategoryData.name.en} (${mainCategoryData.name.el})`);
      
      // Check if main category already exists
      const exists = await checkCategoryExists(mainCategoryData.slug);
      if (exists) {
        console.log(`  ⏭️  Main category already exists, skipping...`);
        skipped++;
      } else {
        // Create main category
        const mainCategoryRef = await addDoc(collection(db, 'pageCategories'), mainCategoryData);
        console.log(`  ✅ Created main category with ID: ${mainCategoryRef.id}`);
        mainCategoriesCreated++;
        
        // Create subcategories
        if (subcategories && subcategories.length > 0) {
          console.log(`  📋 Creating ${subcategories.length} subcategories...`);
          
          for (const subcategoryData of subcategories) {
            const subcategoryWithParent = {
              ...subcategoryData,
              parentCategory: mainCategoryRef.id,
              isActive: true,
              showInNavbar: false // Subcategories typically don't show in main navbar
            };
            
            const subcatExists = await checkCategoryExists(subcategoryData.slug);
            if (subcatExists) {
              console.log(`    ⏭️  Subcategory ${subcategoryData.name.en} already exists, skipping...`);
              skipped++;
            } else {
              const subcategoryRef = await addDoc(collection(db, 'pageCategories'), subcategoryWithParent);
              console.log(`    ✅ Created subcategory: ${subcategoryData.name.en} (${subcategoryData.name.el}) - ID: ${subcategoryRef.id}`);
              subcategoriesCreated++;
            }
          }
        }
      }
      
      console.log(''); // Empty line for readability
    }
    
    console.log('🎉 Bulk insertion completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`  - Main categories created: ${mainCategoriesCreated}`);
    console.log(`  - Subcategories created: ${subcategoriesCreated}`);
    console.log(`  - Items skipped (already exist): ${skipped}`);
    console.log(`  - Total items processed: ${mainCategoriesCreated + subcategoriesCreated + skipped}`);
    
    if (mainCategoriesCreated > 0 || subcategoriesCreated > 0) {
      console.log('\n💡 Next steps:');
      console.log('1. Restart your Next.js development server');
      console.log('2. Check the navbar - categories should now appear');
      console.log('3. Go to Admin > Categories to manage and create pages for these categories');
      console.log('4. Run the navbar categories migration if needed: node scripts/migrate-categories-navbar.js');
    }
    
  } catch (error) {
    console.error('❌ Error during bulk insertion:', error);
  }
}

// Run the insertion
insertCategories()
  .then(() => {
    console.log('\n✨ Script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
