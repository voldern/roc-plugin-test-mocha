import path from 'path';

import { executeSyncExit, initLog } from 'roc';
import rimraf from 'rimraf';

const log = initLog();

const nyc = require.resolve('nyc/bin/nyc');
const mocha = require.resolve('mocha/bin/mocha');

const getGrep = (grep) => (grep ? ` --grep ${grep}` : '');
const coverageCommand = `${nyc} --reporter=text-summary`;
const getCompiler = (coverage) => path.resolve(__dirname, './utils/', coverage ?
    'babel-register-coverage' : 'babel-register-plain');
const getWatch = (watch) => (watch ? '--watch' : '');

const mochaCommand = (artifact, grep, coverage, watch = false) => `${mocha} ` +
    `--compilers js:${getCompiler(coverage)}` +
    `${getGrep(grep)} ${getWatch(watch)} ${artifact}`;

const getCommand = (artifact, grep, coverage, watch = false) => (coverage ?
    `${coverageCommand} ${mochaCommand(artifact, grep, true)}` :
    mochaCommand(artifact, grep, false, watch));

const cleanupCoverage = () => rimraf.sync(path.join(process.cwd(), '.nyc_output'));

export default function nycRunner({ grep, watch, coverage }) {
    if (watch) {
        if (coverage) {
            log.small.info('Coverage is not available in watch mode for roc-plugin-test-mocha.');
        }

        executeSyncExit(getCommand('tests/**/*.js', grep, false, true));
    } else {
        executeSyncExit(getCommand('tests/**/*.js', grep, coverage));

        if (coverage) {
            executeSyncExit(`${nyc} report --report-dir coverage/nyc/html --reporter=html`);
            executeSyncExit(`${nyc} report --report-dir coverage/nyc/cobertura --reporter=cobertura`);
            cleanupCoverage();
        }
    }
}
