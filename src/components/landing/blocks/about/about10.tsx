'use client';

import { motion } from 'framer-motion';
import TrueFocus from '@/components/ui/true-focus/TrueFocus';

interface About10Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

function parseVideoUrl(url: string): { type: 'mp4' | 'youtube'; src: string } {
  if (url.startsWith('youtube:')) return { type: 'youtube', src: url.replace('youtube:', '') };
  return { type: 'mp4', src: url };
}

export function About10({ title, subtitle, image }: About10Props) {
  const video = image ? parseVideoUrl(image) : null;

  return (
    <section id="about" className="relative h-screen min-h-[600px] max-h-[800px] flex items-center justify-center overflow-hidden">
      {video?.type === 'mp4' && (
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover -z-10">
          <source src={video.src} type="video/mp4" />
        </video>
      )}

      {video?.type === 'youtube' && (
        <iframe
          src={`https://www.youtube.com/embed/${video.src}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&playlist=${video.src}`}
          className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={title}
        />
      )}

      {!video && <div className="absolute inset-0 -z-10 bg-gray-900" />}

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 text-center px-4 max-w-3xl">
        <TrueFocus
          sentence={title}
          manualMode={false}
          blurAmount={5}
          borderColor="#ffffff"
          animationDuration={0.5}
          pauseBetweenAnimations={1}
        />

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl lg:text-2xl text-white/90 mt-6 mb-8"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.button
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-colors"
        >
          Watch Demo
        </motion.button>
      </div>
    </section>
  );
}