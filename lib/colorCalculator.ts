export declare type hsv = {
    h: number;
    s: number;
    v: number;
}

export declare type rgb = {
    r: number;
    g: number;
    b: number;
}

export function rgbToHex(rgb: rgb): string {
    let red = rgb.r.toString(16);
    let green = rgb.g.toString(16);
    let blue = rgb.b.toString(16);

    red = red.length < 2 ? '0' + red : red;
    green = green.length < 2 ? '0' + green : green;
    blue = blue.length < 2 ? '0' + blue : blue;
    return '#' + red + green + blue;
}

export function getColorFromHsv(angle: number, saturation: number = 1, value: number = 1): string {
    const c = value * saturation;
    const x = c * (1 - Math.abs((angle / 60) % 2 - 1));
    const m = value - c;

    let rgb: rgb;
    if (angle >= 300) {
        rgb = { r: c, g: 0, b: x };
    } else if (angle >= 240) {
        rgb = { r: x, g: 0, b: c };
    } else if (angle >= 180) {
        rgb = { r: 0, g: x, b: c };
    } else if (angle >= 120) {
        rgb = { r: 0, g: c, b: x };
    } else if (angle >= 60) {
        rgb = { r: x, g: c, b: 0 };
    } else {
        rgb = { r: c, g: x, b: 0 };
    }

    rgb.r = Math.round((rgb.r + m) * 255);
    rgb.g = Math.round((rgb.g + m) * 255);
    rgb.b = Math.round((rgb.b + m) * 255);
    return rgbToHex(rgb);
}
