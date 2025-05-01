import { PoolLength } from "@/components/Pool/Pool";
import { Button, Select, SelectItem } from "@heroui/react";
import { useState } from "react";

export enum NumberingDirection {
    AWAY = "AWAY",
    TOWARDS = "TOWARDS",
}

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
    /** The direction for lane numbering */
    numberingDirection: NumberingDirection;
};

export type SettingsProps = {
    /** Callback that is invoked to finalize the settings for a race */
    onClick: (settings: SettingsValue) => void;
};

export default function Settings(props: SettingsProps) {
    const [raceLength, setRaceLength] = useState<string>("500SC");
    const [lanes, setLanes] = useState<number>(8);
    const [difficulty, setDifficulty] = useState<number>(1.0);
    const [numberingDirection, setNumberingDirection] = useState<NumberingDirection>(NumberingDirection.AWAY);
    // Spread is the percentage difference in speed between the fastest and
    // slowest swimmers
    const [spread, setSpread] = useState<number>(0.05);
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
            numberingDirection,
        });
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold">Settings</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Select
                    label="Number of Lanes"
                    defaultSelectedKeys={[lanes.toString()]}
                    onChange={(e) => setLanes(parseInt(e.target.value))}>
                    <SelectItem key="6">6</SelectItem>
                    <SelectItem key="8">8</SelectItem>
                    <SelectItem key="10">10</SelectItem>
                </Select>
                <Select
                    label="Race Length"
                    defaultSelectedKeys={[raceLength]}
                    onChange={(e) => setRaceLength(e.target.value)}>
                    <SelectItem key="500SC">500 SC</SelectItem>
                    <SelectItem key="1000SC">1000 SC</SelectItem>
                    <SelectItem key="1650SC">1650 SC</SelectItem>
                    <SelectItem key="800LC">800 LC</SelectItem>
                    <SelectItem key="1500LC">1500 LC</SelectItem>
                </Select>
                <Select
                    label="Lane Numbering"
                    defaultSelectedKeys={[numberingDirection]}
                    onChange={(e) => setNumberingDirection(e.target.value as NumberingDirection)}>
                    <SelectItem key={NumberingDirection.AWAY}>Bottom to top</SelectItem>
                    <SelectItem key={NumberingDirection.TOWARDS}>Top to bottom</SelectItem>
                </Select>
                <Select
                    label="Difficulty"
                    defaultSelectedKeys={[difficulty.toString()]}
                    onChange={(e) => setDifficulty(parseFloat(e.target.value))}>
                    <SelectItem key="0.5">Peaceful</SelectItem>
                    <SelectItem key="0.75">Easy</SelectItem>
                    <SelectItem key="1">Normal</SelectItem>
                    <SelectItem key="1.25">Hard</SelectItem>
                    <SelectItem key="1.5">Hardcore 🖤</SelectItem>
                </Select>
                <Select
                    label="Spread"
                    defaultSelectedKeys={[spread.toString()]}
                    onChange={(e) => setSpread(parseFloat(e.target.value))}>
                    <SelectItem key="0.05">Minimal</SelectItem>
                    <SelectItem key="0.1">Normal</SelectItem>
                    <SelectItem key="0.2">Max</SelectItem>
                </Select>
            </div>
            <div className="flex justify-center content-center">
                <Button
                    color="primary"
                    onPress={handleSubmit}
                >
                    Start
                </Button>
            </div>
        </div>
    )
}
