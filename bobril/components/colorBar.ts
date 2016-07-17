import * as b from 'bobril';
import { hex } from '../../lib/colorModels';
import * as colorConverter from '../../lib/colorConverter';

interface IColorData {
    hue: number;
    onColorSelect: (hex: hex) => void;
}

interface IColorCtx extends b.IBobrilCtx {
    data: IColorData;
    hex: hex;
}

const Color = b.createComponent<IColorData>({
    init(ctx: IColorCtx) {
        ctx.hex = colorConverter.hsvToHex({ h: ctx.data.hue, s: 1, v: 1 });
    },
    render(ctx: IColorCtx, me: b.IBobrilNode) {
        me.style = {
            background: ctx.hex,
            width: 1,
            height: 10,
            display: 'inline-block'
        };
    },
    onMouseUp(ctx: IColorCtx, event: b.IBobrilMouseEvent): boolean {
        ctx.data.onColorSelect(ctx.hex)

        return true;
    }
});

export interface IColorBarData {
    onColorSelect: (hex: hex) => void;
}

interface IColorBarCtx extends b.IBobrilCtx {
    data: IColorBarData;
}

function getBar(data: IColorBarData): b.IBobrilNode[] {
    const colors = [];
    for (var i = 0; i < 360; i++) {
        colors.push(Color({ hue: i, onColorSelect: data.onColorSelect }));
    }

    return colors;
}

export const ColorBar = b.createComponent<IColorBarData>({
    init(ctx: IColorBarCtx) {
    },
    render(ctx: IColorBarCtx, me: b.IBobrilNode) {
        me.children = getBar(ctx.data);//todo need optimalization
    }
});
