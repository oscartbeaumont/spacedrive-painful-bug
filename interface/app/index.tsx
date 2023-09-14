import { Navigate, type RouteObject } from 'react-router-dom';
import { useHasPlatformProvider } from '~/util/Platform';

const Index = () => {
	return <Navigate to={`/demo`} replace />;
};

function DoTheThing() {
	console.log('DoTheThing');
	useHasPlatformProvider({ name: 'DoTheThing' });

	return null;
}

export const routes = [
	{
		children: [
			{
				index: true,
				element: <Index />
			},
			{
				path: '*',
				element: <DoTheThing />
			}
		]
	}
] satisfies RouteObject[];
