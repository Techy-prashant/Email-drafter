import React from 'react';

export const NAMDAPHA_LOGO_URL = 'https://raw.githubusercontent.com/Techy-prashant/images_workIITM/refs/heads/main/Namdapha%20logos/Namdapha_bg_colored_rect.png';

interface NamdaphaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  imageSrc?: string;
  alt?: string;
}

export const NamdaphaLogo: React.FC<NamdaphaLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  imageSrc = '/Namdapha_bg_colored_rect.png',
  alt = 'Namdapha House Logo',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-[9px]',
    md: 'w-9 h-9 rounded-[11px]',
    lg: 'w-12 h-12 rounded-[14px]',
    xl: 'w-16 h-16 rounded-[18px]',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Precision Emblem with Visually Perfect Curved Corners */}
      <div
        className={`${sizeClasses[size]} relative overflow-hidden bg-[#050507] border border-zinc-800/80 shadow-md flex items-center justify-center flex-shrink-0 ring-1 ring-white/10 transition-transform duration-200 hover:scale-105`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-cover rounded-[inherit] select-none"
          onError={(e) => {
            // Fallback to official GitHub raw image if local path fails
            e.currentTarget.src = NAMDAPHA_LOGO_URL;
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <span className="font-semibold text-sm tracking-tight text-zinc-100">
            Namdapha
          </span>
          <span className="text-[11px] text-zinc-400 tracking-normal font-mono font-normal">
            Email Studio
          </span>
        </div>
      )}
    </div>
  );
};
