'use client';

import { ScrollShadow, Card, CardBody, Button } from "@heroui/react";
import { Share2, Download, History, Play, Plus, Minus, Settings, BellRing } from "lucide-react";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export default function HelpView() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return <div className="flex-1 bg-background" data-testid="help-view-loading" />;
  }

  return (
    <div className="flex flex-col h-full w-full bg-background" data-testid="help-view">
      <ScrollShadow className="flex-1 p-4 pb-20">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">

          {/* Section 1: Counting Laps */}
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold border-b border-default-200 pb-2">Counting Laps</h2>

            <div className="flex flex-col gap-4 text-default-700">
              <Card className="bg-default-50">
                <CardBody className="gap-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Play size={20} /> The Lane Interface
                  </h3>
                  <p>
                    Each lane is split into two zones: <b>Manual Controls</b> on the left and a large <b>Touch Pad</b> on the right.
                  </p>

                  <div className="flex flex-col gap-6">
                    {/* Mock Lane Row */}
                    <div className="border border-default-200 rounded-xl overflow-hidden bg-content1 flex h-20 shadow-sm">
                      {/* Zone A: Manual */}
                      <div className="basis-1/2 flex items-center justify-center gap-2 border-r border-divider bg-content1 p-2">
                        <Button isIconOnly color="danger" variant="flat" size="sm" className="w-10 h-10 min-w-10">
                          <Minus size={20} />
                        </Button>
                        <span className="text-2xl font-black">12</span>
                        <Button isIconOnly color="success" variant="flat" size="sm" className="w-10 h-10 min-w-10">
                          <Plus size={20} />
                        </Button>
                      </div>
                      {/* Zone B: Touch Pad */}
                      <div className="basis-1/2 flex items-center justify-center bg-success text-white">
                        <span className="text-xl font-black">LANE 1</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <p className="font-bold text-sm text-default-600 uppercase">Zone A: Manual Controls</p>
                        <p className="text-sm">Use the <b>+</b> and <b>-</b> buttons to manually fix errors or adjust the lap count without triggering a lockout.</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-bold text-sm text-default-600 uppercase">Zone B: Touch Pad</p>
                        <p className="text-sm">Tap the large green area to record a lap. This is designed for easy, efficient counting during the race.</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-default-50">
                <CardBody className="gap-3">
                  <h3 className="text-lg font-semibold">Lockout Mechanism</h3>
                  <p>
                    To prevent accidental double-taps, lanes are &quot;locked out&quot; for a short duration after a tap. During lockout, the touch pad appears <b>red</b> with a progress bar, and taps are ignored.
                  </p>
                  <div className="border border-default-200 rounded-xl overflow-hidden bg-content1 flex h-20 shadow-sm max-w-md">
                    <div className="basis-1/2 flex items-center justify-center gap-2 border-r border-divider bg-content1 p-2">
                      <Button isIconOnly color="danger" variant="flat" size="sm" isDisabled className="w-10 h-10 min-w-10"><Minus size={20} /></Button>
                      <span className="text-2xl font-black">12</span>
                      <Button isIconOnly color="success" variant="flat" size="sm" className="w-10 h-10 min-w-10"><Plus size={20} /></Button>
                    </div>
                    <div className="basis-1/2 relative flex items-center justify-center bg-danger-700 text-white overflow-hidden">
                      <div className="absolute inset-0 bg-foreground/20 origin-left scale-x-[0.6]"></div>
                      <span className="text-xl font-black z-10">LANE 1</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-default-50">
                <CardBody className="gap-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Settings size={20} /> Empty Lanes
                  </h3>
                  <p>
                    If a lane is empty during a race, <b>long-press</b> anywhere on the lane (for 1 second) to toggle its empty state. Empty lanes are greyed out to indicate they are not being counted.
                  </p>
                  <div className="border border-default-200 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-900 opacity-60 flex h-20 shadow-sm max-w-md items-center justify-center">
                    <span className="text-4xl font-black select-none text-foreground/40 uppercase">
                      Empty
                    </span>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-default-50">
                <CardBody className="gap-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BellRing size={20} /> Bell, Last Lap, and Finish
                  </h3>
                  <p>
                    For a 500 SC race (20 laps total), the interface provides clear visual cues as the swimmer nears the finish:
                  </p>
                  <div className="flex flex-col gap-3 max-w-md">
                    {/* Bell Lap */}
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold text-default-500 uppercase">Lap 16: Bell Lap</p>
                      <div className="border border-default-200 rounded-xl overflow-hidden bg-content1 flex h-20 shadow-sm">
                        <div className="basis-1/2 flex items-center justify-center gap-2 border-r border-divider bg-content1">
                          <span className="text-2xl font-black">16</span>
                        </div>
                        <div className="basis-1/2 flex items-center justify-center bg-success text-white gap-2">
                          <span className="text-xl">🔔</span>
                          <span className="text-xl font-black">LANE 1</span>
                          <span className="text-xl">🔔</span>
                        </div>
                      </div>
                    </div>

                    {/* Last Lap */}
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold text-default-500 uppercase">Lap 18: Last Lap</p>
                      <div className="border border-default-200 rounded-xl overflow-hidden bg-content1 flex h-20 shadow-sm">
                        <div className="basis-1/2 flex items-center justify-center gap-2 border-r border-divider bg-content1">
                          <span className="text-2xl font-black">18</span>
                        </div>
                        <div className="basis-1/2 flex items-center justify-center bg-success text-white gap-2">
                          <span className="text-xl">🟥</span>
                          <span className="text-xl font-black">LANE 1</span>
                          <span className="text-xl">🟥</span>
                        </div>
                      </div>
                    </div>

                    {/* Finished */}
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold text-default-500 uppercase">Lap 20: Finished</p>
                      <div className="border border-default-200 rounded-xl overflow-hidden bg-content1 flex h-20 shadow-sm">
                        <div className="basis-1/2 flex items-center justify-center gap-2 border-r border-divider bg-content1">
                          <span className="text-2xl font-black">20</span>
                        </div>
                        <div className="basis-1/2 flex items-center justify-center bg-white text-black gap-2">
                          <span className="text-xl">🏁</span>
                          <span className="text-xl font-black">LANE 1</span>
                          <span className="text-xl">🏁</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

            </div>
          </section>

          {/* Section 2: History */}
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold border-b border-default-200 pb-2">History</h2>

            <div className="flex flex-col gap-4 text-default-700">
              <Card className="bg-default-50">
                <CardBody className="gap-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <History size={20} /> Viewing Past Races
                  </h3>
                  <p>
                    The History screen shows a list of all your recorded races. Tapping a race will open the details view, which has two tabs:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><b>OOF (Order of Finish):</b> Shows the relative position of each lane at every lap mark.</li>
                    <li><b>Laps:</b> Displays the lap-by-lap timestamp history for each lane.</li>
                  </ul>
                </CardBody>
              </Card>

              <Card className="bg-default-50">
                <CardBody className="gap-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Download size={20} /> Exporting
                  </h3>
                  <p>
                    You can export the race history as a PDF to print or share. Look for the share and download icons on the History list or within the Race Details view.
                  </p>
                  <div className="flex gap-4">
                    <Button isIconOnly variant="flat" aria-label="Share">
                      <Share2 size={20} />
                    </Button>
                    <Button isIconOnly variant="flat" aria-label="Download">
                      <Download size={20} />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </section>

        </div>
      </ScrollShadow>
    </div>
  );
}
