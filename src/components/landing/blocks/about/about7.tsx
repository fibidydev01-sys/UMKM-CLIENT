'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface About7Props {
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

export function About7({ title, features = [] }: About7Props) {
  const pyramidLayout = [
    { cols: 1, items: features.slice(0, 1) },
    { cols: 2, items: features.slice(1, 3) },
    { cols: 3, items: features.slice(3, 6) },
  ].filter((row) => row.items.length > 0);

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
          {pyramidLayout.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid gap-4 md:gap-6`}
              style={{
                gridTemplateColumns: `repeat(${row.cols}, minmax(0, 1fr))`,
              }}
            >
              {row.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-lg"
                >
                  {item.icon && (
                    <OptimizedImage
                      src={item.icon}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                      <h3 className="font-bold text-base md:text-lg mb-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-xs md:text-sm text-white/90 leading-relaxed">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}