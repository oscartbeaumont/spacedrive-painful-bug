import clsx from 'clsx';
import { useState } from 'react';
import { useZodForm } from '@sd/client';
import { Dialog, TextAreaField, toast, useDialog, UseDialogProps, z } from '@sd/ui';

const schema = z.object({
	feedback: z.string().min(1, { message: 'Feedback is required' }),
	emoji: z.string().emoji().max(2).optional()
});

const EMOJIS = ['🤩', '😀', '🙁', '😭'];
const FEEDBACK_URL = 'https://spacedrive.com/api/feedback';

export default function FeedbackDialog(props: UseDialogProps) {
	const form = useZodForm({ schema, mode: 'onBlur' });
	const [emojiSelected, setEmojiSelected] = useState<string | undefined>(undefined);

	const emojiSelectHandler = (index: number) => {
		if (emojiSelected === EMOJIS[index]) {
			setEmojiSelected(undefined);
			return form.setValue('emoji', undefined);
		}
		setEmojiSelected(EMOJIS[index]);
		form.setValue('emoji', EMOJIS[index] as string);
	};

	const formSubmit = form.handleSubmit(async (data) => {
		try {
			await fetch(FEEDBACK_URL, {
				method: 'POST',
				body: JSON.stringify(data),
				mode: 'no-cors'
			});
		} catch (error) {
			toast.error('There was an error submitting your feedback. Please try again.');
		}
	});

	return (
		<Dialog
			invertButtonFocus
			title="Feedback"
			dialog={useDialog(props)}
			form={form}
			onSubmit={formSubmit}
			ctaLabel="Submit"
			closeLabel="Cancel"
			buttonsSideContent={
				<div className="flex w-full items-center justify-center gap-1">
					{EMOJIS.map((emoji, i) => (
						<div
							onClick={() => emojiSelectHandler(i)}
							key={i.toString()}
							className={clsx(
								emojiSelected === emoji ? 'bg-accent' : 'bg-app-input',
								'flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-app-line transition-all duration-200 hover:scale-125'
							)}
						>
							{emoji}
						</div>
					))}
				</div>
			}
		>
			<TextAreaField
				{...form.register('feedback')}
				placeholder="Your feedback..."
				className="w-full"
			/>
		</Dialog>
	);
}
