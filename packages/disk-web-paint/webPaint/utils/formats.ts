import type { IPoint } from '@js-basics/vector';

export interface FormatGroup {
  group: string;
  formats: Format[];
}

export interface Format {
  name: string;
  dimension: { x: number; y: number };
}

export interface CustomFormat {
  name: string;
  dimension: IPoint & number;
}

const formats: FormatGroup[] = [
  {
    group: 'Misc.',
    formats: [
      { name: 'Standard', dimension: { x: 320, y: 256 } },
      { name: 'Full Page', dimension: { x: 320, y: 340 } },
      { name: 'Overscan', dimension: { x: 360, y: 290 } }
    ]
  },
  {
    group: 'Web & Screen',
    formats: [
      { name: 'Default', dimension: { x: 800, y: 600 } },
      { name: 'VGA', dimension: { x: 640, y: 480 } },
      { name: 'SVGA', dimension: { x: 800, y: 600 } },
      { name: 'XGA', dimension: { x: 1024, y: 768 } },
      { name: 'HD (720p)', dimension: { x: 1280, y: 720 } },
      { name: 'Full HD (1080p)', dimension: { x: 1920, y: 1080 } },
      { name: 'QHD (1440p)', dimension: { x: 2560, y: 1440 } },
      { name: '2K (DCI)', dimension: { x: 2048, y: 1080 } },
      { name: '4K (UHD)', dimension: { x: 3840, y: 2160 } },
      { name: '4K (DCI)', dimension: { x: 4096, y: 2160 } },
      { name: '5K', dimension: { x: 5120, y: 2880 } },
      { name: '8K (UHD)', dimension: { x: 7680, y: 4320 } },
      { name: 'WUXGA', dimension: { x: 1920, y: 1200 } },
      { name: 'Ultrawide (21:9)', dimension: { x: 2560, y: 1080 } },
      { name: 'Ultrawide+ (21:9)', dimension: { x: 3440, y: 1440 } }
    ]
  },
  {
    group: 'Web Banners (Common Sizes)',
    formats: [
      { name: 'Full x Hero', dimension: { x: 1920, y: 600 } },
      { name: 'Large Leaderboard', dimension: { x: 970, y: 250 } },
      { name: 'Leaderboard', dimension: { x: 728, y: 90 } },
      { name: 'Billboard', dimension: { x: 800, y: 250 } },
      { name: 'Medium Rectangle', dimension: { x: 300, y: 250 } },
      { name: 'Large Rectangle', dimension: { x: 336, y: 280 } },
      { name: 'Skyscraper', dimension: { x: 120, y: 600 } },
      { name: 'Wide Skyscraper', dimension: { x: 160, y: 600 } },
      { name: 'Half Page Ad', dimension: { x: 300, y: 600 } },
      { name: 'Mobile Leaderboard', dimension: { x: 320, y: 50 } }
    ]
  },
  {
    group: 'Icons & Favicons',
    formats: [
      { name: 'Small Icon (16x16)', dimension: { x: 16, y: 16 } },
      { name: 'Favicon (32x32)', dimension: { x: 32, y: 32 } },
      { name: 'Standard Icon (48x48)', dimension: { x: 48, y: 48 } },
      { name: 'Large Icon (64x64)', dimension: { x: 64, y: 64 } },
      { name: 'App Icon (128x128)', dimension: { x: 128, y: 128 } },
      {
        name: 'High-Res Icon (256x256)',
        dimension: { x: 256, y: 256 }
      },
      {
        name: 'Social Profile (512x512)',
        dimension: { x: 512, y: 512 }
      }
    ]
  },
  {
    group: 'Retro Gaming (Nintendo Game Boy)',
    formats: [
      { name: 'Game Boy / GBC', dimension: { x: 160, y: 144 } },
      { name: 'Game Boy Advance', dimension: { x: 240, y: 160 } }
    ]
  },
  {
    group: 'Pixel Art',
    formats: [
      { name: 'Tiny Sprite (8x8)', dimension: { x: 8, y: 8 } },
      { name: 'Small Sprite (16x16)', dimension: { x: 16, y: 16 } },
      { name: 'Medium Sprite (32x32)', dimension: { x: 32, y: 32 } },
      { name: 'Large Sprite (64x64)', dimension: { x: 64, y: 64 } },
      {
        name: 'Small Scene (128x128)',
        dimension: { x: 128, y: 128 }
      },
      {
        name: 'Medium Scene (256x256)',
        dimension: { x: 256, y: 256 }
      }
    ]
  },
  {
    group: 'Print (ISO 216 / A-Serie)',
    formats: [
      { name: 'A0', dimension: { x: 841, y: 1189 } },
      { name: 'A1', dimension: { x: 594, y: 841 } },
      { name: 'A2', dimension: { x: 420, y: 594 } },
      { name: 'A3', dimension: { x: 297, y: 420 } },
      { name: 'A4', dimension: { x: 210, y: 297 } },
      { name: 'A5', dimension: { x: 148, y: 210 } }
    ]
  },
  {
    group: 'Print (US Standard)',
    formats: [
      { name: 'Letter', dimension: { x: 216, y: 279 } },
      { name: 'Legal', dimension: { x: 216, y: 356 } },
      { name: 'Tabloid', dimension: { x: 279, y: 432 } }
    ]
  },
  {
    group: 'Common Aspect Ratios & Custom',
    formats: [
      { name: 'Square (1:1)', dimension: { x: 1000, y: 1000 } },
      { name: 'Custom', dimension: { x: 800, y: 600 } }
    ]
  }
];

export default formats;
export const DEFAULT_TEMPLATE = formats[0].formats[0];
