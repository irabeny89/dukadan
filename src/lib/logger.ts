import { config, envVar } from "../config";

type LogOptionT = {
	// color?: string;
	env?: "development" | "production";
};

type LogArg = {
	value: unknown;
	option?: LogOptionT;
};

const createMsg = (prev: string, arg: LogArg) => {
	// no option? return log message
	if (!arg.option) return `${prev}${arg.value} `;
	// Node environment match, consider log message color
	if (arg.option.env === (Bun.env.NODE_ENV ?? "development"))
		return `${prev}${arg.value} `;
	// for any Node enviroment, consider log message color
	return `${prev}${arg.value} `;
};

const logSingleData = (args: LogArg) => {
	// no option? return log message
	if (!args.option) console.log(args.value);
	// Node environment match, consider log message color
	else if (args.option.env === envVar.nodeEnv) console.log(args.value);
};

export default function log(args: LogArg | LogArg[]) {
	// inline log messages if list of log data was provided
	if (Array.isArray(args)) console.log(args.reduce(createMsg, ""));
	else logSingleData(args);
}
