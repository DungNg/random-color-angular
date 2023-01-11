import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor() { }

  isLightColor(color: any) {

    // Variables for red, green, blue values
    var r, g, b, hsp;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

      // If RGB --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      r = color[1];
      g = color[2];
      b = color[3];
    }
    else {

      // If hex --> Convert it to RGB: http://gist.github.com/983661
      color = +("0x" + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'));

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {

      return true; //light
    }
    else {

      return false; //dark
    }
  }

  getRandomColor() {
    let letters = '0123456789ABCDEF',
      color = '#',
      generatedNumber,
      i;
    for (i = 0; i < 6; i++) {
      generatedNumber = Math.floor(Math.random() * 16);
      color += letters[generatedNumber];
    }
    return color;
  }

  generateRandomColorList(length: number) {
    let result = [];
    for (let index = 0; index < length; index++) {
      result.push(this.getRandomColor());
    }
    return result;
  }

  randomInRange(start: number, end: number) {
    return Math.floor(Math.random() * (end - start + 1) + start);
  }

  sortColorsByHue(colors: Array<string>) {
    const constructColor = (hexString: string) => {
      const hex = hexString.replace(/#/g, '');
      /* Get the RGB values to calculate the Hue. */
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      /* Getting the Max and Min values for Chroma. */
      const max = Math.max.apply(Math, [r, g, b]);
      const min = Math.min.apply(Math, [r, g, b]);

      /* Variables for HSV value of hex color. */
      let chr = max - min;
      let hue = 0;
      let val = max;
      let sat = 0;

      if (val > 0) {
        /* Calculate Saturation only if Value isn't 0. */
        sat = chr / val;
        if (sat > 0) {
          if (r === max) {
            hue = 60 * ((g - min - (b - min)) / chr);
            if (hue < 0) {
              hue += 360;
            }
          } else if (g === max) {
            hue = 120 + 60 * ((b - min - (r - min)) / chr);
          } else if (b === max) {
            hue = 240 + 60 * ((r - min - (g - min)) / chr);
          }
        }
      }
      const colorObj: any = {};
      colorObj.hue = hue;
      colorObj.hex = hexString;
      return colorObj;
    };

    return colors
      .map(color => constructColor(color))
      .sort((a, b) => {
        return a.hue - b.hue;
      })
      .map(color => color.hex);
  };
}
