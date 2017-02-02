import { appendSettings } from 'roc';

import { invokeHook } from '../../roc/util';

// eslint-disable-next-line
require('roc/runtime/register');

export default function (coverage) {
    // Enforce test
    process.env.NODE_ENV = 'test';

    appendSettings({ build: { mode: 'test' } });

    const babelConfig = invokeHook('babel-config', 'node', coverage);

    // eslint-disable-next-line
    require('babel-register')(babelConfig);
}
