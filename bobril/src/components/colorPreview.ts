import * as b from 'bobril';
import { hex } from 'jirgl-graphics';

export interface IColorPreviewData {
    color: hex;
}

export const ColorPreview = (data: IColorPreviewData) => {
    return b.styledDiv(null, { background: data.color, width: '100%', height: 30 });
}
