// Script to initialize default page categories
// Run this script once to populate the database with default categories

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, query, getDocs, orderBy } = require('firebase/firestore');

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

const defaultCategories = [
  {
    name: {
      en: 'Municipality',
      el: 'Δήμος'
    },
    description: {
      en: 'Municipal government and administration pages',
      el: 'Σελίδες δημοτικής διοίκησης'
    },
    icon: 'building',
    color: 'blue',
    isActive: true,
    showInNavbar: true,
    order: 0
  },
  {
    name: {
      en: 'Citizen Services',
      el: 'Υπηρεσίες Πολιτών'
    },
    description: {
      en: 'Services provided to citizens',
      el: 'Υπηρεσίες που παρέχονται στους πολίτες'
    },
    icon: 'users',
    color: 'green',
    isActive: true,
    showInNavbar: true,
    order: 1
  },
  {
    name: {
      en: 'Services',
      el: 'Υπηρεσίες'
    },
    description: {
      en: 'General municipal services',
      el: 'Γενικές δημοτικές υπηρεσίες'
    },
    icon: 'settings',
    color: 'purple',
    isActive: true,
    showInNavbar: true,
    order: 2
  },
  {
    name: {
      en: 'Civil Marriages',
      el: 'Πολιτικοί Γάμοι'
    },
    description: {
      en: 'Civil marriage services and information',
      el: 'Υπηρεσίες και πληροφορίες πολιτικών γάμων'
    },
    icon: 'heart',
    color: 'pink',
    isActive: true,
    showInNavbar: true,
    order: 3
  }
];

async function initializeCategories() {
  try {
    console.log('Checking for existing categories...');
    
    // Check if categories already exist
    const existingCategoriesQuery = query(collection(db, 'pageCategories'), orderBy('order', 'asc'));
    const existingSnapshot = await getDocs(existingCategoriesQuery);
    
    if (!existingSnapshot.empty) {
      console.log('Categories already exist. Skipping initialization.');
      existingSnapshot.docs.forEach(doc => {
        console.log(`- ${doc.data().name.en} (${doc.id})`);
      });
      return;
    }

    console.log('No existing categories found. Creating default categories...');
    
    // Add default categories
    for (const category of defaultCategories) {
      const docRef = await addDoc(collection(db, 'pageCategories'), category);
      console.log(`Created category: ${category.name.en} (${docRef.id})`);
    }
    
    console.log('✅ Default categories initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing categories:', error);
  }
}

// Run the initialization
initializeCategories()
  .then(() => {
    console.log('Script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 