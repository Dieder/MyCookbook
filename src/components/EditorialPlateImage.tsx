import { useEffect, useState } from 'react';
import { Utensils } from 'lucide-react';

interface EditorialPlateImageProps {
  src: string;
  alt: string;
  caption?: string;
  aspectClass?: string;
  className?: string;
  priority?: boolean;
}

export function EditorialPlateImage({
  src,
  alt,
  caption,
  aspectClass = 'aspect-[4/3]',
  className = '',
  priority = false,
}: EditorialPlateImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <figure className={`m-0 ${className}`}>
      <div
        className={`relative overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-line)] ${aspectClass}`}
      >
        {!hasError ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading={priority ? 'eager' : 'lazy'}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-elevated)] text-[var(--text-muted)]">
            <Utensils className="w-7 h-7 mb-3 text-[var(--accent-secondary)]" strokeWidth={1.4} />
            <p className="font-display text-base text-[var(--text-ink)]">{alt}</p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-xs font-serif italic text-[var(--text-muted)] leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
