import { useEffect, useMemo } from 'react';
import { useCountUp } from 'use-count-up';
import { proxy, useSnapshot } from 'valtio';

const counterStore = proxy({
	counterLastValue: new Map<string, number>(),
	setCounterLastValue: (name: string, lastValue: number) =>
		counterStore.counterLastValue.set(name, lastValue)
});

const useCounterState = (key: string) => {
	const { counterLastValue, setCounterLastValue } = useSnapshot(counterStore);

	return {
		lastValue: counterLastValue.get(key),
		setLastValue: setCounterLastValue
	};
};

type UseCounterProps = {
	name: string;
	start?: number;
	end: number;
	/**
	 * Duration of the counter animation in seconds
	 * default: `2s`
	 */
	duration?: number;
	/**
	 * If `true`, counter will only count up/down once per app session.
	 * default: `true`
	 */
	saveState?: boolean;
	/**
	 * Number of decimal places. Defaults to `1`.
	 */
	precision?: number;
	/**
	 * The locale to use for number formatting (e.g. `'de-DE'`).
	 * Defaults to your system locale. Passed directed into [Intl.NumberFormat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat).
	 */
	locales?: string | string[];
};

export const useCounter = ({
	name,
	start = 0,
	end,
	locales,
	duration = 2,
	precision = 1,
	saveState = true
}: UseCounterProps) => {
	const { lastValue, setLastValue } = useCounterState(name);

	if (saveState && lastValue) {
		start = lastValue;
	}

	const formatter = useMemo(
		() =>
			new Intl.NumberFormat(locales, {
				style: 'decimal',
				minimumFractionDigits: precision,
				maximumFractionDigits: precision
			}),
		[locales, precision]
	);

	const { value } = useCountUp({
		isCounting: !(start === end),
		start,
		end,
		duration,
		easing: 'easeOutCubic',
		formatter: (value) => formatter.format(value)
	});

	useEffect(() => {
		if (saveState && value == end) {
			setLastValue(name, end);
		}
	}, [end, name, saveState, setLastValue, value]);

	if (start === end) return end;

	if (saveState && lastValue && lastValue === end) return end;

	return value;
};
