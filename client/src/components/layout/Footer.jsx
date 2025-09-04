import { Link } from 'react-router-dom';
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';
import styles from './Footer.module.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    product: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Roadmap', href: '/#roadmap' },
      { label: 'Updates', href: '/#updates' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press', href: '/press' },
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Help Center', href: '/help' },
      { label: 'Community', href: '/community' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contact@elevateai.com', label: 'Email' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Main Footer Content */}
        <div className={styles.footerGrid}>
          {/* Brand Section */}
          <div className={`${styles.footerSection} ${styles.brandSection}`}>
            <div className={styles.brandHeader}>
              <img
                src={logo}
                alt="ElevateAI Logo"
                className={styles.brandLogo}
              />
              <span className={styles.brandName}>ElevateAI</span>
            </div>
            <p className={styles.brandDescription}>
              Empowering careers through AI-driven skill development and personalized learning paths.
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div className={styles.footerSection}>
            <h3>Product</h3>
            <ul>
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className={styles.footerSection}>
            <h3>Company</h3>
            <ul>
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className={styles.footerSection}>
            <h3>Resources</h3>
            <ul>
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
              <Mail size={18} />
            </div>
            <div className={styles.contactDetails}>
              <p className={styles.contactLabel}>Email</p>
              <p className={styles.contactValue}>contact@elevateai.com</p>
            </div>
          </div>
          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
              <Phone size={18} />
            </div>
            <div className={styles.contactDetails}>
              <p className={styles.contactLabel}>Phone</p>
              <p className={styles.contactValue}>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
              <MapPin size={18} />
            </div>
            <div className={styles.contactDetails}>
              <p className={styles.contactLabel}>Location</p>
              <p className={styles.contactValue}>San Francisco, CA</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <div className={styles.footerBottomContent}>
            <div className={styles.copyright}>
              <span>© 2024 ElevateAI. Made with</span>
              <Heart size={16} className={styles.heartIcon} />
              <span>for career growth.</span>
            </div>

            <div className={styles.legalLinks}>
              {footerLinks.legal.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={styles.legalLink}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <motion.button
              onClick={scrollToTop}
              className={styles.backToTopButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp size={16} />
              <span>Back to Top</span>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;