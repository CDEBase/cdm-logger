import typescript from '@rollup/plugin-typescript';

// Define a base configuration for reuse
const baseConfig = {
  plugins: [
    typescript({ 
      noEmitOnError: true,
      tsconfig: './tsconfig.json',
      compilerOptions: {
        module: 'ESNext',
      }
    }),
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
      name: 'CdmServerLogger',
      compact: true,
      exports: 'named',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
      chunkFileNames: 'index-[hash].js',
    },
  ],
};

// Configuration for Moleculer adapter
const moleculerConfig = {
  ...baseConfig,
  input: 'src/moleculer.ts',
  output: [
    {
      file: 'lib/moleculer/index.js',
      format: 'es',
      name: 'CdmMoleculerAdapter',
      compact: true,
      exports: 'named',
      sourcemap: true,
    },
    {
      file: 'lib/moleculer/index.cjs',
      format: 'cjs',
      name: 'CdmMoleculerAdapter',
      compact: true,
      exports: 'named',
      sourcemap: true,
      esModule: true,
    },
  ],
};

// Export an array of configurations to build both versions
export default [indexConfig, moleculerConfig];
