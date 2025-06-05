import { PoolLength } from "@/components/Pool/Pool";
import { Button, Form, Select, SelectItem } from "@heroui/react";
import { useState } from "react";

export enum NumberingDirection {
    AWAY = "AWAY",
    TOWARDS = "TOWARDS",
}

// Valid values for selects
const LANE_OPTIONS = ["6", "8", "10"];
const RACE_LENGTH_OPTIONS = [
    { value: "500SC", label: "500 SC" },
    { value: "1000SC", label: "1000 SC" },
    { value: "1650SC", label: "1650 SC" },
    { value: "800LC", label: "800 LC" },
    { value: "1500LC", label: "1500 LC" },
];
const NUMBERING_OPTIONS = [
    { value: NumberingDirection.AWAY, label: "Bottom to top" },
    { value: NumberingDirection.TOWARDS, label: "Top to bottom" },
];
const DIFFICULTY_OPTIONS = [
    { value: "0.5", label: "Peaceful" },
    { value: "0.75", label: "Easy" },
    { value: "1", label: "Normal" },
    { value: "1.25", label: "Hard" },
    { value: "1.5", label: "Hardcore 🖤" },
];
const SPREAD_OPTIONS = [
    { value: "0.05", label: "Minimal" },
    { value: "0.1", label: "Normal" },
    { value: "0.2", label: "Max" },
];

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
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
            <Form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
                    <Select
                        label="Number of Lanes"
                        defaultSelectedKeys={[lanes.toString()]}
                        validate={(value) => {
                            if (value === "" || value === null) {
                                return "Please select a number of lanes";
                            }
                            const stringValue = Array.isArray(value) ? value[0] : value;
                            if (!LANE_OPTIONS.includes(stringValue)) {
                                return "Please select a valid number of lanes";
                            }
                            return true;
                        }}
                        onChange={(e) => {
                            setLanes(parseInt(e.target.value));
                        }}>
                        {LANE_OPTIONS.map(opt => (
                            <SelectItem key={opt}>{opt}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        label="Race Length"
                        defaultSelectedKeys={[raceLength]}
                        validate={(value) => {
                            if (value === "" || value === null) {
                                return "Please select a race length";
                            }
                            const stringValue = Array.isArray(value) ? value[0] : value;
                            if (!RACE_LENGTH_OPTIONS.some(opt => opt.value === stringValue)) {
                                return "Please select a valid race length";
                            }
                            return true;
                        }}
                        onChange={(e) => setRaceLength(e.target.value)}>
                        {RACE_LENGTH_OPTIONS.map(opt => (
                            <SelectItem key={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        label="Lane Numbering"
                        defaultSelectedKeys={[numberingDirection]}
                        validate={(value) => {
                            if (value === "" || value === null) {
                                return "Please select a lane numbering direction";
                            }
                            const stringValue = Array.isArray(value) ? value[0] : value;
                            if (!NUMBERING_OPTIONS.some(opt => opt.value === stringValue)) {
                                return "Please select a valid lane numbering direction";
                            }
                            return true;
                        }}
                        onChange={(e) => setNumberingDirection(e.target.value as NumberingDirection)}>
                        {NUMBERING_OPTIONS.map(opt => (
                            <SelectItem key={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        label="Difficulty"
                        defaultSelectedKeys={[difficulty.toString()]}
                        validate={(value) => {
                            if (value === "" || value === null) {
                                return "Please select a difficulty";
                            }
                            const stringValue = Array.isArray(value) ? value[0] : value;
                            if (!DIFFICULTY_OPTIONS.some(opt => opt.value === stringValue)) {
                                return "Please select a valid difficulty";
                            }
                            return true;
                        }}
                        onChange={(e) => setDifficulty(parseFloat(e.target.value))}>
                        {DIFFICULTY_OPTIONS.map(opt => (
                            <SelectItem key={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        label="Spread"
                        defaultSelectedKeys={[spread.toString()]}
                        validate={(value) => {
                            if (value === "" || value === null) {
                                return "Please select a spread";
                            }
                            const stringValue = Array.isArray(value) ? value[0] : value;
                            if (!SPREAD_OPTIONS.some(opt => opt.value === stringValue)) {
                                return "Please select a valid spread";
                            }
                            return true;
                        }}
                        onChange={(e) => setSpread(parseFloat(e.target.value))}>
                        {SPREAD_OPTIONS.map(opt => (
                            <SelectItem key={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </Select>
                </div>
                <Button
                    color="primary"
                    type="submit"
                >
                    Start
                </Button>
            </Form>
        </div >
    )
}
