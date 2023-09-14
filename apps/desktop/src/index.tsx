import { SpacedriveInterface } from '@sd/interface';
import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<StrictMode>
		<Suspense>
			<h1>Root</h1>
			<SpacedriveInterface />
		</Suspense>
	</StrictMode>
);
