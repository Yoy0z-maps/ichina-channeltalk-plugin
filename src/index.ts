import {
  ConfigPlugin,
  withInfoPlist,
  withAppBuildGradle,
  withProjectBuildGradle,
  withMainApplication,
  withPodfile,
  withAppDelegate,
} from "@expo/config-plugins";

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
    INIT_SDK_IMPORT: "#import <ChannelIOFront/ChannelIOFront-swift.h>",
    INIT_SDK_APP: `
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [ChannelIO initialize:application];
    return YES;
}
    `,
  },
  ANDROID: {
    REPOSITORY: `
        maven {  
            url 'https://maven.channel.io/maven2'  
            name 'ChannelTalk'  
        }
    `,
    APP_DEPENDENCY: "    implementation 'io.channel:plugin-android'",
    APP_MULTIDEX: "        multiDexEnabled true",
    IMPORT_PACKAGE: `
import android.support.multidex.MultiDexApplication;
import com.zoyi.channel.plugin.android.ChannelIO;
import com.zoyi.channel.rn.RNChannelIOPackage;
    `,
    ADD_PACKAGE: `
                return listOf(
                    MainReactPackage(),
                    RNChannelIOPackage() // Add ChannelIO Package
                )
    `,
    INIT_PACKAGE: "    ChannelIO.initialize(this); // Initialize ChannelIO",
  },
};

// Helper function to insert text after a specific line
const insertAfter = (
  contents: string,
  searchString: string,
  newText: string
) => {
  const insertionIndex = contents.indexOf(searchString) + searchString.length;
  return (
    contents.slice(0, insertionIndex) +
    "\n" +
    newText +
    "\n" +
    contents.slice(insertionIndex)
  );
};

const withIChinaChnnelTalkNativeConfig: ConfigPlugin = (config) => {
  // iOS Configuration
  console.log("🍎 Applying custom iOS configuration...");
  console.log("---------------------------------------------");

  console.log("Now Editing Info.plist");
  config = withInfoPlist(config, (config) => {
    CHANNEL_TALK_CONFIG.IOS.PRIVACY_SETTINGS.forEach(({ key, value }) => {
      config.modResults[key] = value;
    });
    return config;
  });
  console.log("✅ Done");

  console.log("Now Editing AppDelegate");
  config = withAppDelegate(config, (config) => {
    config.modResults.contents =
      CHANNEL_TALK_CONFIG.IOS.INIT_SDK_IMPORT +
      "\n" +
      config.modResults.contents;
    config.modResults.contents += CHANNEL_TALK_CONFIG.IOS.INIT_SDK_APP;
    return config;
  });
  console.log("✅ Done");

  console.log("Now Editing Podfile");
  config = withPodfile(config, (config) => {
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
  config = withProjectBuildGradle(config, (config) => {
    config.modResults.contents = insertAfter(
      config.modResults.contents,
      "repositories {",
      CHANNEL_TALK_CONFIG.ANDROID.REPOSITORY
    );
    return config;
  });
  console.log("✅ Done");

  console.log("Now Editing ./app/build.gradle");
  config = withAppBuildGradle(config, (config) => {
    config.modResults.contents = insertAfter(
      config.modResults.contents,
      "dependencies {",
      CHANNEL_TALK_CONFIG.ANDROID.APP_DEPENDENCY
    );
    config.modResults.contents = insertAfter(
      config.modResults.contents,
      "defaultConfig {",
      CHANNEL_TALK_CONFIG.ANDROID.APP_MULTIDEX
    );
    return config;
  });
  console.log("✅ Done");

  console.log("Now Editing MainApplication.java");
  config = withMainApplication(config, (config) => {
    config.modResults.contents = insertAfter(
      config.modResults.contents,
      "import expo.modules.ReactNativeHostWrapper",
      CHANNEL_TALK_CONFIG.ANDROID.IMPORT_PACKAGE
    );

    config.modResults.contents = config.modResults.contents.replace(
      "return PackageList(this).packages",
      CHANNEL_TALK_CONFIG.ANDROID.ADD_PACKAGE
    );

    config.modResults.contents = insertAfter(
      config.modResults.contents,
      "super.onCreate()",
      CHANNEL_TALK_CONFIG.ANDROID.INIT_PACKAGE
    );
    return config;
  });
  console.log("✅ Done");

  return config;
};

export default withIChinaChnnelTalkNativeConfig;