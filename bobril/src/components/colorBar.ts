import * as b from 'bobril';
import * as graphics from 'jirgl-graphics';
import { ColorRider, riderSize } from './colorRider';

export interface IColorBarData {
    hue: number;
    onColorSelect: (hue: number) => void;
}

interface IColorBarCtx extends b.IBobrilCtx {
    data: IColorBarData;
    hue: number;
    position: number;
    width: number;
    touch: boolean;
    pointerId: number;
}

function updateColor(ctx: IColorBarCtx, position: number): void {
    ctx.position = position - b.nodePagePos(ctx.me)[0];
    if (ctx.position < riderSize) ctx.position = riderSize;
    if (ctx.position > ctx.width - riderSize) ctx.position = ctx.width - riderSize;

    ctx.hue = ctx.position / ctx.width * 360;
    ctx.data.onColorSelect(ctx.hue);
    b.invalidate(ctx);
}

export const ColorBar = b.createComponent<IColorBarData>({
    render(ctx: IColorBarCtx, me: b.IBobrilNode) {
        const rgb = graphics.hsvToRgb({ h: ctx.hue, s: 1, v: 1 });
        me.children = b.styledDiv([
            b.styledDiv(ColorRider({
                height: riderSize * 2,
                x: ctx.position,
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
