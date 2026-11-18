import ResponsiveImage from '../ui/ResponsiveImage';
import { ImageReveal } from '../ui/Reveal';
import { images, imageSizes } from '../../data/images';

const { hero } = images;

/**
 * Hero illustration: the studio's work (website, local visibility, social, branding) in one composed image.
 * Shown whole with object-contain, never cropped, in a card that matches the portfolio cards (radius 24, hairline ring).
 * The card colour is the artwork's own edge tone, so the image sits flush inside it.
 */
export default function HeroVisual() {
  return (
    <ImageReveal delay={0.3} className="relative mx-auto w-full max-w-2xl lg:max-w-none">
      <div
        className="relative overflow-hidden rounded-3xl bg-[#F8F2EE] ring-1 ring-line/5"
        style={{ aspectRatio: `${hero.width} / ${hero.height}` }}
      >
        <ResponsiveImage
          image={hero}
          sizes={imageSizes.hero}
          priority
          alt="KV DEV STUDIO website on a desktop browser and a phone, surrounded by cards for website development, local business visibility, social media management, brand identity, and branding and graphic design"
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    </ImageReveal>
  );
}
