const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = function() {
	const rules = [
		{
			test: /\.tsx?$/,
			use: [
				{
					loader: 'awesome-typescript-loader',
					options: {
						useBabel: true,
						babelCore: "@babel/core",
						useCache: true,
						configFileName: 'tsconfig.demo.json',
					}
				},
			]
		},
		{
			test: /\.css$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						modules: true,
					}
				},
			],
		}
	];

	const resolve = {
		extensions: ['.tsx', '.ts', '.js'],
	};

	return {
		module: {rules},
		resolve,

		entry: {
			'demo.bundle': './demo/src/index.tsx',
		},

		plugins: [
			new HtmlWebpackPlugin({
				scriptLoading: 'defer',
				title: 'mqMatch | Demo'
			}),
			new CopyPlugin({
				patterns: [
					{
						from: path.resolve(__dirname, 'dist'),
						to: path.resolve(__dirname, 'public/dist'),
					}
				],
			}),
		],

		output: {
			path: path.resolve(__dirname, 'public'),
			filename: '[name].js',
		},
	};
};
