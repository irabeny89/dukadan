import { config, envVar } from "../config";

type LogT = {
	env?: "development" | "production";
	position?: "block" | "inline";
	message: string;
};

const defaultOpt: LogT = {
	env: "development",
	position: "block",
	message: "",
};

/**
 * Logs values to the terminal based on Nodejs environment - default to only `development` environment.
 *
 * @param option log arguments
 *
 * @example
 * * // default: only on `development` environment
 * * // OUTPUT: hello world
 * log("hello world")
 * * // only on `production` environment
 * * // OUTPUT: hi
 * log("hi", {env: "production"})
 * * // default: only on `development` environment and block position
 * * // OUTPUT: say what?
 * * //         hi
 * log(value: "hi", {message: "say what?"})
 * * // default: only on `development` environment
 * * // OUTPUT: say what? hi
 * log(value: "hi", {message: "say what?", position: "inline"})
 */
export default function log(
	value: unknown,
	message?: string,
	position: "block" | "inline" = "block",
	env: "development" | "production" = "development",
) {
	if (envVar.nodeEnv === env) {
		if (message) {
			if (position === "block") {
				console.log(message);
				console.log(value);
				// inline
			} else console.log(message, value);
		} else console.log(value);
	}
}
