'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface CoverImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  // Ditampilin kalau src kosong atau gambarnya gagal dimuat (link mati, diblok, dsb).
  fallback: ReactNode;
}

export function CoverImage({ src, alt, className, loading = 'lazy', fallback }: CoverImageProps) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Gambar yang gagal load SEBELUM React selesai hydrate nggak akan nembak onError,
  // jadi dicek manual: sudah selesai (complete) tapi lebarnya 0 = gambar rusak.
  useEffect(() => {
    const el = ref.current;
    setFailed(!!el && el.complete && el.naturalWidth === 0);
  }, [src]);

  if (!src || failed) return <>{fallback}</>;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
