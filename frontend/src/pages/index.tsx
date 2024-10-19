import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAppSelector } from '../stores/hooks';
import LayoutGuest from '../layouts/Guest';
import WebSiteHeader from '../components/WebPageComponents/Header';
import WebSiteFooter from '../components/WebPageComponents/Footer';
import {
  HeroDesigns,
  FeaturesDesigns,
  AboutUsDesigns,
  FaqDesigns,
  ContactFormDesigns,
} from '../components/WebPageComponents/designs';

import HeroSection from '../components/WebPageComponents/HeroComponent';

import FeaturesSection from '../components/WebPageComponents/FeaturesComponent';

import AboutUsSection from '../components/WebPageComponents/AboutUsComponent';

import FaqSection from '../components/WebPageComponents/FaqComponent';

import ContactFormSection from '../components/WebPageComponents/ContactFormComponent';

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

  const features_points = [
    {
      name: 'Real-Time Prescription Updates',
      description:
        'Doctors can update prescriptions instantly, ensuring pharmacies receive the latest information to prepare orders without delay.',
      icon: 'mdiUpdate',
    },
    {
      name: 'Inventory Management',
      description:
        'Pharmacists can track medicine stock levels and notify doctors of shortages, preventing prescription of unavailable medications.',
      icon: 'mdiWarehouse',
    },
    {
      name: 'Patient Notifications',
      description:
        'Patients receive alerts when their medications are ready for pickup, reducing wait times and improving their experience.',
      icon: 'mdiBell',
    },
  ];

  const faqs = [
    {
      question: 'How does ${projectName} reduce wait times?',
      answer:
        '${projectName} allows doctors to update prescriptions in real-time, enabling pharmacies to prepare orders in advance. Patients receive notifications when their medications are ready, minimizing waiting time.',
    },
    {
      question: 'Is my data secure with ${projectName}?',
      answer:
        'Yes, ${projectName} complies with HIPAA and GDPR regulations to ensure the confidentiality and security of your medical data. We use advanced encryption and access controls to protect your information.',
    },
    {
      question: 'Can I make payments through the app?',
      answer:
        'Yes, ${projectName} integrates with secure payment gateways like Stripe and Razorpay, allowing patients to make online payments for their medications, reducing time spent at the pharmacy.',
    },
    {
      question: 'How do I receive notifications from ${projectName}?',
      answer:
        'Patients receive notifications via the app when their prescriptions are ready for pickup. You can also set reminders for medication refills and follow-up appointments.',
    },
    {
      question: 'What happens if a medication is out of stock?',
      answer:
        'If a prescribed medication is unavailable, ${projectName} notifies the doctor immediately, allowing them to prescribe an alternative without delay.',
    },
    {
      question: 'Can I access my prescription history?',
      answer:
        'Yes, patients can view their digital prescriptions and order history within the app, helping them keep track of their medications and refills.',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`PharmaFlow - Streamlined Healthcare Management`}</title>
        <meta
          name='description'
          content={`PharmaFlow is a healthcare management application designed to enhance communication between doctors, pharmacies, and patients, reducing wait times and improving efficiency in hospitals.`}
        />
      </Head>
      <WebSiteHeader projectName={'PharmaFlow'} pages={pages} />
      <main
        className={`flex-grow   bg-skyBlueTheme-websiteBG   rounded-none  `}
      >
        <HeroSection
          projectName={'PharmaFlow'}
          image={['Doctors and patients collaborating']}
          mainText={`Revolutionize Healthcare with ${projectName}`}
          subTitle={`${projectName} streamlines communication between doctors, pharmacies, and patients, reducing wait times and enhancing efficiency in hospitals. Experience seamless healthcare management today.`}
          design={HeroDesigns.IMAGE_RIGHT || ''}
          buttonText={`Get Started`}
        />

        <FeaturesSection
          projectName={'PharmaFlow'}
          image={['Healthcare professionals collaborating']}
          withBg={1}
          features={features_points}
          mainText={`Discover ${projectName} Key Features`}
          subTitle={`Explore how ${projectName} enhances healthcare management with seamless communication and efficient processes.`}
          design={FeaturesDesigns.CARDS_GRID_WITH_ICONS || ''}
        />

        <AboutUsSection
          projectName={'PharmaFlow'}
          image={['Team working on healthcare solutions']}
          mainText={`Transforming Healthcare with ${projectName}`}
          subTitle={`${projectName} is dedicated to revolutionizing healthcare management by enhancing communication and efficiency among doctors, pharmacies, and patients. Our mission is to reduce wait times and improve patient experiences in hospitals.`}
          design={AboutUsDesigns.IMAGE_LEFT || ''}
          buttonText={`Learn More`}
        />

        <FaqSection
          projectName={'PharmaFlow'}
          design={FaqDesigns.ACCORDION || ''}
          faqs={faqs}
          mainText={`Frequently Asked Questions about ${projectName} `}
        />

        <ContactFormSection
          projectName={'PharmaFlow'}
          design={ContactFormDesigns.WITH_IMAGE || ''}
          image={['Person using a smartphone']}
          mainText={`Get in Touch with ${projectName} `}
          subTitle={`Reach out to us anytime with your questions or feedback. Our team at ${projectName} is here to assist you and will respond promptly to your inquiries.`}
        />
      </main>
      <WebSiteFooter projectName={'PharmaFlow'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
