import * as b from 'bobril';
import { hex, hsv } from '../lib/colorModels';
import * as colorConverter from '../lib/colorConverter';
import { ColorPreview } from './components/colorPreview';
import { HsvPreview } from './components/hsvPreview';
import { ColorBar } from './components/colorBar';

const defaultColor = { h: 115, s: 1, v: 1 };

export interface IColorPickerData {
}

interface IColorPickerCtx extends b.IBobrilCtx {
    data: IColorPickerData;
    hue: number;
    currentPreviewColor: hex;
    newPreviewColor: hex;
}

export const ColorPicker = b.createComponent<IColorPickerData>({
    init(ctx: IColorPickerCtx) {
        ctx.hue = defaultColor.h;
        ctx.currentPreviewColor = colorConverter.hsvToHex(defaultColor);
        ctx.newPreviewColor = colorConverter.hsvToHex(defaultColor);
    },
    render(ctx: IColorPickerCtx, me: b.IBobrilNode) {
        me.children = b.styledDiv([
            b.styledDiv(HsvPreview({
                hsv: { h: ctx.hue, s: 1, v: 1 },
                onColorSelect: (hsv: hsv) => {
                    ctx.newPreviewColor = colorConverter.hsvToHex(hsv);
                    b.invalidate(ctx);
                }
            }), { marginLeft: 5, marginRight: 5 }),
            b.styledDiv(ColorBar({
                hue: ctx.hue,
                onColorSelect: (hue: number) => {
                    ctx.hue = hue;
                    b.invalidate(ctx);
                }
            }), { marginTop: 20 }),
            ColorPreview({ color: ctx.currentPreviewColor }),
            ColorPreview({ color: ctx.newPreviewColor })
        ], { padding: 10 });
    }
});
