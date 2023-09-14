import clsx from 'clsx';

import { MacTrafficLights } from '~/components';
import { useOperatingSystem } from '~/hooks';
import Contents from './Contents';
import Footer from './Footer';
import { macOnly } from './helpers';
import LibrariesDropdown from './LibrariesDropdown';

export default () => {
	const os = useOperatingSystem();
	const showControls = window.location.search.includes('showControls');

	return (
		<div
			className={clsx(
				'relative flex min-h-full w-44 shrink-0 grow-0 flex-col gap-2.5 border-r border-sidebar-divider bg-sidebar px-2.5 pb-2 pt-2.5',
				macOnly(os, 'bg-opacity-[0.65]')
			)}
		>
			{showControls && <MacTrafficLights className="absolute left-[13px] top-[13px] z-50" />}
			{os === 'macOS' && <div data-tauri-drag-region className="h-5 w-full" />}
			<LibrariesDropdown />
			<Contents />
			<Footer />
		</div>
	);
};
