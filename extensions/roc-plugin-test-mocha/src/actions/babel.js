export default ({ context: { config: { settings } } }) => (target, coverage) => {
    if (settings.build.mode === 'test' && target === 'node' && coverage) {
        return (babelConfig) => {
            // eslint-disable-next-line
            babelConfig.env.test = {
                ...babelConfig.env.test,
                plugins: [
                    [require.resolve('babel-plugin-istanbul'), {
                        include: `${settings.test.node.src.path}/**/*.js`,
                    }],
                    ...((babelConfig.env.test || {}).plugins || []),
                ],
            };

            return babelConfig;
        };
    }

    return undefined;
};
