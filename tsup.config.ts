import { type Options, defineConfig } from 'tsup'

export default defineConfig((options: Options) => ({
	entry: [
		'src',
		'src/**/*.ts',
		'!src/**/*.spec.ts',
		'!src/**/*.sql',
		'!prisma',
		'!src/repositories/prisma',
	],
	dts: true,
	format: 'esm',
	outDir: './build',
	...options,
}))
