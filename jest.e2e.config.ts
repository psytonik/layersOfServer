import type {Config} from '@jest/types';
/// configuration for end to end tests
const config:Config.InitialOptions = {
	verbose:true,
	preset: 'ts-jest',
	// rootDir: './tests',
	testRegex: '.e2e-spec.ts$',
};

export default config;