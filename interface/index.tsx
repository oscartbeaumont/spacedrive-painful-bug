import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './app';
import { PlatformProvider, TestPlatformProvider } from './util/Platform';

const routes2 = createBrowserRouter(routes);
export const SpacedriveInterface = () => {
	return (
		<PlatformProvider platform={'todo'}>
			<h1>Interface</h1>
			<TestPlatformProvider name="A" />
			<RouterProvider router={routes2} />
		</PlatformProvider>
	);
};
