import initSettings from "../models/settings";

export const _INIT_SETTINGS = async () => {

  try {
    const _settings = await initSettings.findOne();

    if (!_settings) {
      await initSettings.create({
        controlAmount: {
          WBTC: "0.5",
          USDC: "200",
          USDT: "200",
          WKCS: "200"
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
}