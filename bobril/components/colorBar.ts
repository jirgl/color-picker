import * as b from 'bobril';
import { hex } from '../../lib/colorModels';
import * as colorConverter from '../../lib/colorConverter';

const riderSize = 15;
const defaultPosition = riderSize;
const defaultHex = '#ff0000';

export interface IColorBarData {
    onColorSelect: (hex: hex) => void;
}

interface IColorBarCtx extends b.IBobrilCtx {
    data: IColorBarData;
    hex: hex;
    position: number;
    width: number;
    touch: boolean;
    pointerId: number;
}

function updateColor(ctx: IColorBarCtx, position: number): void {
    ctx.position = position - b.nodePagePos(ctx.me)[0];
    if (ctx.position < riderSize) ctx.position = riderSize;
    if (ctx.position > ctx.width - riderSize) ctx.position = ctx.width - riderSize;

    ctx.hex = colorConverter.hsvToHex({ h: ctx.position / ctx.width * 360, s: 1, v: 1 });
    ctx.data.onColorSelect(ctx.hex);
    b.invalidate(ctx);
}

export const ColorBar = b.createComponent<IColorBarData>({
    init(ctx: IColorBarCtx) {
        ctx.position = defaultPosition;
        ctx.hex = defaultHex;
    },
    render(ctx: IColorBarCtx, me: b.IBobrilNode) {
        const rgb = colorConverter.hexToRgb(ctx.hex);
        me.children = b.styledDiv([
            {
                tag: 'svg',
                style: {
                    width: '100%',
                    height: riderSize * 2,
                    position: 'absolute',
                    top: -12
                },
                children: [
                    {
                        tag: 'circle',
                        attrs: {
                            cx: ctx.position,
                            cy: riderSize,
                            r: riderSize,
                            fill: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.3)'
                        }
                    },
                    {
                        tag: 'circle',
                        attrs: {
                            cx: ctx.position,
                            cy: riderSize,
                            r: riderSize / 2 - 1,
                            fill: ctx.hex
                        }
                    }
                ]
            },
            b.styledDiv(null, {
                background: 'linear-gradient(to right, ' +
                'rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, ' +
                'rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)',
                height: 5,
                marginTop: 10,
                marginBottom: 10,
                marginLeft: riderSize,
                marginRight: riderSize
            })
        ], { position: 'relative' });
    },
    postInitDom(ctx: IColorBarCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        ctx.width = element.offsetWidth;
        updateColor(ctx, ctx.position);
    },
    postUpdateDom(ctx: IColorBarCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        ctx.width = element.offsetWidth;
    },
    onPointerDown(ctx: IColorBarCtx, event: b.IBobrilPointerEvent): boolean {
        if (!ctx.touch) {
            ctx.touch = true;
            updateColor(ctx, event.x);
            ctx.pointerId = event.id;
            b.registerMouseOwner(ctx);
            b.focus(ctx.me);
            return true;
        }
        return false;
    },
    onPointerMove(ctx: IColorBarCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.touch && ctx.pointerId == event.id) {
            updateColor(ctx, event.x);
            return true;
        }
        return false;
    },
    onPointerUp(ctx: IColorBarCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.touch && ctx.pointerId == event.id) {
            ctx.touch = false;
            b.releaseMouseOwner();
            b.invalidate(ctx);
            return true;
        }
        return false;
    },
    onPointerCancel(ctx: IColorBarCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.touch && ctx.pointerId == event.id) {
            ctx.touch = false;
            b.releaseMouseOwner();
            b.invalidate(ctx);
        }
        return false;
    }
});
