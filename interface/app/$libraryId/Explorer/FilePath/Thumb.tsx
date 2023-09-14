import { getIcon, iconNames } from '@sd/assets/util';
import clsx from 'clsx';
import {
	memo,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type CSSProperties,
	type ImgHTMLAttributes,
	type RefObject,
	type VideoHTMLAttributes
} from 'react';
import { getItemFilePath, useLibraryContext, type ExplorerItem } from '@sd/client';

import { PDFViewer, TextViewer } from '~/components';
import { useCallbackToWatchResize, useIsDark } from '~/hooks';
import { pdfViewerEnabled } from '~/util/pdfViewer';
import { usePlatform } from '~/util/Platform';
import { useExplorerContext } from '../Context';
import { getExplorerStore } from '../store';
import { useExplorerItemData } from '../util';
import LayeredFileIcon from './LayeredFileIcon';
import classes from './Thumb.module.scss';

export const enum ThumbType {
	Icon = 'ICON',
	Original = 'ORIGINAL',
	Thumbnail = 'THUMBNAIL'
}

export interface ThumbProps {
	data: ExplorerItem;
	loadOriginal?: boolean;
	size?: number;
	cover?: boolean;
	frame?: boolean;
	blackBars?: boolean;
	blackBarsSize?: number;
	extension?: boolean;
	mediaControls?: boolean;
	pauseVideo?: boolean;
	className?: string;
	childClassName?: string | ((type: ThumbType | `${ThumbType}`) => string | undefined);
}

