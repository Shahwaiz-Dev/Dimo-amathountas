// Migration script to add showInNavbar property to existing categories
// This script will update all existing categories to show in navbar by default

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');

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

async function migrateCategoriesForNavbar() {
  try {
    console.log('🔄 Starting migration: Adding showInNavbar property to existing categories...');
    
    // Get all existing categories
    const snapshot = await getDocs(collection(db, 'pageCategories'));
    
    if (snapshot.empty) {
      console.log('📝 No categories found. You may need to run the initialization script first.');
      return;
    }

    console.log(`📊 Found ${snapshot.docs.length} categories to migrate.`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    // Update each category
    for (const docSnapshot of snapshot.docs) {
      const categoryData = docSnapshot.data();
      const categoryId = docSnapshot.id;
      
      console.log(`\n📂 Processing category: ${categoryData.name?.en || 'Unknown'} (${categoryId})`);
      
      // Check if showInNavbar property exists
      if (categoryData.hasOwnProperty('showInNavbar')) {
        console.log(`  ✅ Already has showInNavbar property (${categoryData.showInNavbar})`);
        skippedCount++;
        continue;
      }
      
      // Add showInNavbar property
      // Set to true for the first 4 categories (to respect the 10 limit), false for others
      const shouldShowInNavbar = updatedCount < 4;
      
      await updateDoc(doc(db, 'pageCategories', categoryId), {
        showInNavbar: shouldShowInNavbar
      });
      
      console.log(`  🔧 Updated: showInNavbar = ${shouldShowInNavbar}`);
      updatedCount++;
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`  - Updated: ${updatedCount} categories`);
    console.log(`  - Skipped: ${skippedCount} categories (already had property)`);
    console.log(`  - Total processed: ${snapshot.docs.length} categories`);
    
    if (updatedCount > 0) {
      console.log('\n💡 Next steps:');
      console.log('1. Restart your Next.js development server');
      console.log('2. Check the navbar - categories should now appear');
      console.log('3. Go to Admin > Categories to adjust which categories show in navbar');
    }
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
  }
}

// Run the migration
migrateCategoriesForNavbar()
  .then(() => {
    console.log('\n✨ Migration script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration script failed:', error);
    process.exit(1);
  });
