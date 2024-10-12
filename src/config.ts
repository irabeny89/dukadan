import { Setting, type SettingT } from "./models/setting.model";

// default setting
export const setting: SettingT = {
	maxOwner: 1,
	maxAdmin: 2,
	maxDriver: 2,
	deliveryFee: 1e5, // sub unit for 1000
	pricePerKg: 1e5, // sub unit for 1000
};

const settings = Setting.findAll();
if (settings.length) {
	const { deliveryFee, maxAdmin, maxDriver, maxOwner, pricePerKg } =
		settings[0];
	setting.deliveryFee = deliveryFee;
	setting.maxAdmin = maxAdmin;
	setting.maxDriver = maxDriver;
	setting.maxOwner = maxOwner;
	setting.pricePerKg = pricePerKg;
}

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
};
