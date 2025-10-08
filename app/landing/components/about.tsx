"use client";

import React, { useEffect, useRef, memo } from 'react';
import { motion, useAnimation, useInView, useMotionTemplate, useMotionValue, animate } from 'framer-motion';
import { Code, Zap, Users, Sparkles, ArrowRight, Github, Linkedin, Instagram, Twitter, MonitorSpeaker, Smartphone, Tablet } from 'lucide-react';

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

// Hero Section
const AboutHero = () => {
  const COLORS = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
  const color = useMotionValue(COLORS[0]);

  useEffect(() => {
    animate(color, COLORS, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, [color]);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950 px-4 py-24 text-white"
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <BoxReveal boxColor="#3b82f6" duration={0.8}>
          <span className="mb-4 inline-block rounded-full bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-300 border border-blue-600/30">
            About Visual Next.js Builder
          </span>
        </BoxReveal>
        
        <BoxReveal boxColor="#3b82f6" duration={0.8} delay={0.2}>
          <h1 className="mb-6 bg-gradient-to-br from-white to-gray-300 bg-clip-text text-5xl font-bold leading-tight text-transparent sm:text-6xl md:text-7xl">
            Building the Future of
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Next.js Development
            </span>
          </h1>
        </BoxReveal>

        <BoxReveal boxColor="#3b82f6" duration={0.8} delay={0.4}>
          <p className="mb-8 text-xl leading-relaxed text-gray-300 max-w-2xl mx-auto">
            Our mission is to blend visual editing with direct code access, empowering you to build beautiful, 
            production-ready Next.js websites faster than ever.
          </p>
        </BoxReveal>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-16 h-16 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-500/30"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-12 h-12 bg-purple-500/20 rounded-full backdrop-blur-sm border border-purple-500/30"
        />
        <motion.div
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-20 w-20 h-20 bg-green-500/20 rounded-xl backdrop-blur-sm border border-green-500/30"
        />
      </div>
    </motion.section>
  );
};

// Mission Section
const MissionSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <BoxReveal boxColor="#3b82f6" duration={0.6}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
          </BoxReveal>
          <BoxReveal boxColor="#3b82f6" duration={0.6} delay={0.1}>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              To democratize web development by making it accessible, enjoyable, and efficient for everyone.
            </p>
          </BoxReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Code,
              title: "Visual First",
              description: "Build with an intuitive drag-and-drop interface, and inspect the generated code in real-time.",
              delay: 0
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Optimized for performance with Next.js at the core, ensuring blazing-fast applications.",
              delay: 0.2
            },
            {
              icon: Users,
              title: "Production-Ready Code",
              description: "Export clean, readable Next.js and Tailwind CSS code that you can host anywhere or customize further.",
              delay: 0.4
            }
          ].map((item, index) => (
            <BoxReveal key={index} boxColor="#3b82f6" duration={0.6} delay={item.delay}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </BoxReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// Features Showcase with Mockups
const FeaturesShowcase = () => {
  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <BoxReveal boxColor="#3b82f6" duration={0.6}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Features
            </h2>
          </BoxReveal>
          <BoxReveal boxColor="#3b82f6" duration={0.6} delay={0.1}>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to build modern web applications
            </p>
          </BoxReveal>
        </div>

        {/* Feature 1 - Visual Builder */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <BoxReveal boxColor="#3b82f6" duration={0.8}>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Visual Drag & Drop Builder
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Create beautiful layouts with our intuitive visual editor. See the code update as you build, 
                  with full code access when you need it.
                </p>
                <ul className="space-y-3">
                  {[
                    "Real-time preview",
                    "Rich component library",
                    "Live properties panel",
                    "Responsive design tools"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                      <Sparkles className="w-5 h-5 text-blue-600 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </BoxReveal>

            <BoxReveal boxColor="#3b82f6" duration={0.8} delay={0.2}>
              <div className="relative">
                {/* Desktop Mockup */}
                <div className="bg-gray-900 rounded-t-xl p-3 shadow-2xl">
                  <div className="flex space-x-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 min-h-[300px]">
                    <div className="space-y-4">
                      <div className="h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded w-3/4"></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                      <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating mobile mockup */}
                <div className="absolute -bottom-10 -right-10 bg-gray-900 rounded-[2rem] p-2 shadow-xl">
                  <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] p-4 w-32 h-56">
                    <div className="space-y-2">
                      <div className="h-3 bg-blue-400 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </BoxReveal>
          </div>
        </div>

        {/* Feature 2 - Responsive Design */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <BoxReveal boxColor="#3b82f6" duration={0.8}>
              <div className="order-2 lg:order-1">
                <div className="flex justify-center space-x-8">
                  {/* Desktop */}
                  <div className="text-center">
                    <div className="w-16 h-10 bg-gray-300 dark:bg-gray-700 rounded-sm mb-2 flex items-center justify-center">
                      <MonitorSpeaker className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Desktop</span>
                  </div>
                  
                  {/* Tablet */}
                  <div className="text-center">
                    <div className="w-12 h-16 bg-gray-300 dark:bg-gray-700 rounded-md mb-2 flex items-center justify-center">
                      <Tablet className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tablet</span>
                  </div>
                  
                  {/* Mobile */}
                  <div className="text-center">
                    <div className="w-8 h-14 bg-gray-300 dark:bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mobile</span>
                  </div>
                </div>
              </div>
            </BoxReveal>

            <BoxReveal boxColor="#3b82f6" duration={0.8} delay={0.2}>
              <div className="order-1 lg:order-2">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Inspect and Export
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Our builder generates clean, human-readable code. View it in the read-only editor to understand the structure, 
                  then export the entire Next.js project as a ZIP file to host or customize locally.
                </p>
              </div>
            </BoxReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

// Team Section
const TeamSection = () => {
  const team = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      bio: "Full-stack developer with 10+ years experience in React and Next.js ecosystem.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Sarah Johnson",
      role: "Lead Designer",
      bio: "UX/UI expert passionate about creating beautiful and functional user experiences.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b098?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Engineering",
      bio: "Former Google engineer specializing in performance optimization and scalability.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <BoxReveal boxColor="#3b82f6" duration={0.6}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Meet Our Team
            </h2>
          </BoxReveal>
          <BoxReveal boxColor="#3b82f6" duration={0.6} delay={0.1}>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Passionate individuals building the future of web development
            </p>
          </BoxReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <BoxReveal key={index} boxColor="#3b82f6" duration={0.6} delay={index * 0.2}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                  <div className="absolute inset-0 rounded-full ring-4 ring-blue-100 dark:ring-blue-900 w-24 h-24 mx-auto"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </BoxReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// Social Links Component
const SocialLinks = () => {
  const socials = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  return (
    <div className="flex justify-center space-x-6">
      {socials.map((social, index) => (
        <BoxReveal key={index} boxColor="#3b82f6" duration={0.5} delay={index * 0.1}>
          <a
            href={social.href}
            aria-label={social.label}
            className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700"
          >
            <social.icon className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
          </a>
        </BoxReveal>
      ))}
    </div>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <motion.section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <BoxReveal boxColor="#ffffff" duration={0.8}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Something Amazing?
          </h2>
        </BoxReveal>
        <BoxReveal boxColor="#ffffff" duration={0.8} delay={0.2}>
          <p className="text-xl mb-8 opacity-90">
            Start building your Next.js project visually today.
          </p>
        </BoxReveal>
        <BoxReveal boxColor="#ffffff" duration={0.8} delay={0.4}>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl">
            Start Building Today
          </button>
        </BoxReveal>

        <BoxReveal boxColor="#3b82f6" duration={0.8} delay={0.4}>
          <p className="mb-8 text-xl leading-relaxed text-gray-300 max-w-2xl mx-auto">
            Empowering developers and designers to create stunning Next.js applications 
            with our intuitive visual builder and cutting-edge tools.
          </p>
        </BoxReveal>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-16 h-16 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-500/30"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-12 h-12 bg-purple-500/20 rounded-full backdrop-blur-sm border border-purple-500/30"
        />
        <motion.div
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-20 w-20 h-20 bg-green-500/20 rounded-xl backdrop-blur-sm border border-green-500/30"
        />
      </div>
    </motion.section>
  );
};






// Main About Component
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <AboutHero />
      <MissionSection />
      <FeaturesShowcase />
      <CTASection />
    </div>
  );
};

export default AboutPage;