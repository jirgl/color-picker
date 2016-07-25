import * as b from 'bobril';
import { hsv } from 'jirgl-graphics';
import * as graphics from 'jirgl-graphics';
import { ColorRider } from './colorRider';

const height = 150;

export interface IHsvPreviewData {
    hsv: hsv;
    onColorSelect: (hsv: hsv) => void;
}

interface IHsvPreviewCtx extends b.IBobrilCtx {
    data: IHsvPreviewData;
    hsv: hsv;
    width: number;
    height: number;
    touch: boolean;
    pointerId: number;
}

function getLayer(background: string): b.IBobrilNode {
    return b.styledDiv(null, {
        background: background,
        position: 'absolute',
        width: '100%',
        height: height
    });
}

function updateColor(ctx: IHsvPreviewCtx, x: number, y: number): void {
    const nodePagePos = b.nodePagePos(ctx.me);
    let position = [x - nodePagePos[0], y - nodePagePos[1]];
    if (position[0] < 0) position[0] = 0;
    if (position[1] < 0) position[1] = 0;
    if (position[0] > ctx.width) position[0] = ctx.width;
    if (position[1] > ctx.height) position[1] = ctx.height;

    const s = position[0];
    const v = position[1];
    ctx.hsv = {
        h: ctx.data.hsv.h,
        s: s / ctx.width,
        v: 1 - v / ctx.height
    };
    ctx.data.onColorSelect(ctx.hsv);
}

export const HsvPreview = b.createComponent<IHsvPreviewData>({
    init(ctx: IHsvPreviewCtx) {
        ctx.width = ctx.height = 0;
    },
    render(ctx: IHsvPreviewCtx, me: b.IBobrilNode) {
        me.children = b.styledDiv([
            getLayer(graphics.hsvToHex({ h: ctx.data.hsv.h, s: 1, v: 1 })),
            getLayer('linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0))'),//saturation effect
            getLayer('linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0))'),//value effect
            b.styledDiv(ColorRider({
                height: ctx.height,
                x: ctx.width * ctx.data.hsv.s,
                y: ctx.height * (1 - ctx.data.hsv.v),
                outerColor: { r: 230, g: 230, b: 230, a: 0.3 }
            }), { width: '100%', position: 'absolute' })
        ], { position: 'relative', height: height });
    },
    postInitDom(ctx: IHsvPreviewCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        ctx.width = element.offsetWidth;
        ctx.height = element.offsetHeight;
        updateColor(ctx, ctx.data.hsv.s * ctx.width, ctx.data.hsv.v * height);
    },
    postUpdateDom(ctx: IHsvPreviewCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        ctx.width = element.offsetWidth;
        ctx.height = element.offsetHeight;
    },
    onPointerDown(ctx: IHsvPreviewCtx, event: b.IBobrilPointerEvent): boolean {
        if (!ctx.touch) {
            ctx.touch = true;
            updateColor(ctx, event.x, event.y);
            ctx.pointerId = event.id;
            b.registerMouseOwner(ctx);
            b.focus(ctx.me);
            return true;
        }
        return false;
    },
    onPointerMove(ctx: IHsvPreviewCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.touch && ctx.pointerId == event.id) {
            updateColor(ctx, event.x, event.y);
            return true;
        }
        return false;
    },
    onPointerUp(ctx: IHsvPreviewCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.touch && ctx.pointerId == event.id) {
            ctx.touch = false;
            b.releaseMouseOwner();
            b.invalidate(ctx);
            return true;
        }
        return false;
    },
    onPointerCancel(ctx: IHsvPreviewCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.touch && ctx.pointerId == event.id) {
            ctx.touch = false;
            b.releaseMouseOwner();
            b.invalidate(ctx);
        }
        return false;
    }
});
