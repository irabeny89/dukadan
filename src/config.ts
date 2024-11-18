import { Setting, type SettingT } from "./models/setting.model";

export const config = {
	appName: "Dukadan",
	version: "v1",
	semVer: "1.0.0",
	userRoles: ["customer", "driver", "admin", "owner"],
};

export const getEnv = () => ({
	nodeEnv: Bun.env.NODE_ENV ?? "development",
	port: Bun.env.PORT ?? 3000,
	secret: Bun.env.SECRET ?? "secret",
	secret2: Bun.env.SECRET2 ?? "secret2",
	refreshExp: +(Bun.env.REFRESH_EXP ?? 24 * 60 * 60),
	accessExp: +(Bun.env.ACCESS_EXP ?? 24 * 60 * 60),
	sqliteStore: Bun.env.SQLITE_STORE ?? "./db/dukadan.sqlite",
	maxOwner: +(Bun.env.MAX_OWNER ?? 1),
	maxAdmin: +(Bun.env.MAX_ADMIN ?? 2),
	maxDriver: +(Bun.env.MAX_DRIVER ?? 2),
	deliveryFee: +(Bun.env.DELIVERY_FEE ?? 1000),
	pricePerKg: +(Bun.env.PRICE_PER_KG ?? 1500),
});

export const getSettings = () => {
	const envVar = getEnv();
	// default setting
	const setting: SettingT = {
		maxOwner: envVar.maxOwner,
		maxAdmin: envVar.maxAdmin,
		maxDriver: envVar.maxDriver,
		deliveryFee: envVar.deliveryFee,
		pricePerKg: envVar.pricePerKg,
	};

	const _setting = Setting.findAll();
	// if settings already exist on db then update default
	if (_setting.length) {
		const { deliveryFee, maxAdmin, maxDriver, maxOwner, pricePerKg } =
			_setting[0];
		setting.deliveryFee = deliveryFee;
		setting.maxAdmin = maxAdmin;
		setting.maxDriver = maxDriver;
		setting.maxOwner = maxOwner;
		setting.pricePerKg = pricePerKg;
	}

	return setting;
};
