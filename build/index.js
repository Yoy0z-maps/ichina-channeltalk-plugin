"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
// Constants for ChannelIO Configuration
const CHANNEL_TALK_CONFIG = {
    IOS: {
        PRIVACY_SETTINGS: [
            {
                key: "Privacy - Camera Usage Description",
                value: "Accessing to camera in order to provide better user experience",
            },
            {
                key: "Privacy - Photo Library Additions Usage Description",
                value: "Accessing to photo library in order to save photos",
            },
            {
                key: "Privacy - Microphone Usage Description",
                value: "Accessing to microphone to record voice for video",
            },
        ],
        POD_CHANNELIO_SDK: `
  pod 'ChannelIOSDK', podspec: 'https://mobile-static.channel.io/ios/latest/xcframework.podspec'
  pod 'RNChannelIO', :path => '../node_modules/react-native-channel-plugin'
    `,
        INIT_SDK_IMPORT: "#import <ChannelIOFront/ChannelIOFront-swift.h>",
        INIT_SDK_APP: `
  [ChannelIO initialize:application];
    `,
    },
    ANDROID: {
        CHANNEL_TALK_REPOSITORY: `
        maven {  
            url 'https://maven.channel.io/maven2'  
            name 'ChannelTalk'  
        }  
    `,
        MULTIDEX_ENABLE: `
        multiDexEnabled true
    `,
        IMPORT_MULTIDEX: "import androidx.multidex.MultiDexApplication",
        IMPORT_CHANNELIO: "import com.zoyi.channel.plugin.android.ChannelIO",
        EXTENDS_MULTIDEXAPPLICATION: "class MainApplication : MultiDexApplication(), ReactApplication {",
        INIT_CHANNELIO: "ChannelIO.initialize(this)",
    },
};
// Helper function to insert text after a specific line
const insertAfter = (contents, searchString, newText) => {
    const insertionIndex = contents.indexOf(searchString) + searchString.length;
    return (contents.slice(0, insertionIndex) +
        "\n" +
        newText +
        contents.slice(insertionIndex));
};
const withIChinaChnnelTalkNativeConfig = (config) => {
    // iOS Configuration
    console.log("🍎 Applying custom iOS configuration...");
    console.log("---------------------------------------------");
    console.log("Now Editing Podfile");
    config = (0, config_plugins_1.withPodfile)(config, (config) => {
        config.modResults.contents = insertAfter(config.modResults.contents, "config = use_native_modules!", CHANNEL_TALK_CONFIG.IOS.POD_CHANNELIO_SDK);
        return config;
    });
    console.log("✅ Done");
    console.log("Now Editing Info.plist");
    config = (0, config_plugins_1.withInfoPlist)(config, (config) => {
        CHANNEL_TALK_CONFIG.IOS.PRIVACY_SETTINGS.forEach(({ key, value }) => {
            config.modResults[key] = value;
        });
        return config;
    });
    console.log("✅ Done");
    console.log("Now Editing AppDelegate");
    config = (0, config_plugins_1.withAppDelegate)(config, (config) => {
        config.modResults.contents = insertAfter(config.modResults.contents, "#import <React/RCTLinkingManager.h>", CHANNEL_TALK_CONFIG.IOS.INIT_SDK_IMPORT);
        config.modResults.contents = insertAfter(config.modResults.contents, `- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{`, CHANNEL_TALK_CONFIG.IOS.INIT_SDK_APP);
        return config;
    });
    console.log("✅ Done");
    console.log("Now Editing Podfile");
    config = (0, config_plugins_1.withPodfile)(config, (config) => {
        config.modResults.contents += `#Custom Gradle configuration`;
        return config;
    });
    console.log("✅ Done");
    console.log();
    console.log();
    // Android Configuration
    console.log("🤖 Applying custom Android configuration...");
    console.log("---------------------------------------------");
    console.log("Now Editing ./build.gradle");
    config = (0, config_plugins_1.withProjectBuildGradle)(config, (config) => {
        config.modResults.contents = insertAfter(config.modResults.contents, "mavenCentral()", CHANNEL_TALK_CONFIG.ANDROID.CHANNEL_TALK_REPOSITORY);
        return config;
    });
    console.log("✅ Done");
    console.log("Now Editing ./app/build.gradle");
    config = (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
        config.modResults.contents = insertAfter(config.modResults.contents, 'versionName "1.0.0"', CHANNEL_TALK_CONFIG.ANDROID.MULTIDEX_ENABLE);
        return config;
    });
    console.log("✅ Done");
    console.log("Now Editing MainApplication.java");
    config = (0, config_plugins_1.withMainApplication)(config, (config) => {
        config.modResults.contents = config.modResults.contents.replace("import android.app.Application", CHANNEL_TALK_CONFIG.ANDROID.IMPORT_MULTIDEX);
        config.modResults.contents = insertAfter(config.modResults.contents, "import expo.modules.ReactNativeHostWrapper", CHANNEL_TALK_CONFIG.ANDROID.IMPORT_CHANNELIO);
        config.modResults.contents = config.modResults.contents.replace("class MainApplication : Application(), ReactApplication {", CHANNEL_TALK_CONFIG.ANDROID.EXTENDS_MULTIDEXAPPLICATION);
        config.modResults.contents = insertAfter(config.modResults.contents, "SoLoader.init(this, false)", CHANNEL_TALK_CONFIG.ANDROID.INIT_CHANNELIO);
        return config;
    });
    console.log("✅ Done");
    return config;
};
exports.default = withIChinaChnnelTalkNativeConfig;
