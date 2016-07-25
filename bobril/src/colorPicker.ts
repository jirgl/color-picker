import * as b from 'bobril';
import * as m from 'bobril-m';
import { hex, hsv, rgb } from 'jirgl-graphics';
import * as graphics from 'jirgl-graphics';
import { ColorPreview } from './components/colorPreview';
import { HsvPreview } from './components/hsvPreview';
import { ColorBar } from './components/colorBar';

const defaultColor = { r: 0, g: 200, b: 0 };

export interface IColorPickerData {
}

interface IColorPickerCtx extends b.IBobrilCtx {
    data: IColorPickerData;
    hsv: hsv;
    rgb: rgb;
    currentPreviewColor: hex;
    newPreviewColor: hex;
}

export const ColorPicker = b.createComponent<IColorPickerData>({
    init(ctx: IColorPickerCtx) {
        ctx.rgb = defaultColor;
        ctx.hsv = graphics.rgbToHsv(defaultColor);
        ctx.currentPreviewColor = graphics.rgbToHex(defaultColor);
        ctx.newPreviewColor = graphics.rgbToHex(defaultColor);
    },
    render(ctx: IColorPickerCtx, me: b.IBobrilNode) {
        me.children = b.styledDiv([
            b.styledDiv(HsvPreview({
                hsv: ctx.hsv,
                onColorSelect: (hsv: hsv) => {
                    ctx.newPreviewColor = graphics.hsvToHex(hsv);
                    ctx.hsv = hsv;
                    ctx.rgb = graphics.hsvToRgb(hsv);
                    b.invalidate(ctx);
                }
            }), { marginLeft: 5, marginRight: 5 }),
            b.styledDiv(ColorBar({
                hue: ctx.hsv.h,
                onColorSelect: (hue: number) => {
                    ctx.hsv.h = hue;
                    ctx.rgb = graphics.hsvToRgb({ h: hue, s: ctx.hsv.s, v: ctx.hsv.v });
                    ctx.newPreviewColor = graphics.hsvToHex(ctx.hsv);
                    b.invalidate(ctx);
                }
            }), { marginTop: 20 }),
            ColorPreview({ color: ctx.currentPreviewColor }),
            ColorPreview({ color: ctx.newPreviewColor }),
            m.TextField({
                labelText: 'red', value: ctx.rgb.r ? ctx.rgb.r.toString() : '0', onChange: (value) => {
                    let red = parseInt(value);
                    red = red ? red : 0;
                    ctx.hsv = graphics.rgbToHsv({ r: red, g: ctx.rgb.g, b: ctx.rgb.b });
                    ctx.rgb.r = red;
                    ctx.newPreviewColor = graphics.hsvToHex(ctx.hsv);
                    b.invalidate(ctx);
                }
            }),
            m.TextField({
                labelText: 'green', value: ctx.rgb.g ? ctx.rgb.g.toString() : '0', onChange: (value) => {
                    let green = parseInt(value);
                    green = green ? green : 0;
                    ctx.hsv = graphics.rgbToHsv({ r: ctx.rgb.r, g: green, b: ctx.rgb.b });
                    ctx.rgb.g = green;
                    ctx.newPreviewColor = graphics.hsvToHex(ctx.hsv);
                    b.invalidate(ctx);
                }
            }),
            m.TextField({
                labelText: 'blue', value: ctx.rgb.b ? ctx.rgb.b.toString() : '0', onChange: (value) => {
                    let blue = parseInt(value);
                    blue = blue ? blue : 0;
                    console.log(graphics.rgbToHsv({ r: ctx.rgb.r, g: ctx.rgb.g, b: blue }));
                    ctx.hsv = graphics.rgbToHsv({ r: ctx.rgb.r, g: ctx.rgb.g, b: blue });
                    ctx.rgb.b = blue;
                    ctx.newPreviewColor = graphics.hsvToHex(ctx.hsv);
                    b.invalidate(ctx);
                }
            })
        ], { padding: 10 });
    }
});
