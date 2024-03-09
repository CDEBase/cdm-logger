import typescript from '@rollup/plugin-typescript';

// Define a base configuration for reuse
const baseConfig = {
  plugins: [
    typescript({ noEmitOnError: true }),
  ],
  // marking all node modules as external
  external: (id) => !/^[./]/.test(id),
};

// Configuration for index.ts
const indexConfig = {
  ...baseConfig,
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
};


// Export an array of configurations to build both versions
export default [indexConfig];
