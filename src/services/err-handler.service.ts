import type {
	InternalServerError,
	InvalidCookieSignature,
	NotFoundError,
	ParseError,
	TSchema,
	ValidationError,
} from "elysia";
import { getEnv } from "../config";
import log from "../lib/logger";
import type { ResponseT } from "../types";

type ErrorT =
	| Readonly<Error>
	| Readonly<ValidationError>
	| Readonly<NotFoundError>
	| Readonly<ParseError>
	| Readonly<InternalServerError>
	| Readonly<InvalidCookieSignature>;
type CodeT =
	| "NOT_FOUND"
	| "VALIDATION"
	| "UNKNOWN"
	| "PARSE"
	| "INTERNAL_SERVER_ERROR"
	| "INVALID_COOKIE_SIGNATURE";

const envVar = getEnv();

const NOT_PROD = envVar.nodeEnv !== "production";

const error5xx = {
	success: false,
	message: "Something went wrong.",
};

const transformValidErr = (
	err:
		| {
				summary: undefined;
		  }
		| {
				summary: string;
				type: unknown;
				schema: TSchema;
				path: string;
				value: unknown;
				message: string;
		  },
) => {
	const pathAndValue: Partial<Record<"path" | "value", unknown>> = {};
	if ("path" in err) pathAndValue.path = err.path.replace("/", "");
	if ("value" in err) pathAndValue.value = err.value;
	return {
		summary: err.summary,
		...pathAndValue,
	};
};

const handleInvalidCookieSignature = (error: ErrorT) => (): ResponseT => {
	log({
		value: `<handleInvalidCookieSignature>:: ${error}`,
		option: { env: "development" },
	});

	return error5xx;
};

const handleValidation = (error: ErrorT) => (): ResponseT => {
	log({
		value: `<handleValidation>:: ${error}`,
		option: { env: "development" },
	});

	const errors = (error as ValidationError).all.map(transformValidErr);

	return {
		success: false,
		message: JSON.stringify(errors),
	};
};

const handleNotFound = (error: ErrorT) => (): ResponseT => {
	log({
		value: `<handleNotFound>:: ${error}`,
		option: { env: "development" },
	});

	return {
		success: false,
		message: "Not Found :(",
	};
};

const handleInternalServer = (error: ErrorT) => (): ResponseT => {
	log({
		value: `<handleInternalServer>:: ${error}`,
		option: { env: "development" },
	});

	return error5xx;
};

const handleUnknown = (error: ErrorT) => (): ResponseT => {
	log({
		value: `<handleUnknown>:: ${error}`,
		option: { env: "development" },
	});

	return error5xx;
};

const handleParse = (error: ErrorT) => (): ResponseT => {
	log({
		value: `<handleParse>:: ${error}`,
		option: { env: "development" },
	});

	return error5xx;
};

export function handleErr(error: ErrorT, code: CodeT) {
	// TODO: log to file - "errors"
	const errResponse = {
		UNKNOWN: handleUnknown(error),
		PARSE: handleParse(error),
		INTERNAL_SERVER_ERROR: handleInternalServer(error),
		INVALID_COOKIE_SIGNATURE: handleInvalidCookieSignature(error),
		NOT_FOUND: handleNotFound(error),
		VALIDATION: handleValidation(error),
	};

	return code in errResponse ? errResponse[code]() : handleUnknown(error)();
}
