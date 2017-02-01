import { isString, isObject, isBoolean } from 'roc/validators';
import { generateDependencies, lazyFunctionRequire } from 'roc';

import config from '../config/roc.config.js';
import meta from '../config/roc.config.meta.js';

import { packageJSON } from './util';

const lazyRequire = lazyFunctionRequire(require);

export default {
    plugins: [
        require.resolve('roc-abstract-plugin-test'),
    ],
    dependencies: {
        exports: generateDependencies(packageJSON, ['expect']),
    },
    config,
    meta,
    actions: [{
        hook: 'run-test-command',
        description: 'Adds support for running tests with nyc using Webpack.',
        action: lazyRequire('../actions/test'),
    }, {
        hook: 'babel-config',
        action: lazyRequire('../actions/babel'),
    }],
    hooks: {
        'babel-config': {
            description: 'Used to create a Babel configuration to be used in the build for test.',
            initialValue: {},
            returns: isObject(),
            arguments: {
                target: {
                    validator: isString,
                    description: 'The target that is used.',
                },
                coverage: {
                    validator: isBoolean,
                    description: 'If the code should be prepared for coverage generation.',
                },
            },
        },
    },
    commands: {
        development: {
            test: {
                override: 'roc-abstract-plugin-test',
                options: {
                    grep: {
                        alias: 'g',
                        description: 'Will only run tests that match the given pattern. ' +
                            'Will be compiled to a RegExp.',
                        validator: isString,
                    },
                    watch: {
                        alias: 'w',
                        description: 'If the tests should run in watch mode.',
                        default: false,
                        validator: isBoolean,
                    },
                    coverage: {
                        description: 'If coverage reports should be generated for the code.',
                        default: undefined,
                        validator: isBoolean,
                    },
                    runtime: {
                        alias: 'r',
                        description: 'If the runtime from roc-plugin-start should be added.',
                        default: false,
                        validator: isBoolean,
                    },
                },
            },
        },
    },
};
