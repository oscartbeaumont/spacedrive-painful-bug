import { getLayeredIcon } from '@sd/assets/util';
import clsx from 'clsx';
import { type ImgHTMLAttributes } from 'react';
import { type ObjectKindKey } from '@sd/client';

interface LayeredFileIconProps extends ImgHTMLAttributes<HTMLImageElement> {
	kind: ObjectKindKey;
	extension: string | null;
}

const SUPPORTED_ICONS = ['Document', 'Code', 'Text', 'Config'];

const positionConfig: Record<string, string> = {
	Text: 'flex h-full w-full items-center justify-center',
	Code: 'flex h-full w-full items-center justify-center',
	Config: 'flex h-full w-full items-center justify-center'
};

const LayeredFileIcon = ({ kind, extension, ...props }: LayeredFileIconProps) => {
	const iconImg = <img {...props} />;

	if (SUPPORTED_ICONS.includes(kind) === false) {
		return iconImg;
	}

	const IconComponent = extension ? getLayeredIcon(kind, extension) : null;

	const positionClass =
		positionConfig[kind] || 'flex h-full w-full items-end justify-end pb-4 pr-2';

	return IconComponent == null ? (
		iconImg
	) : (
		<div className="relative">
			{iconImg}
			<div className={clsx('absolute bottom-0 right-0', positionClass)}>
				<IconComponent viewBox="0 0 16 16" height="40%" width="40%" />
			</div>
		</div>
	);
};

export default LayeredFileIcon;
