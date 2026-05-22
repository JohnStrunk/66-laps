import { PoolLength } from "@/components/Pool/Pool";
import { Button, Form, Select, ListBox, Label } from "@heroui/react";
import { useState } from "react";

export enum NumberingDirection {
    AWAY = "AWAY",
    TOWARDS = "TOWARDS",
}

export enum StartingEnd {
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

export enum SimulationMode {
    TWO_D = "2D",
    THREE_D = "3D",
}

// Valid values for selects
const LANE_OPTIONS = ["6", "8", "10"];
const RACE_LENGTH_OPTIONS = [
    { value: "50_SC", label: "50 SC" },
    { value: "50_LC", label: "50 LC" },
    { value: "500_SC", label: "500 SC" },
    { value: "1000_SC", label: "1000 SC" },
    { value: "1650_SC", label: "1650 SC" },
    { value: "800_LC", label: "800 LC" },
    { value: "1500_LC", label: "1500 LC" },
];
const NUMBERING_OPTIONS = [
    { value: NumberingDirection.AWAY, label: "Bottom to top" },
    { value: NumberingDirection.TOWARDS, label: "Top to bottom" },
];
const STARTING_END_OPTIONS = [
    { value: StartingEnd.LEFT, label: "Left" },
    { value: StartingEnd.RIGHT, label: "Right" },
];
const MODE_OPTIONS = [
    { value: SimulationMode.TWO_D, label: "2D Overhead" },
    { value: SimulationMode.THREE_D, label: "3D Perspective" },
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
    /** The side of the screen the start/finish wall is on */
    startingEnd: StartingEnd;
    /** The simulation rendering mode */
    simulationMode: SimulationMode;
};

export type SettingsProps = {
    /** Callback that is invoked to finalize the settings for a race */
    onClick: (settings: SettingsValue) => void;
};

export default function Settings(props: SettingsProps) {
    const [raceLength, setRaceLength] = useState<string>("500_SC");
    const [lanes, setLanes] = useState<number>(8);
    const [difficulty, setDifficulty] = useState<number>(1.0);
    const [numberingDirection, setNumberingDirection] = useState<NumberingDirection>(NumberingDirection.AWAY);
    const [startingEnd, setStartingEnd] = useState<StartingEnd>(StartingEnd.LEFT);
    const [simulationMode, setSimulationMode] = useState<SimulationMode>(SimulationMode.THREE_D);
    // Spread is the percentage difference in speed between the fastest and
    // slowest swimmers
    const [spread, setSpread] = useState<number>(0.1);
    const isTestMode = typeof window !== 'undefined' && window.location.search.includes('testMode=true');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const parts = raceLength.split('_');
        const distance = parseInt(parts[0]);
        const poolLength = parts[1] as PoolLength;
        const laps = poolLength === PoolLength.SC ? distance / 25 : distance / 50;
        props.onClick({
            poolLength,
            lanes,
            laps,
            difficulty,
            spread,
            numberingDirection,
            startingEnd,
            simulationMode,
        });
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
                    <Select
                        data-testid="settings-Number of Lanes"
                        selectedKey={lanes.toString()}
                        onSelectionChange={(key) => {
                            if (key) setLanes(parseInt(key.toString()));
                        }}>
                        <label className="text-small font-medium">Number of Lanes</label>
                        <Select.Trigger aria-label="Number of Lanes">
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox aria-label="Number of Lanes">
                                {LANE_OPTIONS.map(opt => (
                                    <ListBox.Item id={opt} key={opt}>{opt}</ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>

                    {isTestMode ? (
                        <div className="flex flex-col gap-2 w-full">
                            <label className="text-small font-medium">Race Length</label>
                            <select
                                data-testid="settings-Race Length"
                                value={raceLength}
                                onChange={(e) => setRaceLength(e.target.value)}
                                className="bg-white dark:bg-black rounded-medium p-2 border-1"
                            >
                                {RACE_LENGTH_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <Select
                            data-testid="settings-Race Length"
                            selectedKey={raceLength}
                            onSelectionChange={(key) => {
                                if (key) {
                                    setRaceLength(key.toString());
                                }
                            }}>
                            <label className="text-small font-medium">Race Length</label>
                            <Select.Trigger aria-label="Race Length">
                                <Select.Value />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox aria-label="Race Length">
                                    {RACE_LENGTH_OPTIONS.map(opt => (
                                        <ListBox.Item id={opt.value} key={opt.value}>{opt.label}</ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>
                    )}

                    <Select
                        data-testid="settings-Lane Numbering"
                        selectedKey={numberingDirection}
                        onSelectionChange={(key) => {
                            if (key) setNumberingDirection(key.toString() as NumberingDirection);
                        }}>
                        <label className="text-small font-medium">Lane Numbering</label>
                        <Select.Trigger aria-label="Lane Numbering">
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox aria-label="Lane Numbering">
                                {NUMBERING_OPTIONS.map(opt => (
                                    <ListBox.Item id={opt.value} key={opt.value}>{opt.label}</ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                    <Select
                        data-testid="settings-Difficulty"
                        selectedKey={difficulty.toString()}
                        onSelectionChange={(key) => {
                            if (key) setDifficulty(parseFloat(key.toString()));
                        }}>
                        <label className="text-small font-medium">Difficulty</label>
                        <Select.Trigger aria-label="Difficulty">
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox aria-label="Difficulty">
                                {DIFFICULTY_OPTIONS.map(opt => (
                                    <ListBox.Item id={opt.value.toString()} key={opt.value}>{opt.label}</ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                    <Select
                        data-testid="settings-Spread"
                        selectedKey={spread.toString()}
                        onSelectionChange={(key) => {
                            if (key) setSpread(parseFloat(key.toString()));
                        }}>
                        <label className="text-small font-medium">Spread</label>
                        <Select.Trigger aria-label="Spread">
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox aria-label="Spread">
                                {SPREAD_OPTIONS.map(opt => (
                                    <ListBox.Item id={opt.value.toString()} key={opt.value}>{opt.label}</ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                    <Select
                        data-testid="settings-Starting End"
                        selectedKey={startingEnd}
                        onSelectionChange={(key) => {
                            if (key) setStartingEnd(key.toString() as StartingEnd);
                        }}>
                        <label className="text-small font-medium">Starting End</label>
                        <Select.Trigger aria-label="Starting End">
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox aria-label="Starting End">
                                {STARTING_END_OPTIONS.map(opt => (
                                    <ListBox.Item id={opt.value} key={opt.value}>{opt.label}</ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                    <Select
                        data-testid="settings-Simulation Mode"
                        selectedKey={simulationMode}
                        onSelectionChange={(key) => {
                            if (key) setSimulationMode(key.toString() as SimulationMode);
                        }}>
                        <label className="text-small font-medium">Simulation Mode</label>
                        <Select.Trigger aria-label="Simulation Mode">
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox aria-label="Simulation Mode">
                                {MODE_OPTIONS.map(opt => (
                                    <ListBox.Item id={opt.value} key={opt.value}>{opt.label}</ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>
                <Button
                    variant="primary"
                    type="submit"
                    data-testid="start-button"
                >
                    Start
                </Button>
            </Form>
        </div >
    )
}
