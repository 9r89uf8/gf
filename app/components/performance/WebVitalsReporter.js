'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Web Vitals Reporter for monitoring INP and other metrics
export default function WebVitalsReporter() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamically import web-vitals to reduce initial bundle
    import('web-vitals').then(({ onINP, onLCP, onFCP, onCLS, onTTFB }) => {
      // Track INP (Interaction to Next Paint)
      onINP((metric) => {
        console.log('INP:', metric.value, 'ms');
        // Send to analytics if needed
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'INP',
            value: Math.round(metric.value),
            metric_id: metric.id,
            metric_delta: metric.delta,
            page_path: pathname,
          });
        }
      });

      // Track LCP (Largest Contentful Paint)
      onLCP((metric) => {
        console.log('LCP:', metric.value, 'ms');
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'LCP',
            value: Math.round(metric.value),
            page_path: pathname,
          });
        }
      });

      // Track FCP (First Contentful Paint)
      onFCP((metric) => {
        console.log('FCP:', metric.value, 'ms');
      });

      // Track CLS (Cumulative Layout Shift)
      onCLS((metric) => {
        console.log('CLS:', metric.value);
      });

      // Track TTFB (Time to First Byte)
      onTTFB((metric) => {
        console.log('TTFB:', metric.value, 'ms');
      });
    });
  }, [pathname]);

  // Add performance marks for navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const navigationStart = performance.now();
    
    return () => {
      const navigationEnd = performance.now();
      const navigationTime = navigationEnd - navigationStart;
      
      console.log(`Navigation to ${pathname} took ${navigationTime.toFixed(2)}ms`);
      
      // Mark performance entry
      if (performance.mark) {
        performance.mark(`navigation-${pathname}`);
        performance.measure(
          `navigation-timing-${pathname}`,
          { start: navigationStart, end: navigationEnd }
        );
      }
    };
  }, [pathname]);

  return null;
}