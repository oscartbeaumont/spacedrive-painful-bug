import { createContext, useContext, type PropsWithChildren } from 'react';

export type OperatingSystem = 'browser' | 'linux' | 'macOS' | 'windows' | 'unknown';

// Platform represents the underlying native layer the app is running on.
// This could be Tauri or web.
export type Platform = string;

// Keep this private and use through helpers below
const context = createContext<Platform>(undefined!);

// @ts-expect-error
globalThis.thisIsFucked = undefined;

// is a hook which allows you to fetch information about the current platform from the React context.
export function usePlatform(): Platform {
	const ctx = useContext(context);
	if (!ctx) {
		console.error("The 'PlatformProvider' ctx is not working!");
	}
	// 	throw new Error(
	// 		"The 'PlatformProvider' has not been mounted above the current 'usePlatform' call."
	// 	);

	// return ctx;

	// @ts-expect-error
	return globalThis.thisIsFucked;
}

// provides the platform context to the rest of the app through React context.
// Mount it near the top of your component tree.
export function PlatformProvider({
	platform,
	children
}: PropsWithChildren<{ platform: Platform }>) {
	console.log('MOUNTED `PlatformProvider`');
	// @ts-expect-error
	globalThis.thisIsFucked = platform;

	return <context.Provider value={platform}>{children}</context.Provider>;
}

PlatformProvider.displayName = 'PlatformProvider';

export function useHasPlatformProvider({ name }: any) {
	console.log('FUCK', typeof useContext, typeof context);
	const ctx = useContext(context);
	console.log(name, ctx);
}

export function TestPlatformProvider({ name }: { name: string }) {
	useHasPlatformProvider({ name });

	return null;
}
