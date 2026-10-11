import Image from "next/image";

type UniversityOfWinnipegLogoProps = {
  className?: string;
  alt?: string;
  width?: number;
};

export function UniversityOfWinnipegLogo({
  className,
  alt = "The University of Winnipeg",
  width = 360,
}: UniversityOfWinnipegLogoProps) {
  return (
    <Image
    //In Next.js, files inside public are served from the site root, 
    // so the correct URL for public/uw-logo.png is /uw-logo.png—not /public/uwinnipeg-logo.png.
      src="/uw-logo.png"
      alt={alt}
      width={width}
      height={Math.round(width * (226 / 749))}
      className={className}
      priority
    />
  );
}