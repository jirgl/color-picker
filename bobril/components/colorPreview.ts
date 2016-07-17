import * as b from 'bobril';
import { hex } from '../../lib/colorModels';

export interface IColorPreviewData {
    color: hex;
}

export const ColorPreview = (data: IColorPreviewData) => {
    return b.styledDiv(null, { background: data.color, width: 30, height: 30 });
}
