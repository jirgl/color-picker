import * as b from 'bobril';
import { hsv } from '../lib/colorModels';
import * as colorConverter from '../lib/colorConverter';
import { ColorPreview } from './components/colorPreview';
import { HsvPreview } from './components/hsvPreview';

export interface IColorPickerData {
}

interface IColorPickerCtx extends b.IBobrilCtx {
    data: IColorPickerData;
    selectedHsvColor: hsv;
}

export const ColorPicker = b.createComponent<IColorPickerData>({
    init(ctx: IColorPickerCtx) {
    },
    render(ctx: IColorPickerCtx, me: b.IBobrilNode) {
        me.children = [
            HsvPreview({
                color: '#00ff00', onColorSelect: (hsv: hsv) => {
                    ctx.selectedHsvColor = hsv;
                    b.invalidate(ctx);
                }
            }),
            ctx.selectedHsvColor && ColorPreview({ color: colorConverter.hsvToHex(ctx.selectedHsvColor) })
        ]
    }
});
