import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Nav from './Nav';

const meta: Meta<typeof Nav> = {
    component: Nav,
};

export default meta;
type Story = StoryObj<typeof Nav>;

export const Normal: Story = {
};
