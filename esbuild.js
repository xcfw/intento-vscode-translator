const esbuild = require('esbuild');

async function build() {
  try {
    await esbuild.build({
      entryPoints: ['extension.js'],
      bundle: true,
      outfile: 'dist/build.js',
      platform: 'node',
      target: 'node22',
      external: ['vscode'],
      format: 'cjs',
      sourcemap: true,
      minify: true,
    });
    console.log('Build successful!');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build();