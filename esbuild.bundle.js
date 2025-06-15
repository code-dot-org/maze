import * as esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

for await (const format of ['esm', 'cjs']) {
  await esbuild.build({
    format: format,
    outdir: './dist',
    outExtension: {
      '.js': format === 'cjs' ? '.cjs' : '.js',
    },
    entryPoints: [
      'src/index.ts',
    ],
    external: [
      "./*",
    ],
    platform: 'node',
    bundle: true,
    plugins: [
      nodeExternalsPlugin({
        packagePath: 'package.json',
      }),
    ],
  });
}
