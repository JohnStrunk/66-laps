import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I simulate the container shrinking to {int} by {int}', async function (this: CustomWorld, width: number, height: number) {
    if (this.page) {
        // Change the parent container of the canvas to a flex item that SHOULD shrink,
        // but might be held open by its contents (the canvas)
        await this.page.evaluate(({ w, h }) => {
            const container = document.querySelector('.relative.w-full.h-full.p-4.overflow-hidden') as HTMLElement;
            if (container) {
                container.classList.remove('w-full', 'h-full');
                // Create a constrained parent
                const parent = container.parentElement!;
                let wrapper = document.getElementById('test-resize-wrapper');
                if (!wrapper) {
                    wrapper = document.createElement('div');
                    wrapper.id = 'test-resize-wrapper';
                    parent.insertBefore(wrapper, container);
                    wrapper.appendChild(container);
                }
                wrapper.style.display = 'flex';
                wrapper.style.flexDirection = 'column';
                wrapper.style.width = `${w}px`;
                wrapper.style.height = `${h}px`;
                wrapper.style.border = '1px solid red'; // just for debugging if needed

                // The container should try to fill its parent
                container.style.flex = '1';
                // NOTE: We do NOT set overflow: hidden or min-width: 0 here,
                // because that's what we're testing for in the Pool component!
            }
        }, { w: width, h: height });
    }
});
