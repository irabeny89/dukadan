export const config = {
	appName: "Dukadan",
	version: "v1",
	semVer: "1.0.0",
	userRoles: ["customer", "driver", "admin", "owner"],
};

export const envVar = {
	nodeEnv: Bun.env.NODE_ENV ?? "development",
	port: Bun.env.PORT ?? 3000,
	secret: Bun.env.SECRET ?? "secret",
	secret2: Bun.env.SECRET2 ?? "secret",
	refreshExp: Bun.env.REFRESH_EXP ?? "1d",
	accessExp: Bun.env.ACCESS_EXP ?? "1d",
	maxOwner: Bun.env.MAX_OWNER ?? 1,
	maxAdmin: Bun.env.MAX_ADMIN ?? 1,
	maxDriver: Bun.env.MAX_DRIVER ?? 1,
};
