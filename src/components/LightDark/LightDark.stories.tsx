import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import LightDark from './LightDark';

const meta: Meta<typeof LightDark> = {
    component: LightDark,
};

export default meta;
type Story = StoryObj<typeof LightDark>;

export const Normal: Story = {
};
