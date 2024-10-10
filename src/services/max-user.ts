import Elysia from "elysia";
import { Owner } from "../models/owner";
import type { ResponseT, UserRoleT } from "../types";

/**
 * Return forbidden error when existing users exceed max count value.
 */
export const maxUser = new Elysia({ name: "max-user" }).macro(
	({ onBeforeHandle }) => ({
		maxUser(args: [count: number, role: UserRoleT]) {
			const [count, role] = args;

			const errData: ResponseT = {
				success: false,
				message: "Maximum account created already.",
			};

			const resTemplate: {
				[k: string]: () => ResponseT | undefined;
			} = {
				owner: (): ResponseT | undefined => {
					const ownersCount = Owner.findAll().length;
					if (ownersCount >= count) return errData;
				},
				// admin: (): ResponseT | undefined => {
				//   if (Admin.findAll().length >= count) return errData
				// },
				// driver: () => {
				//   if (Driver.findAll().length >= count) return errData
				// }
			};

			onBeforeHandle(({ error }) => {
				if (role in resTemplate) {
					const errData = resTemplate[role]();
					if (errData) return error("Forbidden", errData);
				}
			});
		},
	}),
);
