import type { JWTPayloadSpec } from "@elysiajs/jwt";

export type IdAndTimestamp = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

/** paging request */
export type PageQueryT = {
  page?: number;
  /** paging max size */
  size?: number;
  order?: "asc" | "desc";
  /** Sort by column or field name */
  sort?: string;
};

/** pagination response metadata */
export type MetadataT = {
  page: number;
  pageSize: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  /** total records */
  totalItems: number;
};

export type ResponseT<D = unknown> = {
  success: boolean;
  message: string;
  data?: D;
  /** pagination metadata */
  metadata?: MetadataT;
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

export type UserRoleT = "customer" | "owner" | "admin" | "driver";

export type TokenDataT = {
  userId: number;
  username: string;
  role: UserRoleT;
};

export type Jwt = {
  readonly sign: (
    morePayload: Record<string, string | number> & JWTPayloadSpec,
  ) => Promise<string>;
  readonly verify: (
    jwt?: string,
  ) => Promise<false | (Record<string, string | number> & JWTPayloadSpec)>;
};
