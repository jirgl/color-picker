import * as b from 'bobril';
import * as colorCalculator from './lib/colorCalculator';

function getParts(): b.IBobrilNode[] {
    const parts = [];
    for (var i = 0; i < 360; i++) {
        parts.push({
            tag: 'div', style: {
                background: colorCalculator.getColorFromHsv(i),
                width: 10,
                height: 1
            }
        });
    }

    return parts;
}

b.init(() => {
    return getParts();
});
