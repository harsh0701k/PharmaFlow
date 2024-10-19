import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAppSelector } from '../../stores/hooks';
import LayoutGuest from '../../layouts/Guest';
import WebSiteHeader from '../../components/WebPageComponents/Header';
import WebSiteFooter from '../../components/WebPageComponents/Footer';
import {
  HeroDesigns,
  FaqDesigns,
  ContactFormDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import FaqSection from '../../components/WebPageComponents/FaqComponent';

import ContactFormSection from '../../components/WebPageComponents/ContactFormComponent';

export default function WebSite() {
  const cardsStyle = useAppSelector((state) => state.style.cardsStyle);
  const bgColor = useAppSelector((state) => state.style.bgLayoutColor);
  const projectName = 'PharmaFlow';

  useEffect(() => {
    const darkElement = document.querySelector('body .dark');
    if (darkElement) {
      darkElement.classList.remove('dark');
    }
  }, []);
  const pages = [
    {
      href: '/home',
      label: 'home',
    },

    {
      href: '/about',
      label: 'about',
    },

    {
      href: '/contact',
      label: 'contact',
    },

    {
      href: '/faq',
      label: 'FAQ',
    },
  ];

  const faqs = [
    {
      question: 'What is the main purpose of ${projectName}?',
      answer:
        '${projectName} is designed to streamline communication between doctors, pharmacies, and patients, reducing wait times and improving healthcare efficiency.',
    },
    {
      question: 'How can I access my prescription history?',
      answer:
        'Patients can view their digital prescriptions and order history within the app, helping them keep track of their medications and refills.',
    },
    {
      question: 'Is ${projectName} compliant with data protection regulations?',
      answer:
        'Yes, ${projectName} complies with HIPAA and GDPR regulations to ensure the confidentiality and security of your medical data.',
    },
    {
      question: 'Can I use ${projectName} on multiple devices?',
      answer:
        'Yes, ${projectName} is accessible on both desktop and mobile devices, allowing you to manage your healthcare needs conveniently.',
    },
    {
      question: 'How do I receive notifications from ${projectName}?',
      answer:
        'Patients receive notifications via the app when their prescriptions are ready for pickup. You can also set reminders for medication refills and follow-up appointments.',
    },
    {
      question: 'What should I do if I encounter a technical issue?',
      answer:
        'If you experience any technical issues, please contact our support team through the contact form on our website. We are here to assist you.',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Frequently Asked Questions - ${projectName}`}</title>
        <meta
          name='description'
          content={`Find answers to common questions about ${projectName}. Learn more about our features, security, and how to get the most out of our healthcare management application.`}
        />
      </Head>
      <WebSiteHeader projectName={'PharmaFlow'} pages={pages} />
      <main
        className={`flex-grow   bg-skyBlueTheme-websiteBG   rounded-none  `}
      >
        <HeroSection
          projectName={'PharmaFlow'}
          image={['Person reading a FAQ document']}
          mainText={`Your Questions Answered with ${projectName}`}
          subTitle={`Explore our comprehensive FAQ section to find answers to your questions about ${projectName}. Learn how our application can enhance your healthcare management experience.`}
          design={HeroDesigns.TEXT_CENTER || ''}
          buttonText={`Explore FAQs`}
        />

        <FaqSection
          projectName={'PharmaFlow'}
          design={FaqDesigns.ACCORDION || ''}
          faqs={faqs}
          mainText={`Frequently Asked Questions About ${projectName} `}
        />

        <ContactFormSection
          projectName={'PharmaFlow'}
          design={ContactFormDesigns.HIGHLIGHTED || ''}
          image={['Customer service representative']}
          mainText={`Contact ${projectName} Support Team `}
          subTitle={`Have more questions or need assistance? Reach out to us anytime, and our team will respond promptly to ensure your experience with ${projectName} is seamless.`}
        />
      </main>
      <WebSiteFooter projectName={'PharmaFlow'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
