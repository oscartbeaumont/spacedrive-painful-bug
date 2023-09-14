import { hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { dialog, invoke, os, shell } from '@tauri-apps/api';
import { confirm } from '@tauri-apps/api/dialog';
import { homeDir } from '@tauri-apps/api/path';
import { useEffect } from 'react';
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

import * as commands from './commands';
import demoData from './demoData.json';

async function getOs(): Promise<OperatingSystem> {
	switch (await os.type()) {
		case 'Linux':
			return 'linux';
		case 'Windows_NT':
			return 'windows';
		case 'Darwin':
			return 'macOS';
		default:
			return 'unknown';
	}
}

const platform: Platform = {
	platform: 'tauri',
	getThumbnailUrlByThumbKey: (keyParts) => 'todo',
	getFileUrl: (libraryId, locationLocalId, filePathId) => 'todo',
	openLink: shell.open,
	getOs,
	openDirectoryPickerDialog: () => dialog.open({ directory: true }),
	openFilePickerDialog: () => dialog.open(),
	saveFilePickerDialog: (opts) => dialog.save(opts),
	showDevtools: () => invoke('show_devtools'),
	confirm: (msg, cb) => confirm(msg).then(cb),
	userHomeDir: homeDir,
	...commands
};

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			networkMode: 'always'
		},
		mutations: {
			networkMode: 'always'
		}
	}
});

const router = createBrowserRouter(routes);

export default function App() {
	useEffect(() => {
		// This tells Tauri to show the current window because it's finished loading
		commands.appReady();
	}, []);

	useEffect(() => {
		hydrate(queryClient, demoData);
	}, []);

	return (
		<PlatformProvider platform={platform}>
			<TestPlatformProvider name="A" />
			<QueryClientProvider client={queryClient}>
				<TestPlatformProvider name="B" />
				<AppInner />
			</QueryClientProvider>
		</PlatformProvider>
	);
}

// This is required because `ErrorPage` uses the OS which comes from `PlatformProvider`
function AppInner() {
	return (
		<>
			<TestPlatformProvider name="C" />
			<SpacedriveInterface router={router} />
		</>
	);
}
