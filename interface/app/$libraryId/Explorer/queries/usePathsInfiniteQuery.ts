import { useInfiniteQuery } from '@tanstack/react-query';
import {
	ExplorerItem,
	FilePathCursorVariant,
	FilePathObjectCursor,
	FilePathOrder,
	FilePathSearchArgs,
	useRspcLibraryContext
} from '@sd/client';

import { getExplorerStore } from '../store';
import { UseExplorerInfiniteQueryArgs } from './useExplorerInfiniteQuery';

export function usePathsInfiniteQuery({
	library,
	arg,
	settings,
	...args
}: UseExplorerInfiniteQueryArgs<FilePathSearchArgs, FilePathOrder>) {
	const ctx = useRspcLibraryContext();
	const explorerSettings = settings.useSettingsSnapshot();

	if (explorerSettings.order) {
		arg.orderAndPagination = { orderOnly: explorerSettings.order };
	}

	return useInfiniteQuery({
		queryKey: ['search.paths', { library_id: library.uuid, arg }] as const,
		queryFn: ({ pageParam, queryKey: [_, { arg }] }) => {
			const cItem: Extract<ExplorerItem, { type: 'Path' }> = pageParam;
			const { order } = explorerSettings;

			let orderAndPagination: (typeof arg)['orderAndPagination'];

			if (!cItem) {
				if (order) orderAndPagination = { orderOnly: order };
			} else {
				let variant: FilePathCursorVariant | undefined;

				if (!order) variant = 'none';
				else if (cItem) {
					switch (order.field) {
						case 'name': {
							const data = cItem.item.name;
							if (data !== null)
								variant = {
									name: {
										order: order.value,
										data
									}
								};
							break;
						}
						case 'dateCreated': {
							const data = cItem.item.date_created;
							if (data !== null)
								variant = {
									dateCreated: {
										order: order.value,
										data
									}
								};
							break;
						}
						case 'dateModified': {
							const data = cItem.item.date_modified;
							if (data !== null)
								variant = {
									dateModified: {
										order: order.value,
										data
									}
								};
							break;
						}
						case 'dateIndexed': {
							const data = cItem.item.date_indexed;
							if (data !== null)
								variant = {
									dateIndexed: {
										order: order.value,
										data
									}
								};
							break;
						}
						case 'object': {
							const object = cItem.item.object;
							if (!object) break;

							let objectCursor: FilePathObjectCursor | undefined;

							switch (order.value.field) {
								case 'dateAccessed': {
									const data = object.date_accessed;
									if (data !== null)
										objectCursor = {
											dateAccessed: {
												order: order.value.value,
												data
											}
										};
									break;
								}
								case 'kind': {
									const data = object.kind;
									if (data !== null)
										objectCursor = {
											kind: {
												order: order.value.value,
												data
											}
										};
									break;
								}
							}

							if (objectCursor)
								variant = {
									object: objectCursor
								};

							break;
						}
					}
				}

				if (cItem.item.is_dir === null) throw new Error();

				if (variant)
					orderAndPagination = {
						cursor: { cursor: { variant, isDir: cItem.item.is_dir }, id: cItem.item.id }
					};
			}

			arg.orderAndPagination = orderAndPagination;

			return ctx.client.query(['search.paths', arg]);
		},
		getNextPageParam: (lastPage) => {
			if (lastPage.items.length < arg.take) return undefined;
			else return lastPage.items[arg.take - 1];
		},
		onSuccess: () => getExplorerStore().resetNewThumbnails(),
		...args
	});
}
