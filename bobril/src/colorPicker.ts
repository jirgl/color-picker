import * as b from 'bobril';
import * as m from 'bobril-m';
import { hex, hsv, rgb } from 'jirgl-graphics';
import * as graphics from 'jirgl-graphics';
import { ColorPreview } from './components/colorPreview';
import { HsvPreview } from './components/hsvPreview';
import { ColorBar } from './components/colorBar';

const defaultColor = { r: 0, g: 200, b: 0 };
const baseMargin = b.styleDef({ marginLeft: 5, marginRight: 5 });

export interface IColorPickerData {
    color?: string;
    width?: number;
    onColorSelect: (string) => void;
    onClose: () => void;
}

interface IColorPickerCtx extends b.IBobrilCtx {
    data: IColorPickerData;
    hsv: hsv;
    rgb: rgb;
    currentPreviewColor: hex;
    newPreviewColor: hex;
}

function getHsvPreview(ctx: IColorPickerCtx): b.IBobrilNode {
    return b.styledDiv(HsvPreview({
        hsv: ctx.hsv,
        onColorSelect: (hsv: hsv) => {
            ctx.newPreviewColor = graphics.hsvToHex(hsv);
            ctx.hsv = hsv;
            ctx.rgb = graphics.hsvToRgb(hsv);
            b.invalidate(ctx);
        }
    }), baseMargin, { marginTop: 5 });
}

function getColorBar(ctx: IColorPickerCtx): b.IBobrilNode {
    return b.styledDiv(ColorBar({
        hue: ctx.hsv.h,
        onColorSelect: (hue: number) => {
            ctx.hsv.h = hue;
            ctx.rgb = graphics.hsvToRgb({ h: hue, s: ctx.hsv.s, v: ctx.hsv.v });
            ctx.newPreviewColor = graphics.hsvToHex(ctx.hsv);
            b.invalidate(ctx);
        }
    }), { marginTop: 20 });
}

function getRgbTextFields(ctx: IColorPickerCtx): b.IBobrilNode {
    return b.styledDiv([
        b.styledDiv(m.TextField({
            labelText: 'red', value: ctx.rgb.r ? ctx.rgb.r.toString() : '0', onChange: (value) => {
                let red = parseInt(value);
                red = red ? red : 0;
                ctx.hsv = graphics.rgbToHsv({ r: red, g: ctx.rgb.g, b: ctx.rgb.b });
                ctx.rgb.r = red;
                ctx.newPreviewColor = graphics.hsvToHex(ctx.hsv);
                b.invalidate(ctx);
            }
        }), baseMargin, { flex: 1 }),
        b.styledDiv(m.TextField({
            labelText: 'green', value: ctx.rgb.g ? ctx.rgb.g.toString() : '0', onChange: (value) => {
                let green = parseInt(value);
                green = green ? green : 0;
                ctx.hsv = graphics.rgbToHsv({ r: ctx.rgb.r, g: green, b: ctx.rgb.b });
                ctx.rgb.g = green;
                ctx.newPreviewColor = graphics.hsvToHex(ctx.hsv);
                b.invalidate(ctx);
            }
        }), baseMargin, { flex: 1 }),
        b.styledDiv(m.TextField({
            labelText: 'blue', value: ctx.rgb.b ? ctx.rgb.b.toString() : '0', onChange: (value) => {
                let blue = parseInt(value);
                blue = blue ? blue : 0;
                console.log(graphics.rgbToHsv({ r: ctx.rgb.r, g: ctx.rgb.g, b: blue }));
                ctx.hsv = graphics.rgbToHsv({ r: ctx.rgb.r, g: ctx.rgb.g, b: blue });
                ctx.rgb.b = blue;
                ctx.newPreviewColor = graphics.hsvToHex(ctx.hsv);
                b.invalidate(ctx);
            }
        }), baseMargin, { flex: 1 })
    ], { display: 'flex' });
}

function getBaseAndCurrentPreview(ctx: IColorPickerCtx): b.IBobrilNode {
    if (ctx.data.color) {
        return b.styledDiv([
            b.styledDiv(ColorPreview({ color: ctx.currentPreviewColor }), baseMargin, { flex: 1 }),
            b.styledDiv(ColorPreview({ color: ctx.newPreviewColor }), baseMargin, { flex: 1 }),
        ], { display: 'flex', marginTop: 20 });
    } else {
        return b.styledDiv(ColorPreview({ color: ctx.newPreviewColor }), baseMargin, { marginTop: 20 });
    }
}

function getButtons(ctx: IColorPickerCtx): b.IBobrilNode {
    return b.styledDiv([
        b.styledDiv(m.Button({
            children: 'cancel',
            action: ctx.data.onClose,
            type: m.ButtonType.Raised
        }), baseMargin, { display: 'inline-block', cssFloat: 'right' }),
        b.styledDiv(m.Button({
            children: 'ok',
            action: () => { ctx.data.onColorSelect(ctx.newPreviewColor) },
            type: m.ButtonType.Raised
        }), baseMargin, { display: 'inline-block', cssFloat: 'right' })
    ], { height: 40, marginTop: 20, marginBottom: 20 });
}

export const ColorPicker = b.createComponent<IColorPickerData>({
    init(ctx: IColorPickerCtx) {
        const baseColor = ctx.data.color ? graphics.hexToRgb(ctx.data.color) : defaultColor;
        ctx.rgb = baseColor;
        ctx.hsv = graphics.rgbToHsv(baseColor);
        ctx.currentPreviewColor = graphics.rgbToHex(baseColor);
        ctx.newPreviewColor = graphics.rgbToHex(baseColor);
    },
    render(ctx: IColorPickerCtx, me: b.IBobrilNode) {
        me.children = m.Paper({ zDepth: 1, style: { width: ctx.data.width || '100%' } }, [
            getHsvPreview(ctx),
            getColorBar(ctx),
            getRgbTextFields(ctx),
            getBaseAndCurrentPreview(ctx),
            getButtons(ctx)
        ]);
    }
});
