import type { Meta, StoryObj } from '@storybook/react';

import { SwimmerModel } from '@/modules/SwimmerModel';
import Pool, { PoolLength } from './Pool';

const meta: Meta<typeof Pool> = {
    component: Pool,
};

export default meta;
type Story = StoryObj<typeof Pool>;

export const LC08: Story = {
    args: {
        poolLength: PoolLength.LC,
        swimmers: Array.from({ length: 8 }, (_, i) => (new SwimmerModel([30 + i, 32 + i, 31 + i, 29 + i]))),
    },
};

export const SC06: Story = {
    args: {
        poolLength: PoolLength.SC,
        swimmers: Array.from({ length: 6 }, (_, i) => (new SwimmerModel([15 + i, 16 + i, 14 + i, 15 + i]))),
    },
};

export const SC10: Story = {
    args: {
        poolLength: PoolLength.SC,
        swimmers: Array.from({ length: 10 }, (_, i) => (new SwimmerModel([15 + i, 16 + i, 14 + i, 15 + i]))),
    },
};
