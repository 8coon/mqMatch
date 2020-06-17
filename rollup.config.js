import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
const path = require('path');

export default {
	input: './src/index.ts',
	output: [{
		format: 'umd',
		name: 'mqMatch',
		file: 'dist/mqMatch.js'
	}],
	plugins: [
		typescript({
			tsconfig: path.resolve(__dirname, 'tsconfig.lib.json'),
			include: '**/*.{ts,js}',
			tsconfigOverride: {
				compilerOptions: {
					declaration: false,
					emitDeclarationOnly: false,
				}
			}
		}),
		commonjs({
			include: 'node_modules/**',  // Default: undefined
		}),
		nodeResolve({
			browser: true
		}),
	],
	perf: true,

};
