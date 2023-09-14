import { Button, Card, GridLayout, SearchInput } from '@sd/ui';

import { Heading } from '../Layout';

// extensions should cache their logos in the app data folder
interface ExtensionItemData {
	name: string;
	uuid: string;
	platforms: ['windows' | 'macOS' | 'linux'];
	installed: boolean;
	description: string;
	logoUri: string;
}

const extensions: ExtensionItemData[] = [
	{
		name: 'Apple Photos',
		uuid: 'com.apple.photos',
		installed: true,
		platforms: ['macOS'],
		description: 'Import photos and videos with metadata from Apple Photos.',
		logoUri: 'https://apple.com/apple-logo.png'
	},
	{
		name: 'Twitch VOD Archiver',
		uuid: 'com.apple.photos',
		installed: false,
		platforms: ['macOS'],
		description: 'Apple Photos is a photo management application for Mac.',
		logoUri: 'https://apple.com/apple-logo.png'
	},
	{
		name: 'Shared Clipboard',
		uuid: 'com.apple.photos',
		installed: false,
		platforms: ['macOS'],
		description: 'Apple Photos is a photo management application for Mac.',
		logoUri: 'https://apple.com/apple-logo.png'
	}
];

function ExtensionItem(props: { extension: ExtensionItemData }) {
	const { installed, name, description } = props.extension;

	return (
		<Card className="flex-col">
			<h3 className="mt-2 text-sm font-bold">{name}</h3>
			<p className="my-1 text-xs text-gray-300">{description}</p>
			<div className="grow" />
			<Button size="sm" className="my-2" variant={installed ? 'gray' : 'accent'}>
				{installed ? 'Installed' : 'Install'}
			</Button>
		</Card>
	);
}

export const Component = () => {
	// const { data: volumes } = useBridgeQuery('GetVolumes');

	return (
		<>
			<Heading
				title="Extensions"
				description="Install extensions to extend the functionality of this client."
				rightArea={<SearchInput className="mt-1.5" placeholder="Search extensions" />}
			/>

			<GridLayout>
				{extensions.map((extension) => (
					<ExtensionItem key={extension.uuid} extension={extension} />
				))}
			</GridLayout>
		</>
	);
};
