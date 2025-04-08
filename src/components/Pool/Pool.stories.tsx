import type { Meta, StoryObj } from '@storybook/react';

import { Application } from '@pixi/react';
import Pool from './Pool';

const meta: Meta<typeof Pool> = {
    component: Pool,
    decorators: [
        (Story) => (
            <Application>
                <Story />
            </Application>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Pool>;

export const LC08: Story = {
    args: {
        poolLength: "LC",
        lanes: 8,
    },
};

export const SC06: Story = {
    args: {
        poolLength: "SC",
        lanes: 6,
    },
};

export const SC10: Story = {
    args: {
        poolLength: "SC",
        lanes: 10,
    },
};
