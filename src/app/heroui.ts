import { heroui } from "@heroui/react";
export default heroui({
    themes: {
        light: {
            colors: {
                background: "#eeeeee",
                foreground: "#000000",
                // focus: "#00FF00",
                // primary: {
                //     DEFAULT: "#000000",  // background
                //     foreground: "#ff0000",
                // },
            },
        },
        dark: {
            colors: {
                background: "#000000",
                foreground: "#eeeeee",
                // focus: "#00FF00",
                // primary: {
                //     DEFAULT: "#ffffff",  // background
                //     foreground: "#000000",
                // },
            },
        },
    },
});
