import { Link } from "@heroui/react";
import Image from "next/image";


export default function Footer() {
    return (
        <>
            <div className="w-full h-16 mt-6 flex flex-row gap-6 items-center justify-center bg-black text-white">
                <div className="mx-6">
                    <p className="text-xs text-center">© 2025 66-Laps.com CC BY-NC-SA 4.0</p>
                </div>
                <div className="mx-auto flex flex-col justify-center items-center">
                    <p className="text-sm">Suggestions?</p>
                    <Link className="text-sm  text-center text-blue-300" href="mailto:feedback@66-laps.com">
                        feedback@66-laps.com
                    </Link>
                </div>
                <div className="mx-6">
                    <Link isExternal href="https://github.com/JohnStrunk/66-laps">
                        <Image className="invert" src="/images/github-mark.svg" alt="GitHub" width={32} height={32} />
                    </Link>
                </div>
            </div>
        </>
    );
}
