'use client'
import { Image } from "@heroui/react";

export default function Page() {
    return (
        <div className="mx-auto prose text-justify p-6">
            <h1>Lap counting</h1>

            <div className="flex flex-col items-center md:flex-row md:items-start">
                <div>
                    <p>
                        The objective of lap counting is to ensure that all swimmers complete the
                        required number of laps. The most common way to do this is to have a
                        designated person, typically one of the starters, record the order of finish
                        for each lap of the race.
                    </p>
                    <p>
                        A typical counter sheet has one line for each lap in the race. As the swimmer
                        finishes the lap, their lane number is written on the line for that lap.
                    </p>
                </div>
                <Image
                    alt="Lap counting"
                    src="/images/500-empty.png"
                    className="md:ml-6 max-w-2xs md:mt-0"
                />
            </div>

            <div className="flex flex-col items-center md:flex-row-reverse md:items-start">
                <div>
                    <p>
                        For the first lap or two, the swimmers will be fairly close together. Don&apos;t
                        worry about the exact order of swimmers on these first laps. The objective is
                        just to make sure they all complete the required number of laps. As the race
                        continues, the swimmers will spread out, making the order more obvious and
                        easier to write down.
                    </p>
                </div>
                <Image
                    src="/images/500-L2.png"
                    alt="Sheet with only a few places indicated for lap 2"
                    className="md:mr-6 max-w-2xs md:mt-0"
                />
            </div>

            <div className="flex flex-col items-center md:flex-row md:items-start">
                <div>
                    <p>
                        The order of the swimmers will be fairly stable after the first couple of laps.
                    </p>
                </div>
                <Image
                    src="/images/500-L6.png"
                    alt="Sheet filled out through lap 6"
                    className="md:ml-6 max-w-2xs md:mt-0"
                />
            </div>

            <div className="flex flex-col items-center md:flex-row-reverse md:items-start">
                <div>
                    <p>
                        Once lapping starts, you will need to be more careful about the order of
                        finish, ensuring that you are placing the count on the correct line. Every
                        line should eventually have all the lanes listed.
                    </p>
                </div>
                <Image
                    src="/images/500-L16.png"
                    alt="Sheet showing a swimmer that has been lapped"
                    className="md:mr-6 max-w-2xs md:mt-0"
                />
            </div>

            <div className="flex flex-col items-center md:flex-row md:items-start">
                <div>
                    <p>
                        Make sure the bell is rung for the last lap. Ideally by a (non-counting)
                        starter or the referee. The swimmer is ultimately responsible for completing
                        the required number of laps.
                    </p>
                </div>
                <Image
                    src="/images/500-L18.png"
                    alt="Sheet with a single swimmer on the bell lap"
                    className="md:ml-6 max-w-2xs md:mt-0"
                />
            </div>

            <div className="flex flex-col items-center md:flex-row-reverse md:items-start">
                <div>
                    <p>
                        At the end of the race, you will have a fully completed counter sheet, with
                        the line for the last lap being the overall race order of finish.
                    </p>
                </div>
                <Image
                    src="/images/500-L20.png"
                    alt="Completed lap counting sheet"
                    className="md:mr-6 max-w-2xs md:mt-0"
                />
            </div>
        </div>
    );
}
