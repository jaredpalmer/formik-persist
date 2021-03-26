import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';

import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import uglify from 'rollup-plugin-uglify';

const shared = {
  entry: `compiled/index.js`,
  sourceMap: true,
  external: ['react', 'formik', 'prop-types', 'lodash.isequal'],
  globals: {
    react: 'React',
    formik: 'formik',
    'prop-types': 'PropTypes',
    'lodash.isequal': 'lodash.isequal',
  },
  exports: 'named',
};

export default [
  Object.assign({}, shared, {
    moduleName: 'FormikRemember',
    format: 'umd',
    dest: 'dist/index.umd.js',
    plugins: [
      resolve(),
      commonjs({
        include: /node_modules/,
      }),
      sourceMaps(),
      filesize(),
      uglify(),
    ],
  }),

  Object.assign({}, shared, {
    targets: [
      { dest: 'dist/index.es6.js', format: 'es' },
      { dest: 'dist/index.js', format: 'cjs' },
    ],
    plugins: [
      resolve(),
      commonjs({
        include: /node_modules/,
      }),
      sourceMaps(),
    ],
  }),
];
