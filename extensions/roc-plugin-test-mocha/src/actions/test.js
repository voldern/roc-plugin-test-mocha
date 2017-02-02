import { appendSettings } from 'roc';

import nycRunner from '../nyc';

export default () => (targets, { grep, watch, coverage }) => {
    if (targets.find((target) => target === 'node')) {
        // By default set coverage to true in non-watch
        const cover = coverage === undefined ? !watch : coverage;

        appendSettings({ build: { mode: 'test' } });

        nycRunner({ grep, watch, coverage: cover });
    }

    return undefined;
};
