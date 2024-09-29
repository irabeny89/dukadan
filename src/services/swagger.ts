/** @module plugin setup
 * Plugins setup configurations
 */

import { swagger } from "@elysiajs/swagger";
import { config } from "../config";

// ? docs path `/api/swagger` by default
// ? more info: https://elysiajs.com/plugins/swagger
export const swaggerConfig = swagger({
	documentation: {
		tags: [
			{ name: "Auth", description: "Authentication & Authorization Endpoints" },
		],
		info: {
			title: "Dukadan API Documentations",
			version: config.semVer,
		},
	},
});
