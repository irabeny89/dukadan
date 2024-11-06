import type { MetadataT, Paging } from "../types";

type PaginatorT = { metadata: MetadataT; data: unknown[] };

const collectPages = (pageSize: number) => {
	let pageHead = 0;
	return (pageCollections: unknown[][], item: unknown) => {
		const pageItems = pageCollections[pageHead];
		if (pageItems.length < pageSize) pageItems.push(item);
		else pageCollections[++pageHead].push(item);

		return pageCollections;
	};
};

/**
 * Generates a 2 dimensional array with list of items per page.
 * @param pageSize - number of items per page
 * @param pageCount - number of pages
 * @param list - list of items to paginate
 * @returns collection of paginated items e.g `[["item1 in page1", "item2 in page1"], ["item3 in page2", "item4 in page2"]]`
 */
const getPageCollections = (
	pageSize: number,
	pageCount: number,
	list: unknown[],
) => {
	const initialPages = Array.from({ length: pageCount }).map((e) => []);

	const pageCollections = list.reduce(collectPages(pageSize), initialPages);
	return pageCollections;
};

/**
 * Creates a paginated data and metadata from a list of items.
 * @param list - list of items to paginate.
 * @param param1 - page metadata
 * @returns paginated data and metadata
 */
export default function paginator(
	list: unknown[],
	{ page, pageSize }: Required<Pick<Paging, "page" | "pageSize">>,
): PaginatorT {
	const totalItems = list.length;
	const pageCount = Math.ceil(totalItems / pageSize);

	return {
		data: getPageCollections(pageSize, pageCount, list)[page - 1],
		metadata: {
			page,
			pageCount,
			pageSize,
			totalItems,
			hasNextPage: page < pageCount,
			hasPrevPage: pageCount !== 0 && page > 1,
		},
	};
}
