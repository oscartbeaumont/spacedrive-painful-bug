import { defaultContext } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, RouterProviderProps } from 'react-router-dom';

import { TestPlatformProvider } from './util/Platform';

export * from './app';
export * from './util/Platform';

export const SpacedriveInterface = (props: { router: RouterProviderProps['router'] }) => {
	return (
		<>
			<TestPlatformProvider name="D" />
			<ReactQueryDevtools
				position="bottom-right"
				context={defaultContext}
				toggleButtonProps={{
					tabIndex: -1
				}}
			/>
			<RouterProvider router={props.router} />
		</>
	);
};
