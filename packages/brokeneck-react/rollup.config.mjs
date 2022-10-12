import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonJs from '@rollup/plugin-commonjs'
import peerDeps from 'rollup-plugin-peer-deps-external'

import pkg from './package.json' assert { type: "json" };

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'default'
    },
    {
      file: pkg.module,
      format: 'esm'
    }
  ],
  plugins: [
    nodeResolve(),
    peerDeps({
      includeDependencies: true
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: /node_modules/
    }),
    commonJs()
  ],
  external: [/@babel\/runtime/]
}
