import type { MetadataT, PageQueryT } from "../types";

export const convertToNaira = (amount: number) =>
  `\u20A6${Intl.NumberFormat().format(amount)}`;

export const convertValuesToNaira =
  <T>(keys: (keyof T)[]) =>
  (data: T) => {
    let updatedData = { ...data };

    for (const key of keys) {
      const value = data[key];

      if (typeof value !== "number") continue;

      const nairaValue = value / 100;
      updatedData = { ...updatedData, [key]: nairaValue };
    }

    return updatedData;
  };

export const camelCaseToTitleCase = (str: string) =>
  str.replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());

export const snakeCaseToCamelCase = (str: string) =>
  str
    .split("_")
    .map((e, i) => (i === 0 || !e ? e : e[0].toUpperCase() + e.slice(1)))
    .join("");

export const createTitleFromObjectKeys = (object: object) =>
  object instanceof Object ? Object.keys(object).map(camelCaseToTitleCase) : [];

export const createMetadata = (
  totalItems: number,
  page: number,
  pageSize: number,
): MetadataT => {
  const pageCount = Math.ceil(totalItems / pageSize);
  return {
    page,
    pageCount,
    pageSize,
    totalItems,
    hasNextPage: page < pageCount,
    hasPrevPage: pageCount !== 0 && page > 1,
  };
};

export const preparePageQuery = (query?: PageQueryT) => {
  const q: PageQueryT = query ?? {};
  q.order ||= "desc";
  q.page ||= 1;
  q.size ||= 10;
  q.sort = q.sort ? snakeCaseToCamelCase(q.sort) : "createdAt";

  return q as Required<PageQueryT>;
};
