// Dynamic Expo config for multiple apps (Citizen & Driver) in one repo.
// Switches based on process.env.APP_TYPE.

const APP_TYPE = process.env.APP_TYPE ?? "citizen";

const isCitizen = APP_TYPE === "citizen";
const isDriver = APP_TYPE === "driver";

// TODO: Replace these with your real identifiers before store submission.
const IOS_BUNDLE_CITIZEN = "com.yourcompany.rofgcdc.citizen";
const IOS_BUNDLE_DRIVER = "com.yourcompany.rofgcdc.driver";
const ANDROID_PACKAGE_CITIZEN = "com.yourcompany.rofgcdc.citizen";
const ANDROID_PACKAGE_DRIVER = "com.yourcompany.rofgcdc.driver";

function getRouterRoot() {
  if (isDriver) return "./src/app/Driver-app";
  // Default to citizen app
  return "./src/app/Citizen-app";
}

export default function ({ config }) {
  const appName = isDriver ? "ROFGCDC Driver" : "ROFGCDC Citizen";
  const slug = isDriver ? "rofgcdc-driver" : "rofgcdc-citizen";
  const scheme = isDriver ? "rofgcdcdriver" : "rofgcdccitizen";

  return {
    // Start from any base config (e.g. app.json) and override as needed.
    ...config,
    name: appName,
    slug,
    scheme,
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",

    icon: "./assets/images/icon.png",

    ios: {
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: isDriver ? IOS_BUNDLE_DRIVER : IOS_BUNDLE_CITIZEN,
    },

    android: {
      ...config.android,
      package: isDriver ? ANDROID_PACKAGE_DRIVER : ANDROID_PACKAGE_CITIZEN,
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },

    web: {
      ...config.web,
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      [
        "expo-router",
        {
          // Key: point Expo Router to the chosen app root.
          root: getRouterRoot(),
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      ...config.extra,
      appType: APP_TYPE,
    },
  };
}

