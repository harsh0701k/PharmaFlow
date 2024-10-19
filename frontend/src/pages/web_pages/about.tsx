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
  AboutUsDesigns,
  FeaturesDesigns,
  TestimonialsDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import AboutUsSection from '../../components/WebPageComponents/AboutUsComponent';

import FeaturesSection from '../../components/WebPageComponents/FeaturesComponent';

import TestimonialsSection from '../../components/WebPageComponents/TestimonialsComponent';

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
      name: 'Seamless Communication',
      description:
        'Facilitates real-time communication between doctors, pharmacists, and patients, ensuring everyone is informed and coordinated for better healthcare delivery.',
      icon: 'mdiMessageText',
    },
    {
      name: 'Efficient Prescription Management',
      description:
        'Allows doctors to update prescriptions instantly and pharmacies to prepare orders in advance, reducing wait times and improving patient satisfaction.',
      icon: 'mdiPrescription',
    },
    {
      name: 'Patient-Centric Notifications',
      description:
        'Keeps patients informed with timely notifications about their medication status, appointments, and refills, enhancing their overall healthcare experience.',
      icon: 'mdiBellAlert',
    },
  ];

  const testimonials = [
    {
      text: "PharmaFlow has transformed our hospital's pharmacy operations. The real-time updates and notifications have significantly reduced patient wait times.",
      company: 'HealthBridge Hospital',
      user_name: 'Dr. Emily Carter, Chief Pharmacist',
    },
    {
      text: 'As a doctor, I appreciate how PharmaFlow streamlines prescription management. It allows me to focus more on patient care rather than administrative tasks.',
      company: 'Wellness Clinic',
      user_name: 'Dr. John Smith, General Practitioner',
    },
    {
      text: 'The seamless communication between our pharmacy and doctors has improved efficiency and patient satisfaction. PharmaFlow is a game-changer!',
      company: 'CareFirst Medical Center',
      user_name: 'Sarah Johnson, Pharmacy Manager',
    },
    {
      text: "PharmaFlow's patient notifications keep me informed about my medication status, making my healthcare experience much smoother and stress-free.",
      company: 'Patient Advocate Group',
      user_name: 'Michael Brown, Patient',
    },
    {
      text: 'Implementing PharmaFlow in our hospital has been a great decision. It has improved our workflow and enhanced the overall patient experience.',
      company: 'City Health Hospital',
      user_name: 'Linda Green, Hospital Administrator',
    },
    {
      text: "PharmaFlow's intuitive interface and efficient features have made managing prescriptions and patient data much easier for our team.",
      company: 'Harmony Health Clinic',
      user_name: 'David Lee, IT Specialist',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`About PharmaFlow - Our Mission and Vision`}</title>
        <meta
          name='description'
          content={`Learn more about PharmaFlow, our mission to revolutionize healthcare management, and the values that drive us to enhance communication and efficiency in hospitals.`}
        />
      </Head>
      <WebSiteHeader projectName={'PharmaFlow'} pages={pages} />
      <main
        className={`flex-grow   bg-skyBlueTheme-websiteBG   rounded-none  `}
      >
        <HeroSection
          projectName={'PharmaFlow'}
          image={['Team discussing healthcare innovations']}
          mainText={`Discover the Vision Behind ${projectName}`}
          subTitle={`At ${projectName}, we are committed to transforming healthcare management by enhancing communication and efficiency. Learn about our mission and the values that drive us forward.`}
          design={HeroDesigns.IMAGE_BG || ''}
          buttonText={`Our Story`}
        />

        <AboutUsSection
          projectName={'PharmaFlow'}
          image={['Healthcare professionals collaborating']}
          mainText={`Empowering Healthcare with ${projectName}`}
          subTitle={`${projectName} is dedicated to revolutionizing healthcare management by fostering seamless communication and efficiency. Our mission is to enhance patient experiences and streamline hospital operations.`}
          design={AboutUsDesigns.IMAGE_LEFT || ''}
          buttonText={`Meet Our Team`}
        />

        <FeaturesSection
          projectName={'PharmaFlow'}
          image={['Doctors using digital tools']}
          withBg={1}
          features={features_points}
          mainText={`Explore ${projectName} Core Features`}
          subTitle={`Discover how ${projectName} enhances healthcare management with innovative features designed to improve efficiency and patient care.`}
          design={FeaturesDesigns.CARDS_GRID_WITH_ICONS || ''}
        />

        <TestimonialsSection
          projectName={'PharmaFlow'}
          design={TestimonialsDesigns.MULTI_CARD_DISPLAY || ''}
          testimonials={testimonials}
          mainText={`What Users Say About ${projectName} `}
        />
      </main>
      <WebSiteFooter projectName={'PharmaFlow'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