export const FileThumb = memo((props: ThumbProps) => {
	const isDark = useIsDark();
	const platform = usePlatform();

	const itemData = useExplorerItemData(props.data);
	const filePath = getItemFilePath(props.data);

	const { parent } = useExplorerContext();
	const { library } = useLibraryContext();

	const [src, setSrc] = useState<string>();
	const [loaded, setLoaded] = useState<boolean>(false);
	const [thumbType, setThumbType] = useState(ThumbType.Icon);

	const childClassName = 'max-h-full max-w-full object-contain';
	const frameClassName = clsx(
		'rounded-sm border-2 border-app-line bg-app-darkBox',
		isDark ? classes.checkers : classes.checkersLight
	);

	const onLoad = () => setLoaded(true);

	const onError = () => {
		setLoaded(false);
		setThumbType((prevThumbType) =>
			prevThumbType === ThumbType.Original && itemData.hasLocalThumbnail
				? ThumbType.Thumbnail
				: ThumbType.Icon
		);
	};

	// useLayoutEffect is required to ensure the thumbType is always updated before the onError listener can execute,
	// thus avoiding improper thumb types changes
	useLayoutEffect(() => {
		// Reset src when item changes, to allow detection of yet not updated src
		setSrc(undefined);
		setLoaded(false);

		if (props.loadOriginal) {
			setThumbType(ThumbType.Original);
		} else if (itemData.hasLocalThumbnail) {
			setThumbType(ThumbType.Thumbnail);
		} else {
			setThumbType(ThumbType.Icon);
		}
	}, [props.loadOriginal, itemData]);

	useEffect(() => {
		const locationId =
			itemData.locationId ?? (parent?.type === 'Location' ? parent.location.id : null);

		switch (thumbType) {
			case ThumbType.Original:
				if (
					locationId &&
					filePath &&
					'id' in filePath &&
					(itemData.extension !== 'pdf' || pdfViewerEnabled())
				) {
					setSrc(platform.getFileUrl(library.uuid, locationId, filePath.id));
				} else {
					setThumbType(ThumbType.Thumbnail);
				}
				break;

			case ThumbType.Thumbnail:
				if (itemData.thumbnailKey.length > 0) {
					setSrc(platform.getThumbnailUrlByThumbKey(itemData.thumbnailKey));
				} else {
					setThumbType(ThumbType.Icon);
				}
				break;

			default:
				setSrc(
					getIcon(
						itemData.isDir || parent?.type === 'Node' ? 'Folder' : itemData.kind,
						isDark,
						itemData.extension,
						itemData.isDir
					)
				);
				break;
		}
	}, [props.data.item, filePath, isDark, library.uuid, itemData, platform, thumbType, parent]);

	return (
		<div
			style={{
				...(props.size
					? { maxWidth: props.size, width: props.size, height: props.size }
					: {})
			}}
			className={clsx(
				'relative flex shrink-0 items-center justify-center',
				!loaded && 'invisible',
				!props.size && 'h-full w-full',
				props.cover && 'overflow-hidden',
				props.className
			)}
		>
			{(() => {
				if (!src) return;

				const _childClassName =
					typeof props.childClassName === 'function'
						? props.childClassName(thumbType)
						: props.childClassName;

				const className = clsx(childClassName, _childClassName);

				switch (thumbType) {
					case ThumbType.Original: {
						switch (itemData.extension === 'pdf' ? 'PDF' : itemData.kind) {
							case 'PDF':
								return (
									<PDFViewer
										src={src}
										onLoad={onLoad}
										onError={onError}
										className={clsx(
											'h-full w-full',
											className,
											props.frame && frameClassName
										)}
										crossOrigin="anonymous" // Here it is ok, because it is not a react attr
									/>
								);
							case 'Text':
							case 'Code':
							case 'Config':
								return (
									<TextViewer
										src={src}
										onLoad={onLoad}
										onError={onError}
										className={clsx(
											'textviewer-scroll h-full w-full overflow-y-auto whitespace-pre-wrap break-words px-4 font-mono',
											!props.mediaControls
												? 'overflow-hidden'
												: 'overflow-auto',
											className,
											props.frame && [frameClassName, '!bg-none p-2']
										)}
										codeExtension={
											((itemData.kind === 'Code' ||
												itemData.kind === 'Config') &&
												itemData.extension) ||
											''
										}
									/>
								);

							case 'Video':
								return (
									<Video
										src={src}
										onLoadedData={onLoad}
										onError={onError}
										paused={props.pauseVideo}
										controls={props.mediaControls}
										blackBars={props.blackBars}
										blackBarsSize={props.blackBarsSize}
										className={clsx(
											className,
											props.frame && !props.blackBars && frameClassName
										)}
									/>
								);

							case 'Audio':
								return (
									<>
										<img
											src={getIcon(
												iconNames.Audio,
												isDark,
												itemData.extension
											)}
											onLoad={onLoad}
											decoding={props.size ? 'async' : 'sync'}
											className={childClassName}
											draggable={false}
										/>
										{props.mediaControls && (
											<audio
												// Order matter for crossOrigin attr
												crossOrigin="anonymous"
												src={src}
												onError={onError}
												controls
												autoPlay
												className="absolute left-2/4 top-full w-full -translate-x-1/2 translate-y-[-150%]"
											>
												<p>Audio preview is not supported.</p>
											</audio>
										)}
									</>
								);
						}
					}

					// eslint-disable-next-line no-fallthrough
					case ThumbType.Thumbnail:
						return (
							<Thumbnail
								src={src}
								cover={props.cover}
								onLoad={onLoad}
								onError={onError}
								decoding={props.size ? 'async' : 'sync'}
								className={clsx(
									props.cover
										? [
												'min-h-full min-w-full object-cover object-center',
												_childClassName
										  ]
										: className,
									props.frame && !(itemData.kind === 'Video' && props.blackBars)
										? frameClassName
										: null
								)}
								crossOrigin={
									thumbType !== ThumbType.Original ? 'anonymous' : undefined
								} // Here it is ok, because it is not a react attr
								blackBars={
									props.blackBars && itemData.kind === 'Video' && !props.cover
								}
								blackBarsSize={props.blackBarsSize}
								extension={
									props.extension &&
									itemData.extension &&
									itemData.kind === 'Video'
										? itemData.extension
										: undefined
								}
							/>
						);

					default:
						return (
							<LayeredFileIcon
								src={src}
								kind={itemData.kind}
								extension={itemData.extension}
								onLoad={onLoad}
								onError={() => setLoaded(false)}
								decoding={props.size ? 'async' : 'sync'}
								className={className}
								draggable={false}
							/>
						);
				}
			})()}
		</div>
	);
});

