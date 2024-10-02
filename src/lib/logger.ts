type MessageT = {
	position?: "block" | "inline";
	text: string;
};

type LogT = {
	env?: "development" | "production";
	message?: MessageT;
};

const defaultArgs: LogT = {
	env: "development",
	message: { position: "block", text: "" },
};

/**
 * Logs values to the terminal based on Nodejs environment - default to only `development` environment.
 *
 * @param args log arguments
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
 * log(value: "hi", {message: {text: "say what?"}})
 * * // default: only on `development` environment
 * * // OUTPUT: say what? hi
 * log({value: "hi", message: {text: "say what?", position: "inline"}})
 */
export default function log(value: unknown, args: LogT = defaultArgs) {
	if (Bun.env.NODE_ENV === args.env) {
		if (args.message) {
			if (args.message.position === "block") {
				console.log(args.message.text);
				console.log(value);
				// inline
			} else console.log(args.message.text, value);
		} else console.log(value);
	}
}
