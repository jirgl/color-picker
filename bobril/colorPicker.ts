import * as b from 'bobril';
import * as m from 'bobril-m';
import { hex, hsv } from '../lib/colorModels';
import * as colorConverter from '../lib/colorConverter';
import { ColorPreview } from './components/colorPreview';
import { HsvPreview } from './components/hsvPreview';
import { ColorBar } from './components/colorBar';

const defaultColor = { r: 0, g: 200, b: 0 };

export interface IColorPickerData {
}

interface IColorPickerCtx extends b.IBobrilCtx {
    data: IColorPickerData;
    red: number;
    green: number;
    blue: number;
    currentPreviewColor: hex;
    newPreviewColor: hex;
}

export const ColorPicker = b.createComponent<IColorPickerData>({
    init(ctx: IColorPickerCtx) {
        ctx.red = defaultColor.r;
        ctx.green = defaultColor.g;
        ctx.blue = defaultColor.b;
        ctx.currentPreviewColor = colorConverter.rgbToHex(defaultColor);
        ctx.newPreviewColor = colorConverter.rgbToHex(defaultColor);
    },
    render(ctx: IColorPickerCtx, me: b.IBobrilNode) {
        me.children = b.styledDiv([
            b.styledDiv(HsvPreview({
                hsv: { h: colorConverter.rgbToHue({ r: ctx.red, g: ctx.green, b: ctx.blue }), s: 1, v: 1 },
                onColorSelect: (hsv: hsv) => {
                    ctx.newPreviewColor = colorConverter.hsvToHex(hsv);
                    const rgb = colorConverter.hsvToRgb(hsv);
                    ctx.red = rgb.r;
                    ctx.green = rgb.g;
                    ctx.blue = rgb.b;
                    b.invalidate(ctx);
                }
            }), { marginLeft: 5, marginRight: 5 }),
            b.styledDiv(ColorBar({
                hue: colorConverter.rgbToHue({ r: ctx.red, g: ctx.green, b: ctx.blue }),
                onColorSelect: (hue: number) => {
                    const rgb = colorConverter.hsvToRgb({ h: hue, s: 1, v: 1 });
                    ctx.red = rgb.r;
                    ctx.green = rgb.g;
                    ctx.blue = rgb.b;
                    b.invalidate(ctx);
                }
            }), { marginTop: 20 }),
            ColorPreview({ color: ctx.currentPreviewColor }),
            ColorPreview({ color: ctx.newPreviewColor }),
            m.TextField({
                labelText: 'red', value: ctx.red.toString(), onChange: (value) => {
                    ctx.red = parseInt(value);
                    b.invalidate(ctx);
                }
            }),
            m.TextField({
                labelText: 'green', value: ctx.green.toString(), onChange: (value) => {
                    ctx.green = parseInt(value);
                    b.invalidate(ctx);
                }
            }),
            m.TextField({
                labelText: 'blue', value: ctx.blue.toString(), onChange: (value) => {
                    ctx.blue = parseInt(value);
                    b.invalidate(ctx);
                }
            })
        ], { padding: 10 });
    }
});
