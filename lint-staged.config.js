module.exports = {
  'packages/**/*.{ts,d.ts}': files => {
    const match = files.filter(
      file =>
        !file.includes('packages/contracts-deploy/hardhat.config.ts') &&
        !file.includes('auto-generated-code') &&
        !file.includes('daily-swaps.uniswap.thegraph-1647734400.ts') &&
        !file.includes('open-positions-data.the-graph.ts') &&
        !file.includes('uniswap-v2-tokens.json') &&
        !file.includes('coin-gecko-tokens.ts') &&
        !file.includes('packages/beta-cvi-ui/public/charting_library') &&
        !file.includes('close-positions-data.the-graph.ts'),
    )
    return [`yarn lint:code:base --fix ${match.join(' ')}`, `git add ${match.join(' ')}`]
  },
}
