"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "EN" | "BN"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// English translations
const enTranslations: Record<string, string> = {
  // Navigation
  "nav.home": "Home",
  "nav.about": "About Us",
  "nav.programs": "Our Programs",
  "nav.projects": "Islamic Projects",
  "nav.charity": "Charity & Relief",
  "nav.gallery": "Gallery",
  "nav.media": "Media",
  "nav.news": "News",
  "nav.contact": "Contact",
  "nav.login": "Login",
  "nav.dashboard": "Dashboard",

  // Header
  "header.foundation": "Your Foundation",
  "header.tagline": "Serving Humanity",
  "header.donate": "Donate Now",
  "header.account": "My Account",

  // Hero
  "hero.title1": "Building a Better Future",
  "hero.desc1": "Supporting communities through education, healthcare, and humanitarian aid",
  "hero.title2": "Education for All",
  "hero.desc2": "Providing quality education to underprivileged children",
  "hero.title3": "Healthcare Initiative",
  "hero.desc3": "Bringing medical services to those who need it most",
  "hero.donate": "Donate Now",

  // Donation Form
  "donation.title": "Make a Donation",
  "donation.type": "Select Donation Type",
  "donation.general": "General Donation",
  "donation.education": "Education Program",
  "donation.healthcare": "Healthcare Initiative",
  "donation.food": "Food Distribution",
  "donation.emergency": "Emergency Relief",
  "donation.amount": "Donation Amount",
  "donation.custom": "Custom",
  "donation.custom_amount": "Enter Custom Amount",
  "donation.first_name": "First Name",
  "donation.last_name": "Last Name",
  "donation.email": "Email",
  "donation.phone": "Phone Number",
  "donation.message": "Message (Optional)",
  "donation.message_placeholder": "Add a message with your donation",
  "donation.anonymous": "Make this donation anonymous",
  "donation.payment_method": "Payment Method",
  "donation.credit_card": "Credit Card",
  "donation.bank_transfer": "Bank Transfer",
  "donation.mobile_banking": "Mobile Banking",
  "donation.cash": "Cash",
  "donation.mobile_provider": "Mobile Banking Provider",
  "donation.submit": "Donate Now",
  "donation.processing": "Processing...",
  "donation.secure": "You can donate to Your Foundation securely online.",
  "donation.details": "Click here for more details",

  // Programs Section
  "programs.title": "Our Programs",
  "programs.learn_more": "Learn More",

  // Impact Section
  "impact.title": "Our Impact",
  "impact.projects": "Projects",
  "impact.beneficiaries": "Beneficiaries",
  "impact.locations": "Locations",
  "impact.years": "Years of Service",

  // News Section
  "news.title": "Latest News",
  "news.read_more": "Read More",
  "news.view_all": "View All News",

  // Footer
  "footer.about": "About Us",
  "footer.about_desc":
    "Your Foundation is dedicated to serving humanity through various charitable programs and initiatives.",
  "footer.quick_links": "Quick Links",
  "footer.contact": "Contact Us",
  "footer.newsletter": "Newsletter",
  "footer.subscribe": "Subscribe to our newsletter for updates.",
  "footer.subscribe_button": "Subscribe",
  "footer.rights": "All rights reserved.",

  // Auth
  "auth.signin": "Sign in",
  "auth.signup": "Register",
  "auth.signout": "Sign Out",
  "auth.forgot": "Forgot password?",
  "auth.be_member": "Be a member",
  "auth.admin_panel": "Admin Panel",
  "auth.user_management": "User Management",
  "auth.role": "Role",
  "auth.user": "User",
  "auth.admin": "Admin",
  "auth.editor": "Editor",
  "auth.volunteer": "Volunteer",
  "auth.save": "Save",
  "auth.cancel": "Cancel",
  "auth.edit": "Edit",
  "auth.delete": "Delete",
  "auth.confirm": "Confirm",
  "auth.users": "Users",
  "auth.search": "Search",
  "auth.no_results": "No results found",
  "auth.loading": "Loading...",
  "auth.error": "An error occurred",
  "auth.success": "Success",
}

