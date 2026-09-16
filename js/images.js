/**
 * FWY Image Placeholder Generator
 * Run this in browser console to generate SVG placeholders
 * OR just use the placeholder CSS approach via CSS
 */

// This file creates inline placeholder images for all missing images
// All placeholders use deep black/grey patterns consistent with FWY brand

const images = {
  // Service gallery images
  'photo-1': { label: 'Event Photography', pattern: 'diagonal' },
  'photo-2': { label: 'Portrait Photography', pattern: 'dots' },
  'photo-3': { label: 'Product Photography', pattern: 'grid' },
  'photo-4': { label: 'Corporate Photography', pattern: 'circles' },
  'video-1': { label: 'Event Film', pattern: 'horizontal' },
  'video-2': { label: 'Brand Film', pattern: 'diagonal' },
  'video-3': { label: 'Promotional Video', pattern: 'dots' },
  'video-4': { label: 'Social Media Video', pattern: 'grid' },
  'brand-1': { label: 'Logo Design', pattern: 'circles' },
  'brand-2': { label: 'Brand System', pattern: 'diagonal' },
  'brand-3': { label: 'Social Branding', pattern: 'horizontal' },
  'brand-4': { label: 'Marketing Creatives', pattern: 'dots' },
  'promo-1': { label: 'Campaign Design', pattern: 'grid' },
  'promo-2': { label: 'Social Campaign', pattern: 'circles' },
  'promo-3': { label: 'Digital Creative', pattern: 'diagonal' },
  'promo-4': { label: 'Event Promo', pattern: 'horizontal' },
  'training-1': { label: 'Photography Workshop', pattern: 'dots' },
  'training-2': { label: 'Video Editing', pattern: 'grid' },
  'training-3': { label: 'Branding Basics', pattern: 'circles' },
  'training-4': { label: 'Creative Workshop', pattern: 'diagonal' },
  // Team
  'team-1': { label: 'Creative Director', pattern: 'portrait' },
  'team-2': { label: 'Lead Photographer', pattern: 'portrait' },
  'team-3': { label: 'Lead Videographer', pattern: 'portrait' },
  'team-4': { label: 'Brand Designer', pattern: 'portrait' },
  'team-5': { label: 'Social Lead', pattern: 'portrait' },
  'team-6': { label: 'Training Lead', pattern: 'portrait' },
  // Heroes
  'about-hero': { label: 'About FWY', pattern: 'hero' },
  'services-hero': { label: 'Services', pattern: 'hero' },
  'team-hero': { label: 'Our Team', pattern: 'hero' },
  'contact-hero': { label: 'Contact Us', pattern: 'hero' },
  'about-studio': { label: 'FWY Studio', pattern: 'studio' },
  'project-promotions': { label: 'Promotions', pattern: 'diagonal' },
};
