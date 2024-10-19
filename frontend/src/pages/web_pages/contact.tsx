import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAppSelector } from '../../stores/hooks';
import LayoutGuest from '../../layouts/Guest';
import WebSiteHeader from '../../components/WebPageComponents/Header';
import WebSiteFooter from '../../components/WebPageComponents/Footer';
import {
  ContactFormDesigns,
  HeroDesigns,
  FaqDesigns,
} from '../../components/WebPageComponents/designs';

import ContactFormSection from '../../components/WebPageComponents/ContactFormComponent';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import FaqSection from '../../components/WebPageComponents/FaqComponent';

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
      question: 'How do I create an account on ${projectName}?',
      answer:
        "To create an account, visit our registration page and fill in the required details. Once submitted, you'll receive a confirmation email to activate your account.",
    },
    {
      question: 'Can I access ${projectName} on mobile devices?',
      answer:
        'Yes, ${projectName} is designed to be responsive and can be accessed on both desktop and mobile devices for your convenience.',
    },
    {
      question: 'What should I do if I forget my password?',
      answer:
        "If you forget your password, click on the 'Forgot Password' link on the login page. Follow the instructions to reset your password via email.",
    },
    {
      question: 'How secure is my data with ${projectName}?',
      answer:
        '${projectName} uses advanced encryption and security protocols to protect your data. We comply with industry standards like HIPAA and GDPR to ensure your information is safe.',
    },
    {
      question: 'How can I update my personal information?',
      answer:
        "To update your personal information, log in to your account and navigate to the 'Profile' section. Here, you can edit your details and save the changes.",
    },
    {
      question: 'Who can I contact for technical support?',
      answer:
        'For technical support, please use the contact form on our website or email our support team directly. We are here to assist you with any issues.',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Contact Us - Get in Touch with PharmaFlow`}</title>
        <meta
          name='description'
          content={`Reach out to PharmaFlow for any inquiries or support. Our team is here to assist you with any questions you may have about our healthcare management application.`}
        />
      </Head>
      <WebSiteHeader projectName={'PharmaFlow'} pages={pages} />
      <main
        className={`flex-grow   bg-skyBlueTheme-websiteBG   rounded-none  `}
      >
        <HeroSection
          projectName={'PharmaFlow'}
          image={['Customer support team assisting clients']}
          mainText={`Connect with ${projectName} Support Team`}
          subTitle={`Have questions or need assistance with ${projectName}? Our dedicated support team is here to help you with any inquiries or issues you may encounter.`}
          design={HeroDesigns.IMAGE_RIGHT || ''}
          buttonText={`Contact Us`}
        />

        <FaqSection
          projectName={'PharmaFlow'}
          design={FaqDesigns.TWO_COLUMN || ''}
          faqs={faqs}
          mainText={`Common Questions About ${projectName} `}
        />

        <ContactFormSection
          projectName={'PharmaFlow'}
          design={ContactFormDesigns.WITH_IMAGE || ''}
          image={['Person typing on a laptop']}
          mainText={`Reach Out to ${projectName} `}
          subTitle={`We're here to assist you with any questions or feedback. Contact us anytime, and our team will respond promptly to ensure your experience with ${projectName} is seamless.`}
        />
      </main>
      <WebSiteFooter projectName={'PharmaFlow'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