// Bengali translations
const bnTranslations: Record<string, string> = {
  // Navigation
  "nav.home": "হোম",
  "nav.about": "আমাদের সম্পর্কে",
  "nav.programs": "আমাদের প্রোগ্রাম",
  "nav.projects": "ইসলামিক প্রকল্প",
  "nav.charity": "দান এবং ত্রাণ",
  "nav.gallery": "গ্যালারি",
  "nav.media": "মিডিয়া",
  "nav.news": "সংবাদ",
  "nav.contact": "যোগাযোগ",
  "nav.login": "লগইন",
  "nav.dashboard": "ড্যাশবোর্ড",

  // Header
  "header.foundation": "আপনার ফাউন্ডেশন",
  "header.tagline": "মানবতার সেবায়",
  "header.donate": "দান করুন",
  "header.account": "আমার অ্যাকাউন্ট",

  // Hero
  "hero.title1": "একটি উন্নত ভবিষ্যত গড়া",
  "hero.desc1": "শিক্ষা, স্বাস্থ্যসেবা এবং মানবিক সহায়তার মাধ্যমে সম্প্রদায়কে সমর্থন করা",
  "hero.title2": "সবার জন্য শিক্ষা",
  "hero.desc2": "সুবিধাবঞ্চিত শিশুদের জন্য মানসম্পন্ন শিক্ষা প্রদান",
  "hero.title3": "স্বাস্থ্যসেবা উদ্যোগ",
  "hero.desc3": "যাদের সবচেয়ে বেশি প্রয়োজন তাদের কাছে চিকিৎসা সেবা নিয়ে আসা",
  "hero.donate": "দান করুন",

  // Donation Form
  "donation.title": "দান করুন",
  "donation.type": "দানের ধরন নির্বাচন করুন",
  "donation.general": "সাধারণ দান",
  "donation.education": "শিক্ষা প্রোগ্রাম",
  "donation.healthcare": "স্বাস্থ্যসেবা উদ্যোগ",
  "donation.food": "খাদ্য বিতরণ",
  "donation.emergency": "জরুরি ত্রাণ",
  "donation.amount": "দানের পরিমাণ",
  "donation.custom": "কাস্টম",
  "donation.custom_amount": "কাস্টম পরিমাণ লিখুন",
  "donation.first_name": "নামের প্রথম অংশ",
  "donation.last_name": "নামের শেষ অংশ",
  "donation.email": "ইমেইল",
  "donation.phone": "ফোন নম্বর",
  "donation.message": "বার্তা (ঐচ্ছিক)",
  "donation.message_placeholder": "আপনার দানের সাথে একটি বার্তা যোগ করুন",
  "donation.anonymous": "এই দানটি বেনামী করুন",
  "donation.payment_method": "পেমেন্ট পদ্ধতি",
  "donation.credit_card": "ক্রেডিট কার্ড",
  "donation.bank_transfer": "ব্যাংক ট্রান্সফার",
  "donation.mobile_banking": "মোবাইল ব্যাংকিং",
  "donation.cash": "নগদ",
  "donation.mobile_provider": "মোবাইল ব্যাংকিং প্রদানকারী",
  "donation.submit": "দান করুন",
  "donation.processing": "প্রক্রিয়াকরণ হচ্ছে...",
  "donation.secure": "আপনি আপনার ফাউন্ডেশনে নিরাপদে অনলাইনে দান করতে পারেন।",
  "donation.details": "আরও বিবরণের জন্য এখানে ক্লিক করুন",

  // Programs Section
  "programs.title": "আমাদের প্রোগ্রাম",
  "programs.learn_more": "আরও জানুন",

  // Impact Section
  "impact.title": "আমাদের প্রভাব",
  "impact.projects": "প্রকল্প",
  "impact.beneficiaries": "উপকারভোগী",
  "impact.locations": "অবস্থান",
  "impact.years": "সেবার বছর",

  // News Section
  "news.title": "সর্বশেষ সংবাদ",
  "news.read_more": "আরও পড়ুন",
  "news.view_all": "সমস্ত সংবাদ দেখুন",

  // Footer
  "footer.about": "আমাদের সম্পর্কে",
  "footer.about_desc": "আপনার ফাউন্ডেশন বিভিন্ন দাতব্য কর্মসূচি এবং উদ্যোগের মাধ্যমে মানবতার সেবায় নিবেদিত।",
  "footer.quick_links": "দ্রুত লিঙ্ক",
  "footer.contact": "যোগাযোগ করুন",
  "footer.newsletter": "নিউজলেটার",
  "footer.subscribe": "আপডেটের জন্য আমাদের নিউজলেটারে সাবস্ক্রাইব করুন।",
  "footer.subscribe_button": "সাবস্ক্রাইব",
  "footer.rights": "সর্বস্বত্ব সংরক্ষিত।",

  // Auth
  "auth.signin": "সাইন ইন",
  "auth.signup": "নিবন্ধন করুন",
  "auth.signout": "সাইন আউট",
  "auth.forgot": "পাসওয়ার্ড ভুলে গেছেন?",
  "auth.be_member": "সদস্য হোন",
  "auth.admin_panel": "অ্যাডমিন প্যানেল",
  "auth.user_management": "ব্যবহারকারী ব্যবস্থাপনা",
  "auth.role": "ভূমিকা",
  "auth.user": "ব্যবহারকারী",
  "auth.admin": "অ্যাডমিন",
  "auth.editor": "সম্পাদক",
  "auth.volunteer": "স্বেচ্ছাসেবক",
  "auth.save": "সংরক্ষণ করুন",
  "auth.cancel": "বাতিল করুন",
  "auth.edit": "সম্পাদনা করুন",
  "auth.delete": "মুছুন",
  "auth.confirm": "নিশ্চিত করুন",
  "auth.users": "ব্যবহারকারীরা",
  "auth.search": "অনুসন্ধান করুন",
  "auth.no_results": "কোন ফলাফল পাওয়া যায়নি",
  "auth.loading": "লোড হচ্ছে...",
  "auth.error": "একটি ত্রুটি ঘটেছে",
  "auth.success": "সফল",
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("EN")

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "EN" || savedLanguage === "BN")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function
  const t = (key: string): string => {
    const translations = language === "EN" ? enTranslations : bnTranslations
    return translations[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
