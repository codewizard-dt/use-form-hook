import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import postcss from "rollup-plugin-postcss";
import postcssImport from "postcss-import";
import autoprefixer from "autoprefixer";
import json from '@rollup/plugin-json'
import packageJson from './package.json' with { type: "json" }

export default [
  {
    input: ['src/index.ts'],
    output: {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    external: [
      'react',
      'react-dom',
      'lodash',
      'path',
      'axios'
    ],
    plugins: [
      resolve(),
      commonjs(),
      json(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      postcss({
        plugins: [postcssImport(), autoprefixer()],
      }),
    ],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [resolve(), dts()],
    external: [/\.(css|less|scss|sass)$/],
  },
]