import type { Meta, StoryObj } from '@storybook/react';

import { fn } from 'storybook/test';
import Settings from './Settings';

const meta: Meta<typeof Settings> = {
    component: Settings,
};

export default meta;
type Story = StoryObj<typeof Settings>;

export const normal: Story = {
    args: {
        onClick: fn(),
    },
};
