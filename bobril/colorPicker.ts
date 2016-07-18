import * as b from 'bobril';
import { hex, hsv } from '../lib/colorModels';
import * as colorConverter from '../lib/colorConverter';
import { ColorPreview } from './components/colorPreview';
import { HsvPreview } from './components/hsvPreview';
import { ColorBar } from './components/colorBar';

export interface IColorPickerData {
}

interface IColorPickerCtx extends b.IBobrilCtx {
    data: IColorPickerData;
    selectedHexColor: hex;
    selectedHsvColor: hsv;
}

export const ColorPicker = b.createComponent<IColorPickerData>({
    init(ctx: IColorPickerCtx) {
    },
    render(ctx: IColorPickerCtx, me: b.IBobrilNode) {
        me.children = b.styledDiv([
            b.styledDiv(HsvPreview({
                color: ctx.selectedHexColor, onColorSelect: (hsv: hsv) => {
                    ctx.selectedHsvColor = hsv;
                    b.invalidate(ctx);
                }
            }), { marginLeft: 5, marginRight: 5 }),
            b.styledDiv(ColorBar({
                onColorSelect: (hex: hex) => {
                    ctx.selectedHexColor = hex;
                    if (ctx.selectedHsvColor)
                        ctx.selectedHsvColor.h = colorConverter.rgbToHue(colorConverter.hexToRgb(hex));
                    b.invalidate(ctx);
                }
            }), { marginTop: 20 }),
            ctx.selectedHsvColor && ColorPreview({ color: colorConverter.hsvToHex(ctx.selectedHsvColor) })
        ], { padding: 10 });
    }
});
