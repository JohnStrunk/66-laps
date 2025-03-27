import type { Meta, StoryObj } from '@storybook/react';

import { Application } from '@pixi/react';
import Swimmer from './Swimmer';

const meta: Meta<typeof Swimmer> = {
    component: Swimmer,
    decorators: [
        (Story) => (
            <Application autoStart sharedTicker>
                <Story />
            </Application>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Swimmer>;

export const Story1: Story = {
};
