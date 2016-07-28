import * as b from 'bobril';
import { ColorPicker } from './src/colorPicker';

b.init(() => {
    return b.styledDiv([
        b.styledDiv(ColorPicker({
            color: '#ff00ff',
            width: 300,
            onClose: () => { },
            onColorSelect: (color) => { }
        }), { padding: 30, flex: 1 }),
        b.styledDiv(ColorPicker({
            width: 300,
            onClose: () => { },
            onColorSelect: (color) => { }
        }), { padding: 30, flex: 1 }),
        b.styledDiv(ColorPicker({
            color: '#00ff00',
            hideTextfields: true,
            width: 300,
            onClose: () => { },
            onColorSelect: (color) => { }
        }), { padding: 30, flex: 1 })
    ], { display: 'flex' });
});
