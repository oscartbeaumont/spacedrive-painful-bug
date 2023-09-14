import { Button, Form, RadioGroupField } from '@sd/ui';

import { shareTelemetry, useOnboardingContext } from './context';
import { OnboardingContainer, OnboardingDescription, OnboardingTitle } from './Layout';

export default function OnboardingPrivacy() {
	const { forms, submit } = useOnboardingContext();

	const form = forms.useForm('privacy');

	return (
		<Form
			form={form}
			onSubmit={form.handleSubmit(submit)}
			className="flex flex-col items-center"
		>
			<OnboardingContainer>
				<OnboardingTitle>Your Privacy</OnboardingTitle>
				<OnboardingDescription>
					Spacedrive is built for privacy, that's why we're open source and local first.
					So we'll make it very clear what data is shared with us.
				</OnboardingDescription>
				<div className="m-4">
					<RadioGroupField.Root {...form.register('shareTelemetry')}>
						{shareTelemetry.options.map(({ value, heading, description }) => (
							<RadioGroupField.Item key={value} value={value}>
								<h1 className="font-bold">{heading}</h1>
								<p className="text-sm text-ink-faint">{description}</p>
							</RadioGroupField.Item>
						))}
					</RadioGroupField.Root>
				</div>
				<Button type="submit" className="text-center" variant="accent" size="sm">
					Continue
				</Button>
			</OnboardingContainer>
		</Form>
	);
}
