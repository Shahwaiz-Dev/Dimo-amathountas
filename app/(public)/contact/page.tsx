'use client';

import { ContactForm } from '@/components/contact/contact-form';
import { Mail, Phone, MapPin } from 'lucide-react';
import { TranslatableContent } from '@/components/translatable-content';
import { motion, easeOut } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const sectionVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeOut
    }
  }
};

const contactInfoVariants = {
  hidden: { 
    opacity: 0, 
    x: 30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easeOut
    }
  }
};

export default function ContactPage() {
  const { currentLang } = useTranslation();
  return (
    <motion.div 
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <main className="py-16">
        <div className="w-full px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start p-8"
            variants={sectionVariants}
          >
            {/* Left: Contact Form */}
            <motion.div 
              className="flex flex-col justify-start"
              variants={sectionVariants}
            >
              <ContactForm />
              <motion.div 
                className="mt-8 rounded-lg overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <iframe
                  title="Amathountas Location"
                  src="https://www.google.com/maps?q=Stavraetou+tou+Machaira+42,+4104+Agios+Athanasios&output=embed"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </motion.div>
            </motion.div>
            
            {/* Right: Contact Info */}
            <motion.div 
              className="flex flex-col justify-start text-body text-base space-y-4"
              variants={contactInfoVariants}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <TranslatableContent 
                  title={{ en: "CONTACT INFORMATION AMATHOUNTA MUNICIPALITY", el: "ΣΤΟΙΧΕΙΑ ΕΠΙΚΟΙΝΩΝΙΑΣ ΔΗΜΟΥ ΑΜΑΘΟΥΝΤΑΣ" }}
                  content={{ en: "", el: "" }}
                  className="text-4xl font-extrabold text-heading mb-4 tracking-tight"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Address:" content="" className="" /></strong>
                <div><TranslatableContent title="" content={{ en: "Municipality – Abraham 4104, Amathountas", el: "Δημαρχείο – Αβραάμ 4104, Αμαθούντα" }} className="" /></div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Phone:" content="" className="" /></strong>
                <div>25864100</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Operating Hours:" content="" className="" /></strong>
                <div><TranslatableContent title="" content={{ en: "Monday – Friday 07:30 – 15:00", el: "Δευτέρα – Παρασκευή 07:30 – 15:00" }} className="" /></div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Cashier Hours:" content="" className="" /></strong>
                <div>{currentLang === 'el' ? '8:00-13:00' : '8:00-13:00'}</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Citizen Service Office" content="" className="" /></strong>
                <div><TranslatableContent title="" content={{ en: "Tel: 25864146", el: "Τηλ: 25864146" }} className="" /></div>
                <div>Email: municipality@amathounta.org.cy</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Administrative Services" content="" className="" /></strong>
                <div><TranslatableContent title="" content={{ en: "Tel: 25864118 /137 / 157 /107", el: "Τηλ: 25864118 /137 / 157 /107" }} className="" /></div>
                <div>Email: municipality@amathounta.org.cy</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Technical Services Department" content="" className="" /></strong>
                <div><TranslatableContent title="" content={{ en: "Tel: 25864112 /113 /142", el: "Τηλ: 25864112 /113 /142" }} className="" /></div>
                <div>Email: techical@amathounta.org.cy</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Taxes" content="" className="" /></strong>
                <div><TranslatableContent title="" content={{ en: "Tel: 25864138 /139 / 132 / 141", el: "Τηλ: 25864138 /139 / 132 / 141" }} className="" /></div>
                <div>Email: financial@amathounta.org.cy</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Accounting" content="" className="" /></strong>
                <div><TranslatableContent title="" content={{ en: "Tel: 25864143", el: "Τηλ: 25864143" }} className="" /></div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Cashier (Central)" content="" className="" /></strong>
                <div><TranslatableContent title="" content={{ en: "Tel: 25864120", el: "Τηλ: 25864120" }} className="" /></div>
                <div><TranslatableContent title="" content={{ en: "Hours: 08:30 – 13:30", el: "Ώρες: 08:30 – 13:30" }} className="" /></div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Operating Licenses" content="" className="" /></strong>
                <div><TranslatableContent title="" content={{ en: "Tel: 25864149", el: "Τηλ: 25864149" }} className="" /></div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Health Services" content="" className="" /></strong>
                <div><TranslatableContent title="" content={{ en: "Tel: 25864128 /145", el: "Τηλ: 25864128 /145" }} className="" /></div>
                <div>Email: healthservices@amathounta.org.cy</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Cultural Sector" content="" className="" /></strong>
                <div><TranslatableContent title="" content={{ en: "Tel: 25864155", el: "Τηλ: 25864155" }} className="" /></div>
                <div>Email: cultural@amathounta.org.cy</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Civil Weddings" content="" className="" /></strong>
                <div><TranslatableContent title="" content={{ en: "Tel: 25879812", el: "Τηλ: 25879812" }} className="" /></div>
                <div>Email: weddings@amathounta.org.cy</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.6 }}
              >
                <strong><TranslatableContent title="Traffic Warden Service" content="" className="" /></strong>
                <div><TranslatableContent title="" content={{ en: "Tel: 25805316, 25879817", el: "Τηλ: 25805316, 25879817" }} className="" /></div>
                <div>Email: trafficwardens@amathounta.org.cy</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}