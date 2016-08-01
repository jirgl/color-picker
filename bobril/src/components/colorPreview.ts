import * as b from 'bobril';
import { hex } from 'jirgl-graphics';

export interface IColorPreviewData {
    color: hex;
    onClick?: () => void;
}

interface IColorPreviewCtx extends b.IBobrilCtx {
    data: IColorPreviewData;
    showPointer: boolean;
}

export const ColorPreview = b.createComponent<IColorPreviewData>({
    init(ctx: IColorPreviewCtx) {
        ctx.showPointer = false;
    },
    render(ctx: IColorPreviewCtx, me: b.IBobrilNode) {
        me.children = b.styledDiv(null, {
            background: ctx.data.color,
            cursor: ctx.showPointer ? 'pointer' : 'default',
            width: '100%',
            height: 30
        });
    },
    onMouseEnter(ctx: IColorPreviewCtx, event: b.IBobrilMouseEvent) {
        if (ctx.data.onClick) {
            ctx.showPointer = true;
            b.invalidate(ctx);
        }
    },
    onMouseLeave(ctx: IColorPreviewCtx, event: b.IBobrilMouseEvent) {
        if (ctx.data.onClick) {
            ctx.showPointer = false;
            b.invalidate(ctx);
        }
    },
    onPointerUp(ctx: IColorPreviewCtx, event: b.IBobrilPointerEvent) {
        if (ctx.data.onClick) ctx.data.onClick();
        return true;
    }
});
