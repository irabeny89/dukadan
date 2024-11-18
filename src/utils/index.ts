export const convertToNaira = (amount: number) =>
	`\u20A6${Intl.NumberFormat().format(amount)}`;

export const camelCaseToTitleCase = (str: string) =>
	str.replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());
