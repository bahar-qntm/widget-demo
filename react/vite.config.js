import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isWidget = mode === 'widget';
  
  return {
    plugins: [react()],
    root: '.',
    base: isWidget ? './' : '/',
    build: {
      outDir: 'dist',
      lib: isWidget ? {
        entry: resolve(__dirname, 'src/index.umd.js'),
        name: 'MagicWidget',
        fileName: (format) => `magic-widget.umd.js`,
        formats: ['umd']
      } : undefined,
      rollupOptions: isWidget ? {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM'
          }
        }
      } : {
        input: {
          main: resolve(__dirname, 'public/demo.html')
        }
      },
      sourcemap: true,
      minify: isWidget ? false : 'esbuild'
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    },
    server: {
      port: 3001,
      open: '/demo.html'
    },
    esbuild: {
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment'
    }
  };
});
