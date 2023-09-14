import { RouterProvider, RouterProviderProps } from 'react-router-dom';

import { TestPlatformProvider } from './util/Platform';

export * from './app';
export * from './util/Platform';

export const SpacedriveInterface = (props: { router: RouterProviderProps['router'] }) => {
	return (
		<>
			<TestPlatformProvider name="D" />
			<RouterProvider router={props.router} />
		</>
	);
};
