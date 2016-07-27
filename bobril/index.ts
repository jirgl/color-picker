import * as b from 'bobril';
import { ColorPicker } from './src/colorPicker';

b.init(() => {
    return b.styledDiv(ColorPicker({
        color: '#ff00ff',
        width: 300,
        onClose: () => { },
        onColorSelect: (color) => { }
    }), { padding: 30 });
});
