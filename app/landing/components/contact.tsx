"use client";

import React, { useEffect, useRef, memo, useState, ChangeEvent, FormEvent } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

// Utility function
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// BoxReveal Component
const BoxReveal = memo(function BoxReveal({
  children,
  width = 'fit-content',
  boxColor = '#3b82f6',
  duration = 0.5,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  width?: string;
  boxColor?: string;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const mainControls = useAnimation();
  const slideControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      slideControls.start('visible');
      mainControls.start('visible');
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <div
      ref={ref}
      style={{ position: 'relative', width, overflow: 'hidden' }}
      className={className}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial='hidden'
        animate={mainControls}
        transition={{ duration, delay: delay + 0.25 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: '100%' } }}
        initial='hidden'
        animate={slideControls}
        transition={{ duration, ease: 'easeIn', delay }}
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor,
          borderRadius: 4,
        }}
      />
    </div>
  );
});

// Contact Form Component
const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
        alert('Thank you for your message!');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <BoxReveal width="100%">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
            </BoxReveal>
            <BoxReveal width="100%" delay={0.1}>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
            </BoxReveal>
            <BoxReveal width="100%" delay={0.2}>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    required
                    rows={5}
                    className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                ></textarea>
            </BoxReveal>
            <BoxReveal width="100%" delay={0.3}>
                <button
                    type="submit"
                    className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                    Send Message <Send className="w-5 h-5 ml-2" />
                </button>
            </BoxReveal>
        </form>
    );
};


// Main Contact Page Component
const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <BoxReveal boxColor="#3b82f6" duration={0.6}>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                    Get in Touch
                </h1>
            </BoxReveal>
            <BoxReveal boxColor="#3b82f6" duration={0.6} delay={0.1}>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    We'd love to hear from you! Whether you have a question about features, trials, or anything else, our team is ready to answer all your questions.
                </p>
            </BoxReveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
                <BoxReveal delay={0.2}>
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Email Us</h3>
                            <p className="text-gray-600 dark:text-gray-400">Our team will get back to you within 24 hours.</p>
                            <a href="mailto:support@visualnextjs.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                                support@visualnextjs.com
                            </a>
                        </div>
                    </div>
                </BoxReveal>
                <BoxReveal delay={0.3}>
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Call Us</h3>
                            <p className="text-gray-600 dark:text-gray-400">Mon-Fri from 8am to 5pm.</p>
                            <a href="tel:+1234567890" className="text-blue-600 dark:text-blue-400 hover:underline">
                                +1 (234) 567-890
                            </a>
                        </div>
                    </div>
                </BoxReveal>
                <BoxReveal delay={0.4}>
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Our Office</h3>
                            <p className="text-gray-600 dark:text-gray-400">123 Innovation Drive, Tech City, 12345</p>
                        </div>
                    </div>
                </BoxReveal>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <ContactForm />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
