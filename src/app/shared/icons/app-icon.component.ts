import { Component, input } from '@angular/core';

export const APP_ICON_NAMES = [
  'arrowRight',
  'bank',
  'calendar',
  'cart',
  'check',
  'clock',
  'leaf',
  'mapPin',
  'minus',
  'package',
  'plus',
  'receipt',
  'search',
  'trash',
  'truck',
  'user',
] as const;

export type AppIconName = (typeof APP_ICON_NAMES)[number];

const iconPaths: Record<AppIconName, readonly string[]> = {
  arrowRight: ['M5 12h14', 'm12 5 7 7-7 7'],
  bank: ['m3 10 9-7 9 7', 'M4 10h16', 'M5 10v9', 'M9 10v9', 'M15 10v9', 'M19 10v9', 'M3 21h18'],
  calendar: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z'],
  cart: ['M3 3h2l2.4 12.4A2 2 0 0 0 9.4 17h9.8a2 2 0 0 0 2-1.6L23 8H6', 'M10 21h.01', 'M19 21h.01'],
  check: ['m5 12 4 4L19 6'],
  clock: ['M12 8v4l3 2', 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z'],
  leaf: [
    'M20.8 3.2C12 3.2 5 5.4 5 12a7 7 0 0 0 7 7c6.6 0 8.8-7 8.8-15.8Z',
    'M3 21c3.3-6 7.3-9.7 13-13',
  ],
  mapPin: ['M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z', 'M12 7a3 3 0 1 0 0 6 3 3 0 1 0 0-6'],
  minus: ['M5 12h14'],
  package: ['m12 3 9 5-9 5-9-5 9-5Z', 'M3 8v9l9 5 9-5V8', 'M12 13v9'],
  plus: ['M12 5v14', 'M5 12h14'],
  receipt: ['M4 3h16v18l-4-2-4 2-4-2-4 2V3Z', 'M8 8h8', 'M8 12h8'],
  search: ['m20 20-4.2-4.2', 'M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z'],
  trash: ['M3 6h18', 'M8 6V4h8v2', 'm19 6-1 15H6L5 6', 'M10 11v6', 'M14 11v6'],
  truck: ['M3 5h11v13H3z', 'M14 9h4l3 4v5h-7z', 'M7 21h.01', 'M18 21h.01'],
  user: ['M20 21a8 8 0 0 0-16 0', 'M12 13a4 4 0 1 0 0-8 4 4 0 1 0 0 8Z'],
};

@Component({
  selector: 'app-icon',
  templateUrl: './app-icon.component.html',
  styleUrl: './app-icon.component.scss',
})
export class AppIcon {
  readonly name = input.required<AppIconName>();
  readonly label = input<string>();

  protected readonly icons = iconPaths;
}
