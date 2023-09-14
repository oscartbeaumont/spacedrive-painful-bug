import { FolderNotchOpen } from '@phosphor-icons/react';
import { useEffect, type PropsWithChildren, type ReactNode } from 'react';
import { useLibrarySubscription } from '@sd/client';

import { TOP_BAR_HEIGHT } from '../TopBar';
import { useExplorerContext } from './Context';
import ContextMenu from './ContextMenu';
import DismissibleNotice from './DismissibleNotice';
import { Inspector, INSPECTOR_WIDTH } from './Inspector';
import ExplorerContextMenu from './ParentContextMenu';
import { useExplorerStore } from './store';
import { useExplorerSearchParams } from './util';
import View, { EmptyNotice, ExplorerViewProps } from './View';

interface Props {
	emptyNotice?: ExplorerViewProps['emptyNotice'];
	contextMenu?: () => ReactNode;
}

/**
 * This component is used in a few routes and acts as the reference demonstration of how to combine
 * all the elements of the explorer except for the context, which must be used in the parent component.
 */
export default function Explorer(props: PropsWithChildren<Props>) {
	const explorerStore = useExplorerStore();
	const explorer = useExplorerContext();

	// Can we put this somewhere else -_-
	useLibrarySubscription(['jobs.newThumbnail'], {
		onStarted: () => {
			console.log('Started RSPC subscription new thumbnail');
		},
		onError: (err) => {
			console.error('Error in RSPC subscription new thumbnail', err);
		},
		onData: (thumbKey) => {
			explorerStore.addNewThumbnail(thumbKey);
		}
	});

	return (
		<>
			<ExplorerContextMenu>
				<div className="flex-1 overflow-hidden">
					<div
						ref={explorer.scrollRef}
						className="custom-scroll explorer-scroll h-screen overflow-x-hidden"
						style={{
							paddingTop: TOP_BAR_HEIGHT,
							paddingRight: explorerStore.showInspector ? INSPECTOR_WIDTH : 0
						}}
					>
						{explorer.items && explorer.items.length > 0 && <DismissibleNotice />}

						<View
							contextMenu={props.contextMenu ? props.contextMenu() : <ContextMenu />}
							emptyNotice={
								props.emptyNotice ?? (
									<EmptyNotice
										icon={FolderNotchOpen}
										message="This folder is empty"
									/>
								)
							}
						/>
					</div>
				</div>
			</ExplorerContextMenu>

			{explorerStore.showInspector && (
				<Inspector
					className="no-scrollbar absolute inset-y-0 right-1.5 pb-3 pl-3 pr-1.5"
					style={{ paddingTop: TOP_BAR_HEIGHT + 12 }}
				/>
			)}
		</>
	);
}
