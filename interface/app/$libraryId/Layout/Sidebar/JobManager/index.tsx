import { useQueryClient } from '@tanstack/react-query';
import { Check, Trash, X } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { useBridgeQuery, useJobProgress, useLibraryMutation } from '@sd/client';
import { Button, PopoverClose, toast, Tooltip } from '@sd/ui';

import IsRunningJob from './IsRunningJob';
import JobGroup from './JobGroup';

export function JobManager() {
	const queryClient = useQueryClient();
	const [toggleConfirmation, setToggleConfirmation] = useState(false);

	const jobGroupsById = useBridgeQuery(['jobs.reports']);

	// TODO: Currently we're only clustering togheter all job reports from all libraries without any distinction.
	// TODO: We should probably cluster them by library in the job manager UI
	const jobGroups = useMemo(() => {
		if (!jobGroupsById.data) return [];
		return Object.values(jobGroupsById.data).flat();
	}, [jobGroupsById.data]);

	const progress = useJobProgress(jobGroups);

	const clearAllJobs = useLibraryMutation(['jobs.clearAll'], {
		onError: () => {
			toast.error({
				title: 'Error',
				body: 'Failed to clear all jobs.'
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['jobs.reports ']);
			setToggleConfirmation((t) => !t);
			toast.success({
				title: 'Success',
				body: 'All jobs have been cleared.'
			});
		}
	});

	const clearAllJobsHandler = () => {
		clearAllJobs.mutate(null);
	};

	return (
		<div className="h-full overflow-hidden pb-10">
			<div className="z-20 flex h-9 w-full items-center rounded-t-md border-b border-app-line/50 bg-app-button/30 px-2">
				<span className=" ml-1.5 font-medium">Recent Jobs</span>
				<div className="grow" />
				{toggleConfirmation ? (
					<div className="flex h-[85%] w-fit items-center justify-center gap-2 rounded-md border border-app-line bg-app/40 px-2">
						<p className="text-[10px]">Are you sure?</p>
						<PopoverClose asChild>
							<Check
								onClick={clearAllJobsHandler}
								className="h-3 w-3 transition-opacity duration-300 hover:opacity-70"
								color="white"
							/>
						</PopoverClose>
						<X
							className="h-3 w-3 transition-opacity hover:opacity-70"
							onClick={() => setToggleConfirmation((t) => !t)}
						/>
					</div>
				) : (
					<Button
						className="opacity-70"
						onClick={() => setToggleConfirmation((t) => !t)}
						size="icon"
					>
						<Tooltip label="Clear out finished jobs">
							<Trash className="h-4 w-4" />
						</Tooltip>
					</Button>
				)}
				<PopoverClose asChild>
					<Button className="opacity-70" size="icon">
						<Tooltip label="Close">
							<X className="h-4 w-4" />
						</Tooltip>
					</Button>
				</PopoverClose>
			</div>
			<div className="custom-scroll job-manager-scroll h-full overflow-x-hidden">
				<div className="h-full border-r border-app-line/50">
					{jobGroups.length === 0 ? (
						<div className="flex h-32 items-center justify-center text-sidebar-inkDull">
							No jobs.
						</div>
					) : (
						jobGroups.map((group) => (
							<JobGroup key={group.id} group={group} progress={progress} />
						))
					)}
				</div>
			</div>
		</div>
	);
}

export { IsRunningJob };
