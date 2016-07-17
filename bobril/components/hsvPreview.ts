import * as b from 'bobril';
import * as colorConverter from '../../lib/colorConverter';
import { hex, hsv } from '../../lib/colorModels';

const width = 200;
const height = 100;

export interface IHsvPreviewData {
    color: hex;
    onColorSelect: (selectedColor: hsv) => void;
}

interface IHsvPreviewCtx extends b.IBobrilCtx {
    data: IHsvPreviewData;
    leftOffset: number;
    topOffset: number;
}

function getLayer(background: string): b.IBobrilNode {
    return b.styledDiv(null, {
        background: background,
        position: 'absolute',
        width: width,
        height: height
    });
}

function setOffset(ctx: IHsvPreviewCtx, element: HTMLElement): void {
    ctx.leftOffset = element.offsetLeft;
    ctx.topOffset = element.offsetTop;
}

export const HsvPreview = b.createComponent<IHsvPreviewData>({
    init(ctx: IHsvPreviewCtx) {
    },
    render(ctx: IHsvPreviewCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        me.children = b.styledDiv([
            getLayer(d.color),
            getLayer('linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0))'),//saturation effect
            getLayer('linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0))')//value effect
        ], { position: 'relative', width: 100, height: 100 });
    },
    postInitDom(ctx: IHsvPreviewCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        setOffset(ctx, element);
    },
    postUpdateDom(ctx: IHsvPreviewCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        setOffset(ctx, element);
    },
    onMouseUp(ctx: IHsvPreviewCtx, event: b.IBobrilMouseEvent): boolean {
        const d = ctx.data;
        const s = event.x - ctx.leftOffset;
        const v = event.y - ctx.topOffset;

        d.onColorSelect({
            h: colorConverter.rgbToHue(colorConverter.hexToRgb(d.color)),
            s: s / width,
            v: 1 - v / height
        });

        return true;
    }
});
