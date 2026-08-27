export default function ProductImage({
  src,
  category,
  alt,
  accentHex = '#8C6F4E',
}: {
  src: string | null
  category: string
  alt: string
  accentHex?: string
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-soft">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-white to-line/40 shadow-soft flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-4/5 h-4/5">
        <defs>
          <linearGradient id={`fill-${category}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accentHex} stopOpacity="0.55" />
            <stop offset="100%" stopColor={accentHex} stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* 동심원 — 3D 프린팅 적층 레이어를 상징하는 인장 링 */}
        <circle cx="100" cy="100" r="92" fill="none" stroke={accentHex} strokeOpacity="0.12" strokeWidth="1" />
        <circle cx="100" cy="100" r="78" fill="none" stroke={accentHex} strokeOpacity="0.18" strokeWidth="1" />
        <circle cx="100" cy="100" r="64" fill="none" stroke={accentHex} strokeOpacity="0.25" strokeWidth="1" />

        {renderSilhouette(category, `fill-${category}`)}

        {/* 왼쪽 위 하이라이트 — 입체감 */}
        <ellipse cx="78" cy="72" rx="22" ry="14" fill="white" opacity="0.35" />
      </svg>
    </div>
  )
}

function renderSilhouette(category: string, fillId: string) {
  const fill = `url(#${fillId})`

  switch (category) {
    case 'BUST':
      return (
        <>
          <circle cx="100" cy="72" r="30" fill={fill} />
          <path d="M40 158c0-38 27-58 60-58s60 20 60 58v6H40z" fill={fill} />
        </>
      )
    case 'FULL_BODY':
      return (
        <>
          <circle cx="100" cy="46" r="20" fill={fill} />
          <path d="M64 156V100c0-10 6-18 12-22l-8-28h64l-8 28c6 4 12 12 12 22v56z" fill={fill} />
        </>
      )
    case 'CARICATURE':
      return (
        <>
          <circle cx="100" cy="66" r="36" fill={fill} />
          <path d="M46 158c0-30 24-46 54-46s54 16 54 46v4H46z" fill={fill} />
          <circle cx="86" cy="62" r="4" fill="white" opacity="0.8" />
          <circle cx="114" cy="62" r="4" fill="white" opacity="0.8" />
        </>
      )
    case 'COUPLE':
      return (
        <>
          <circle cx="76" cy="62" r="24" fill={fill} />
          <circle cx="132" cy="62" r="24" fill={fill} />
          <path d="M32 158c0-28 18-44 44-44s44 16 44 44v4H32z" fill={fill} opacity="0.9" />
          <path d="M92 158c0-28 18-44 44-44s44 16 44 44v4H92z" fill={fill} />
        </>
      )
    case 'PET':
      return (
        <>
          <circle cx="100" cy="118" r="34" fill={fill} />
          <circle cx="66" cy="70" r="14" fill={fill} />
          <circle cx="100" cy="56" r="14" fill={fill} />
          <circle cx="134" cy="70" r="14" fill={fill} />
        </>
      )
    case 'CUSTOM':
      return (
        <>
          <path
            d="M100 30l16 34 38 5-28 27 7 38-33-18-33 18 7-38-28-27 38-5z"
            fill={fill}
          />
        </>
      )
    default:
      return <circle cx="100" cy="100" r="40" fill={fill} opacity="0.3" />
  }
}