interface ThumbnailProps extends ImgHTMLAttributes<HTMLImageElement> {
	cover?: boolean;
	blackBars?: boolean;
	blackBarsSize?: number;
	extension?: string;
}

const Thumbnail = memo(
	({
		crossOrigin,
		blackBars,
		blackBarsSize,
		extension,
		cover,
		className,
		...props
	}: ThumbnailProps) => {
		const ref = useRef<HTMLImageElement>(null);

		const size = useSize(ref);

		const { style: blackBarsStyle } = useBlackBars(size, blackBarsSize);

		return (
			<>
				<img
					// Order matter for crossOrigin attr
					// https://github.com/facebook/react/issues/14035#issuecomment-642227899
					{...(crossOrigin ? { crossOrigin } : {})}
					ref={ref}
					draggable={false}
					style={{ ...(blackBars ? blackBarsStyle : {}) }}
					className={clsx(blackBars && size.width === 0 && 'invisible', className)}
					{...props}
				/>

				{(cover || (size && size.width > 80)) && extension && (
					<div
						style={{
							...(!cover &&
								size && {
									marginTop: Math.floor(size.height / 2) - 2,
									marginLeft: Math.floor(size.width / 2) - 2
								})
						}}
						className={clsx(
							'absolute rounded bg-black/60 px-1 py-0.5 text-[9px] font-semibold uppercase text-white opacity-70',
							cover
								? 'bottom-1 right-1'
								: 'left-1/2 top-1/2 -translate-x-full -translate-y-full'
						)}
					>
						{extension}
					</div>
				)}
			</>
		);
	}
);

interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
	paused?: boolean;
	blackBars?: boolean;
	blackBarsSize?: number;
}

const Video = memo(({ paused, blackBars, blackBarsSize, className, ...props }: VideoProps) => {
	const ref = useRef<HTMLVideoElement>(null);

	const size = useSize(ref);
	const { style: blackBarsStyle } = useBlackBars(size, blackBarsSize);

	useEffect(() => {
		if (!ref.current) return;
		paused ? ref.current.pause() : ref.current.play();
	}, [paused]);

	return (
		<video
			// Order matter for crossOrigin attr
			crossOrigin="anonymous"
			ref={ref}
			autoPlay={!paused}
			onVolumeChange={(e) => {
				const video = e.target as HTMLVideoElement;
				getExplorerStore().mediaPlayerVolume = video.volume;
			}}
			onCanPlay={(e) => {
				const video = e.target as HTMLVideoElement;
				// Why not use the element's attribute? Because React...
				// https://github.com/facebook/react/issues/10389
				video.loop = !props.controls;
				video.muted = !props.controls;
				video.volume = getExplorerStore().mediaPlayerVolume;
			}}
			playsInline
			draggable={false}
			style={{ ...(blackBars ? blackBarsStyle : {}) }}
			className={clsx(blackBars && size.width === 0 && 'invisible', className)}
			{...props}
		>
			<p>Video preview is not supported.</p>
		</video>
	);
});

const useSize = (ref: RefObject<Element>) => {
	const [size, setSize] = useState({ width: 0, height: 0 });

	useCallbackToWatchResize(({ width, height }) => setSize({ width, height }), [], ref);

	return size;
};

const useBlackBars = (videoSize: { width: number; height: number }, blackBarsSize?: number) => {
	return useMemo(() => {
		const { width, height } = videoSize;

		const orientation = height > width ? 'vertical' : 'horizontal';

		const barSize =
			blackBarsSize ||
			Math.floor(Math.ceil(orientation === 'vertical' ? height : width) / 10);

		const xBarSize = orientation === 'vertical' ? barSize : 0;
		const yBarSize = orientation === 'horizontal' ? barSize : 0;

		return {
			size: {
				x: xBarSize,
				y: yBarSize
			},
			style: {
				borderLeftWidth: xBarSize,
				borderRightWidth: xBarSize,
				borderTopWidth: yBarSize,
				borderBottomWidth: yBarSize,
				borderColor: 'black',
				borderRadius: 4
			} satisfies CSSProperties
		};
	}, [videoSize, blackBarsSize]);
};
