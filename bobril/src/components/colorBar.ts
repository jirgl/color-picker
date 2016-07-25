import * as b from 'bobril';
import * as graphics from 'jirgl-graphics';
import { ColorRider, riderSize } from './colorRider';

export interface IColorBarData {
    hue: number;
    onColorSelect: (hue: number) => void;
}

interface IColorBarCtx extends b.IBobrilCtx {
    data: IColorBarData;
    width: number;
    touch: boolean;
    pointerId: number;
}

function getPosition(ctx: IColorBarCtx): number {
    let position = ctx.data.hue / 360 * ctx.width;
    if (position < riderSize) position = riderSize;
    if (position > ctx.width - riderSize) position = ctx.width - riderSize;
    return position;
}

function updateColor(ctx: IColorBarCtx, position: number): void {
    ctx.data.onColorSelect(position / ctx.width * 360);
}

export const ColorBar = b.createComponent<IColorBarData>({
    render(ctx: IColorBarCtx, me: b.IBobrilNode) {
        const rgb = graphics.hsvToRgb({ h: ctx.data.hue, s: 1, v: 1 });
        me.children = b.styledDiv([
            b.styledDiv(ColorRider({
                height: riderSize * 2,
                x: getPosition(ctx),
                y: riderSize,
                innerColor: rgb,
                outerColor: { r: rgb.r, g: rgb.g, b: rgb.b, a: 0.3 }
            }), { width: '100%', position: 'absolute', top: -12 }),
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
        updateColor(ctx, ctx.data.hue / 360 * ctx.width);
    },
    postUpdateDom(ctx: IColorBarCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        ctx.width = element.offsetWidth;
    },
    onPointerDown(ctx: IColorBarCtx, event: b.IBobrilPointerEvent): boolean {
        if (!ctx.touch) {
            ctx.touch = true;
            updateColor(ctx, event.x - b.nodePagePos(ctx.me)[0]);
            ctx.pointerId = event.id;
            b.registerMouseOwner(ctx);
            b.focus(ctx.me);
            return true;
        }
        return false;
    },
    onPointerMove(ctx: IColorBarCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.touch && ctx.pointerId == event.id) {
            updateColor(ctx, event.x - b.nodePagePos(ctx.me)[0]);
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
