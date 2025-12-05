import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'lib',
      format: 'es',
      name: 'Counter',
      compact: true,
      exports: 'named',
      sourcemap: true,
      preserveModules: true,
      chunkFileNames: 'index-[hash].[format].js',
    },
  ],
  plugins: [
    typescript({ noEmitOnError: true }),
  ],
  // marking all node modules as external
  external: (id) => !/^[./]/.test(id),
};
