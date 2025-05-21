import { heroui } from "@heroui/react";

export default heroui({
    themes: {
        light: {
            colors: {
                /*
                 * https://www.heroui.com/docs/customization/colors#semantic-colors
                 * Colors can be applied via:
                 * - standard tailwind classes:
                 *     bg-primary-500, text-secondary
                 * - JS/TS:
                 *     import { semanticColors } from "@heroui/theme";
                 *     semanticColors.light.primary.DEFAULT
                 *     semanticColors.light.primary[500]
                 * - CSS variables:
                 *     hsl(var(--heroui-primary-500))
                 * Sites:
                 *   Individual color picker: https://oklch.com/
                 *   Generate numbered hues: https://www.tailwindhues.com/
                 *   Semantic from primary: https://colors.eva.design/
                 *   Contrast grid: https://contrast-grid.eightshapes.com/?version=1.1.0&background-colors=&foreground-colors=%23FFFFFF%2C%20white%0D%0A%23000000%2C%20black%0D%0A%23193cb8%2C%20blue-800%20-%20pri%0D%0A%2300bc7d%2C%20emerald-500%20-%20c2%0D%0A%2382181a%2C%20red-900%20-%20c3%0D%0A%238ec5ff%2C%20blue-300%20-%20c4%0D%0A&es-color-form__tile-size=compact&es-color-form__show-contrast=aaa
                 *
                 */
                // Layout colors:
                background: "#FFFFFF",  // page background
                foreground: "#000000",  // page text color
                // divider: "rgba(17, 17, 17, 0.15)",  // divider & single line border
                // overlay: "rgba(17, 17, 17, 0.5)",  // modal, popover
                // focus: "#006FEE", // focus state outline

                // Content colors:
                content1: "#FFFFFF",  // card, modal, popover, tooltip background
                content2: "#00bc7d",  // tw emerald-500
                content3: "#82181a",  // tw red-900
                content4: "#8ec5ff",  // tw blue-300

                // Base colors (w/ shades):
                // default: {
                //     DEFAULT: "#000000",  // background
                //     foreground: "#ffffff",
                //     // 50-900:
                // }
                primary: {
                    DEFAULT: "#193cb8",  // tw blue-800
                    foreground: "#FFFFFF",
                    //     // 50-900:
                },
                // secondary: {
                //     DEFAULT: "#000000",  // background
                //     foreground: "#ffffff",
                //     // 50-900:
                // },
                // success: {
                //     DEFAULT: "#000000",  // background
                //     foreground: "#ffffff",
                //     // 50-900:
                // },
                // warning: {
                //     DEFAULT: "#000000",  // background
                //     foreground: "#ffffff",
                //     // 50-900:
                // },
                // danger: {
                //     DEFAULT: "#000000",  // background
                //     foreground: "#ffffff",
                //     // 50-900:
                // },
            },
        },
        dark: {
            colors: {
                background: "#000000",
                foreground: "#EEEEEE",
                primary: {
                    DEFAULT: "#8ec5ff", // tw blue-300
                    foreground: "#000000",
                },
            },
        },
    },
});
