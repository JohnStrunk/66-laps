import { ph_event_link_out } from "@/modules/phEvents";
import { Link } from "@heroui/react";
import Image from "next/image";
import { usePostHog } from "posthog-js/react";


export default function Footer() {
    const postHog = usePostHog();
    return (
        <>
            <div className="w-full h-16 mt-6 flex flex-row gap-6 items-center justify-center bg-content3 text-white border-t-1 border-t-content1">
                <div className="mx-6">
                    <p className="text-xs text-center">© 2025 66-Laps.com CC&nbsp;BY-NC-SA&nbsp;4.0</p>
                </div>
                <div className="mx-auto flex flex-col justify-center items-center">
                    <p className="text-sm">Suggestions?</p>
                    <Link className="text-sm text-center text-blue-300" href="mailto:feedback@66-laps.com">
                        feedback@66-laps.com
                    </Link>
                </div>
                <div className="mx-6 min-w-8">
                    <Link
                        isExternal
                        onPress={() => {
                            ph_event_link_out(
                                postHog,
                                "GitHub - 66-laps",
                                "https://github.com/JohnStrunk/66-laps"
                            );
                        }}
                        href="https://github.com/JohnStrunk/66-laps">
                        <Image className="invert h-8 w-8" src="/images/github-mark.svg" alt="GitHub" width={32} height={32} />
                    </Link>
                </div>
            </div>
        </>
    );
}
