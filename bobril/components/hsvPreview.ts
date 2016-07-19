import * as b from 'bobril';
import { ColorRider, riderSize } from './colorRider';
import * as colorConverter from '../../lib/colorConverter';
import { hex, hsv } from '../../lib/colorModels';

const height = 150;

export interface IHsvPreviewData {
    hsv: hsv;
    onColorSelect: (hsv: hsv) => void;
}

interface IHsvPreviewCtx extends b.IBobrilCtx {
    data: IHsvPreviewData;
    hsv: hsv;
    position: [number, number];
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
    ctx.position[0] = x - nodePagePos[0];
    ctx.position[1] = y - nodePagePos[1];
    if (ctx.position[0] < 0) ctx.position[0] = 0;
    if (ctx.position[1] < 0) ctx.position[1] = 0;
    if (ctx.position[0] > ctx.width) ctx.position[0] = ctx.width;
    if (ctx.position[1] > ctx.height) ctx.position[1] = ctx.height;

    const s = ctx.position[0];
    const v = ctx.position[1];
    ctx.hsv = {
        h: ctx.data.hsv.h,
        s: s / ctx.width,
        v: 1 - v / ctx.height
    };
    ctx.data.onColorSelect(ctx.hsv);
    b.invalidate(ctx);
}

export const HsvPreview = b.createComponent<IHsvPreviewData>({
    init(ctx: IHsvPreviewCtx) {
        ctx.position = [0, 0];
    },
    render(ctx: IHsvPreviewCtx, me: b.IBobrilNode) {
        me.children = b.styledDiv([
            getLayer(colorConverter.hsvToHex(ctx.data.hsv)),
            getLayer('linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0))'),//saturation effect
            getLayer('linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0))'),//value effect
            b.styledDiv(ColorRider({
                height: ctx.height,
                x: ctx.position[0],
                y: ctx.position[1],
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
