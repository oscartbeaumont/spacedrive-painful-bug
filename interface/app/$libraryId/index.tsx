import type { RouteObject } from 'react-router-dom';

import { Component as B } from './404';
import { Component as C } from './overview';
import { Component as E } from './PageLayout';
import settingsRoutes from './settings';
import { Component as A } from './settings/Layout';
import { Component as D } from './TopBar/Layout';

// Routes that should be contained within the standard Page layout
const pageRoutes: RouteObject = {
	// lazy: () => import('./PageLayout'),
	element: <E />,
	children: [
		{
			path: 'overview',
			// lazy: () => import('./overview')
			element: <C />
		}
		// { path: 'people', lazy: () => import('./people') },
		// { path: 'media', lazy: () => import('./media') },
		// { path: 'spaces', lazy: () => import('./spaces') },
		// { path: 'debug', lazy: () => import('./debug') },
		// { path: 'spacedrop', lazy: () => import('./spacedrop') },
		// { path: 'sync', lazy: () => import('./sync') }
	]
};

// Routes that render the explorer and don't need padding and stuff
// provided by PageLayout
const explorerRoutes: RouteObject[] = [
	// { path: 'location/:id', lazy: () => import('./location/$id') },
	// { path: 'node/:id', lazy: () => import('./node/$id') },
	// { path: 'tag/:id', lazy: () => import('./tag/$id') },
	// { path: 'ephemeral/:id', lazy: () => import('./ephemeral') },
	// { path: 'search', lazy: () => import('./search') }
];

// Routes that should render with the top bar - pretty much everything except
// 404 and settings
const topBarRoutes: RouteObject = {
	// lazy: () => import('./TopBar/Layout'),
	element: <D />,
	children: [pageRoutes, ...explorerRoutes]
};

export default [
	topBarRoutes
	// {
	// 	path: 'settings',
	// 	element: <A />, //// () => import('./settings/Layout'),
	// 	children: settingsRoutes
	// },
	// { path: '*', element: <B /> } //lazy: () => import('./404') }
] satisfies RouteObject[];
