import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';
import Settings from './Settings';

const meta: Meta<typeof Settings> = {
    component: Settings,
};

export default meta;
type Story = StoryObj<typeof Settings>;

export const Normal: Story = {
    args: {
        onClick: fn(),
    },
};
