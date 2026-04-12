"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  Book,
  User,
  Layout,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Mail,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const HelpPage = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const categories = [
    {
      title: "Getting Started",
      description:
        "Learn the basics of using BioVue and setting up your profile.",
      icon: Book,
      color: "bg-blue-50 text-blue-600",
      buttonText: "Sign Up to Get Started",
    },
    {
      title: "My Account",
      description:
        "Manage your subscription, personal details, and preferences.",
      icon: User,
      color: "bg-teal-50 text-teal-600",
      buttonText: "See Your Account",
    },
    {
      title: "Trainer Dashboard",
      description: "How to use our powerful tools for managing your clients.",
      icon: Layout,
      color: "bg-purple-50 text-purple-600",
      buttonText: "Dashboard View",
    },
    {
      title: "Billing & Payments",
      description: "Information about invoicing, payments, and plan upgrades.",
      icon: CreditCard,
      color: "bg-amber-50 text-amber-600",
      buttonText: "See Pricing",
    },
  ];

  const faqs = [
    {
      question: "How do I start a health projection?",
      answer:
        "To start a projection, navigate to your User Dashboard and select 'Projections'. You can then choose between your current lifestyle analysis or set a future goal. Upload your baseline photo and follow the on-screen instructions.",
    },
    {
      question: "Is my medical data secure?",
      answer:
        "Absolutely. BioVue uses industry-standard encryption and security protocols to ensure your data stays private and safe. We never share your personal health information without your explicit consent.",
    },
    {
      question: "Can I use BioVue with my fitness trainer?",
      answer:
        "Yes! BioVue is designed for collaboration. Your trainer can use the Trainer Dashboard to monitor your progress, set goals, and provide personalized insights directly through the platform.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and Apple Pay. For premium corporate plans, we also offer bank transfer options.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#f4fbfa]">
      <Navbar />

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1f2d2e] mb-6">
            How can we <span className="text-[#0fa4a9]">help you</span> today?
          </h1>
          <div className="max-w-2xl mx-auto relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0fa4a9] transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for articles, guides..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0fa4a9]/20 transition-all text-gray-700"
            />
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-[24px] border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                    cat.color,
                  )}
                >
                  <cat.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#1f2d2e] mb-3 group-hover:text-[#0fa4a9] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[#5f6f73] text-sm leading-relaxed mb-6">
                  {cat.description}
                </p>
                <div className="flex items-center text-[#0fa4a9] font-bold text-sm tracking-wide gap-2">
                  {cat.buttonText}
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="container mx-auto px-4 py-20 bg-white border border-gray-50 rounded-[40px] shadow-sm mb-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-[#1f2d2e] text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={cn(
                  "border rounded-2xl transition-all duration-300",
                  activeFaq === i
                    ? "border-[#0fa4a9] bg-[#f4fbfa]/30"
                    : "border-gray-100 bg-transparent",
                )}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-[#1f2d2e]">
                    {faq.question}
                  </span>
                  {activeFaq === i ? (
                    <ChevronUp className="text-[#0fa4a9]" />
                  ) : (
                    <ChevronDown className="text-gray-400" />
                  )}
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-[#5f6f73] leading-relaxed italic border-l-2 border-[#0fa4a9]/30 pl-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Strip */}
        <section className="container mx-auto px-4 text-center">
          <div className="bg-[#1f2d2e] rounded-[32px] p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0fa4a9]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0fa4a9]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

            <h2 className="text-3xl font-bold mb-4 relative z-10">
              Still have questions?
            </h2>
            <p className="text-gray-400 mb-8 relative z-10">
              Our support team is always here to help you on your wellness
              journey.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10">
              <a
                href="mailto:BioVueSupport@gmail.com?subject=Support Request&body=Hi BioVue Team,"
                className="bg-[#0fa4a9] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-[#0d8d91] transition-all cursor-pointer group shadow-lg shadow-[#0fa4a9]/20"
              >
                <Mail
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                Email Us Directly
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HelpPage;
