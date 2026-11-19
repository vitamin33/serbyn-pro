// A page that sets its own openGraph metadata does not inherit the root
// card, so the segment re-exports it.
export { default, alt, size, contentType } from '@/app/opengraph-image';
