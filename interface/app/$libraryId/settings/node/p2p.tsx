import { Input, Switch } from '@sd/ui';

import { Heading } from '../Layout';
import Setting from '../Setting';

export const Component = () => {
	return (
		<>
			<Heading
				title="P2P Settings"
				description="Manage how this node communicates with other nodes."
			/>

			<Setting
				mini
				title="Enable Node Discovery"
				description="Allow or block this node from calling an external server to assist in forming a peer-to-peer connection. "
			>
				<Switch checked />
			</Setting>

			<Setting
				title="Discovery Server"
				description="Configuration server to aid with establishing peer-to-peer to connections between nodes over the internet. Disabling will result in nodes only being accessible over LAN and direct IP connections."
			>
				<div className="mt-1 flex flex-col">
					<Input className="grow" disabled defaultValue="https://p2p.spacedrive.com" />
					<div className="mt-1 flex justify-end">
						<a className="p-1 text-sm font-bold text-accent hover:text-accent">
							Change
						</a>
					</div>
				</div>
			</Setting>
		</>
	);
};
