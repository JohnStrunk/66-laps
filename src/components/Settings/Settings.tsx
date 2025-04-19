import { PoolLength } from "@/components/Pool/Pool";
import { Button, Field, Label, Select } from "@headlessui/react";
import { useState } from "react";

/** Configuration for a race */
export type SettingsValue = {
    /** The length of the swimming pool */
    poolLength: PoolLength;
    /** The number of lanes in the pool */
    lanes: number;
    /** The number of laps in the race */
    laps: number;
    /** A difficulty multiplier */
    difficulty: number;
    /** The maximum percentage difference of the swimmers' speeds */
    spread: number;
};

export type SettingsProps = {
    /** Callback that is invoked to finalize the settings for a race */
    onClick: (settings: SettingsValue) => void;
};

export default function Settings(props: SettingsProps) {
    const [raceLength, setRaceLength] = useState<string>("500SC");
    const [lanes, setLanes] = useState<number>(8);
    const [difficulty, setDifficulty] = useState<number>(1.0);
    // Spread is the percentage difference in speed between the fastest and
    // slowest swimmers
    const [spread, setSpread] = useState<number>(0.05);
    console.log(spread);
    const handleSubmit = () => {
        const poolLength = raceLength.slice(-2) as PoolLength;
        const distance = parseInt(raceLength.slice(0, -2));
        const laps = poolLength === "SC" ? distance / 25 : distance / 50;
        props.onClick({
            poolLength,
            lanes,
            laps,
            difficulty,
            spread,
        });
    }

    const selectClassName = "bg-gray-300 hover:bg-gray-600 hover:text-white text-black py-2 px-3 rounded-lg";

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <div className="flex flex-row gap-6">
                <Field className="flex flex-col gap-1">
                    <Label>Lanes</Label>
                    <Select
                        name="Number of Lanes"
                        aria-label="Number of Lanes"
                        className={selectClassName}
                        value={lanes}
                        onChange={(e) => setLanes(parseInt(e.target.value))}
                    >
                        <option value="6">6</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                    </Select>
                </Field>
                <Field className="flex flex-col gap-1">
                    <Label>Race Length</Label>
                    <Select
                        name="Race Length"
                        aria-label="Race Length"
                        className={selectClassName}
                        value={raceLength}
                        onChange={(e) => setRaceLength(e.target.value)}
                    >
                        {/* These option values must parse directly into an integer
                        distance with 2 trailing characters of SC or LC, corresponding
                        to the values of the PoolLength enum */}
                        <option value="500SC">500 SC</option>
                        <option value="1000SC">1000 SC</option>
                        <option value="1650SC">1650 SC</option>
                        <option value="800LC">800 LC</option>
                        <option value="1500LC">1500 LC</option>
                    </Select>
                </Field>
                <Field className="flex flex-col gap-1">
                    <Label>Difficulty</Label>
                    <Select
                        name="Difficulty"
                        aria-label="Difficulty"
                        className={selectClassName}
                        value={difficulty}
                        onChange={(e) => setDifficulty(parseFloat(e.target.value))}
                    >
                        <option value="0.5">Apprentice</option>
                        <option value="1">Normal</option>
                        <option value="1.2">Hurt me plenty</option>
                        <option value="1.5">Nightmare!</option>
                    </Select>
                </Field>
                <Field className="flex flex-col gap-1">
                    <Label>Spread</Label>
                    <Select
                        name="Spread"
                        aria-label="Spread"
                        className={selectClassName}
                        value={spread}
                        onChange={(e) => setSpread(parseFloat(e.target.value))}
                    >
                        <option value="0.05">Minimal</option>
                        <option value="0.1">Normal</option>
                        <option value="0.2">Max</option>
                    </Select>
                </Field>
            </div>
            <Button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-3xs"
            >
                Start
            </Button>
        </div>
    )
}
