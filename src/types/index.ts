export type IdAndTimestamp = {
	id: string;
	createdAt: string;
	updatedAt: string;
};

/** paging request */
export type Paging = {
	/** cursor start point */
	cursor?: string;
	/** paging max size */
	size?: number;
	order?: "asc" | "desc";
	sortBy?: string;
};

/** pagination response metadata */
export type Metadata = {
	startCursor: string;
	endCursor: string;
	hasNext: boolean;
	hasPrevious: boolean;
	/** paging max size */
	size: number;
	/** total records */
	totalItems: number;
};

export type ResponseT<D = unknown> = {
	success: boolean;
	message: string;
	data?: D;
	/** pagination metadata */
	metadata?: Metadata;
};

type ErrorExpected = {
	type: string;
	message: string;
	error: {
		schema: { [k: string]: string };
	};
};

type ErrorItem = {
	summary: string;
	type: number;
	schema: { [k: string]: string };
	path: string;
	value: string;
	message: string;
};

export type ErrorT = {
	type: string;
	on: string;
	summary: string;
	property: string;
	message: string;
	expected: ErrorExpected;
	found: { [k: string]: string };
	errors: ErrorItem[];
};
