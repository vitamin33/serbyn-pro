'use client';

import { useEffect, useRef, useState } from 'react';
import { trackClientEvent } from '../actions';

interface VideoEmbedLoomProps {
  videoUrl: string;
  icp: string;
  variant?: string;
  title?: string;
  description?: string;
}

interface LoomVideoEvent {
  type: 'video_event';
  event: 'play' | 'pause' | 'ended' | 'progress';
  progress?: number; // 0-1 for progress events
}

export default function VideoEmbedLoom({
  videoUrl,
  icp,
  variant = 'default',
  title,
  description,
}: VideoEmbedLoomProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [trackingState, setTrackingState] = useState({
    video_25: false,
    video_50: false,
    video_95: false,
  });

  // Validate and extract Loom video ID
  const getLoomVideoId = (url: string): string | null => {
    try {
      const patterns = [
        /loom\.com\/share\/([a-zA-Z0-9]+)/,
        /loom\.com\/embed\/([a-zA-Z0-9]+)/,
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      return null;
    } catch {
      return null;
    }
  };

  const videoId = getLoomVideoId(videoUrl);
  const embedUrl = videoId ? `https://www.loom.com/embed/${videoId}` : null;

  useEffect(() => {
    if (!videoId) return;

    const handleMessage = async (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== 'https://www.loom.com') return;

      try {
        const data = event.data as LoomVideoEvent;

        if (data.type === 'video_event') {
          // Track milestone events
          if (data.event === 'progress' && typeof data.progress === 'number') {
            const progress = Math.floor(data.progress * 100);

            // Track 25% milestone
            if (progress >= 25 && !trackingState.video_25) {
              setTrackingState(prev => ({ ...prev, video_25: true }));
              await trackClientEvent({
                event: 'video_25',
                icp,
                variant,
                context: {
                  route: window.location.pathname,
                  slug: `video_${videoId}`,
                  ref: videoUrl,
                  user_agent: navigator.userAgent,
                },
              });
            }

            // Track 50% milestone
            if (progress >= 50 && !trackingState.video_50) {
              setTrackingState(prev => ({ ...prev, video_50: true }));
              await trackClientEvent({
                event: 'video_50',
                icp,
                variant,
                context: {
                  route: window.location.pathname,
                  slug: `video_${videoId}`,
                  ref: videoUrl,
                  user_agent: navigator.userAgent,
                },
              });
            }

            // Track 95% milestone (near completion)
            if (progress >= 95 && !trackingState.video_95) {
              setTrackingState(prev => ({ ...prev, video_95: true }));
              await trackClientEvent({
                event: 'video_95',
                icp,
                variant,
                context: {
                  route: window.location.pathname,
                  slug: `video_${videoId}`,
                  ref: videoUrl,
                  user_agent: navigator.userAgent,
                },
              });
            }
          }
        }
      } catch (error) {
        console.error('Error processing video event:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [videoId, videoUrl, icp, variant, trackingState]);

  if (!videoId) {
    console.error('Invalid Loom video URL:', videoUrl);
    return (
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          Invalid video URL provided
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video header */}
      {(title || description) && (
        <div className="text-center space-y-2">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-slate-600 dark:text-slate-400">{description}</p>
          )}
        </div>
      )}

      {/* Video iframe */}
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-slate-100 dark:bg-slate-800">
        <div className="aspect-video">
          <iframe
            ref={iframeRef}
            src={embedUrl!}
            title={title || 'Video'}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>

      {/* Development tracking indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <div>Video ID: {videoId}</div>
          <div>Tracked milestones:</div>
          <ul className="ml-4 space-y-1">
            <li>25%: {trackingState.video_25 ? '✅' : '❌'}</li>
            <li>50%: {trackingState.video_50 ? '✅' : '❌'}</li>
            <li>95%: {trackingState.video_95 ? '✅' : '❌'}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
