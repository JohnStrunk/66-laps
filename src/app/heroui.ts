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
                 *   Contrast checker: ???
                 */
                // Layout colors:
                background: "#FFFFFF",  // page background
                foreground: "#000000",  // page text color
                // divider: "rgba(17, 17, 17, 0.15)",  // divider & single line border
                // overlay: "rgba(17, 17, 17, 0.5)",  // modal, popover
                // focus: "#006FEE", // focus state outline

                // Content colors:
                // content1: "#FFFFFF",  // card, modal, popover, tooltip background
                // content2: "#f4f4f5",
                // content3: "#e4e4e7",
                // content4: "#d4d4d8",

                // Base colors (w/ shades):
                // default: {
                //     DEFAULT: "#000000",  // background
                //     foreground: "#ffffff",
                //     // 50-900:
                // }
                primary: {
                    DEFAULT: "#193cb8",  // background
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
