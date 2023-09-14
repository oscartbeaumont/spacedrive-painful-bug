import { createBrowserRouter } from 'react-router-dom';
import {
	OperatingSystem,
	Platform,
	PlatformProvider,
	routes, // TODO: This does not
	SpacedriveInterface,
	TestPlatformProvider
} from '@sd/interface';

// import { routes } from './demo'; // TODO: This works

const platform: Platform = 'I AM THE PLATFORM';

const router = createBrowserRouter(routes);

export default function App() {
	return (
		<PlatformProvider platform={platform}>
			<TestPlatformProvider name="A" />
			<SpacedriveInterface router={router} />
		</PlatformProvider>
	);
}
