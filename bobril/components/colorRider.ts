import * as b from 'bobril';
import { hex, rgb, rgba } from '../../lib/colorModels';

export const riderSize = 15;
const innerRadius = riderSize / 2 - 1;
const outerRadius = 10;

export interface IColorRiderData {
    x: number;
    y: number;
    innerColor?: hex | rgb | rgba;
    outerColor: hex | rgb | rgba;
    height: number;
}

interface IColorRiderCtx extends b.IBobrilCtx {
    data: IColorRiderData;
}

function getStringValue(color: hex | rgb | rgba): string {
    let stringValue = 'transparent';
    if (typeof (color) === 'string') {
        stringValue = <hex>color;
    } else if (typeof (color) === 'object') {
        if (color['a']) {
            let rgba = <rgba>color;
            stringValue = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ', ' + rgba.a + ')';
        } else {
            let rgb = <rgb>color;
            stringValue = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
        }
    }
    return stringValue;
}

export const ColorRider = b.createComponent<IColorRiderData>({
    render(ctx: IColorRiderCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        me.children = {
            tag: 'svg',
            style: {
                width: '100%',
                height: d.height
            },
            children: [
                {
                    tag: 'circle',
                    attrs: {
                        cx: d.x,
                        cy: d.y,
                        r: outerRadius,
                        fill: 'transparent',
                        stroke: getStringValue(d.outerColor),
                        'stroke-width': riderSize / 2
                    }
                },
                {
                    tag: 'circle',
                    attrs: {
                        cx: d.x,
                        cy: d.y,
                        r: innerRadius,
                        fill: d.innerColor ? getStringValue(d.innerColor) : 'transparent',
                        stroke: 'black',
                        'stroke-width': 1
                    }
                }
            ]
        };
    }
});
