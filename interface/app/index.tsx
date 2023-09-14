import { useMemo } from 'react';
import { Navigate, Outlet, useMatches, type RouteObject } from 'react-router-dom';
import { currentLibraryCache, useCachedLibraries, useInvalidateQuery } from '@sd/client';
import { Dialogs, Toaster } from '@sd/ui';
import { RouterErrorBoundary } from '~/ErrorFallback';
import { useKeybindHandler, useTheme } from '~/hooks';

import libraryRoutes from './$libraryId';
import onboardingRoutes from './onboarding';
import { RootContext } from './RootContext';

import './style.scss';

import { Component as B } from './$libraryId/Layout';
// NOTE: all route `Layout`s below should contain
// the `usePlausiblePageViewMonitor` hook, as early as possible (ideally within the layout itself).
// the hook should only be included if there's a valid `ClientContext` (so not onboarding)

import { Component as A } from './onboarding/Layout';

const Index = () => {
	const libraries = useCachedLibraries();

	if (libraries.status !== 'success') return null;

	if (libraries.data.length === 0) return <Navigate to="onboarding" replace />;

	const currentLibrary = libraries.data.find((l) => l.uuid === currentLibraryCache.id);

	const libraryId = currentLibrary ? currentLibrary.uuid : libraries.data[0]?.uuid;

	return <Navigate to={`${libraryId}/overview`} replace />;
};

const Wrapper = () => {
	useKeybindHandler();
	useInvalidateQuery();
	useTheme();

	const rawPath = useRawRoutePath();

	return (
		<RootContext.Provider value={{ rawPath }}>
			<Outlet />
			<Dialogs />
			<Toaster position="bottom-right" expand={true} />
		</RootContext.Provider>
	);
};

export const routes = [
	{
		// element: <Wrapper />,
		Component: Wrapper,
		errorElement: <RouterErrorBoundary />,
		children: [
			{
				index: true,
				element: <Index />
			},
			{
				path: 'onboarding',
				element: <A />, //() => import('./onboarding/Layout'),
				children: onboardingRoutes
			},
			{
				path: ':libraryId',
				element: <B />, // () => import('./$libraryId/Layout'),
				children: libraryRoutes
			}
		]
	}
] satisfies RouteObject[];

/**
 * Combines the `path` segments of the current route into a single string.
 * This is useful for things like analytics, where we want the route path
 * but not the values used in the route params.
 */
const useRawRoutePath = () => {
	// `useMatches` returns a list of each matched RouteObject,
	// we grab the last one as it contains all previous route segments.
	const lastMatchId = useMatches().slice(-1)[0]?.id;

	const rawPath = useMemo(() => {
		const [rawPath] =
			lastMatchId
				// Gets a list of the index of each route segment
				?.split('-')
				?.map((s) => parseInt(s))
				// Gets the route object for each segment and appends the `path`, if there is one
				?.reduce(
					([rawPath, { children }], path) => {
						// No `children`, nowhere to go
						if (!children) return [rawPath, { children }] as any;

						const item = children[path]!;

						// No `path`, continue without adding to path
						if (!('path' in item)) return [rawPath, item];

						// `path` found, chuck it on the end
						return [`${rawPath}/${item.path}`, item];
					},
					['' as string, { children: routes }] as const
				) ?? [];

		return rawPath ?? '/';
	}, [lastMatchId]);

	return rawPath;
};
