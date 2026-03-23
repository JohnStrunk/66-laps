import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Pool3D, { PoolLength } from './Pool3D';
import { NumberingDirection, StartingEnd } from '../Settings/Settings';

// Mock Canvas from react-three/fiber to avoid WebGL errors during successful test cases
vi.mock('@react-three/fiber', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@react-three/fiber')>();
    return {
        ...actual,
        Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-canvas">{children}</div>,
        useThree: vi.fn().mockReturnValue({
            camera: {},
            gl: {},
            scene: {},
            size: { width: 800, height: 600 }
        }),
        useFrame: vi.fn()
    };
});

// Mock PoolScene directly to avoid the useTexture error entirely
vi.mock('./PoolScene', () => ({
    default: () => <div data-testid="mock-pool-scene">Pool Scene Mock</div>
}));

// Also need to mock next-themes for useTheme
vi.mock('next-themes', () => ({
    useTheme: () => ({ resolvedTheme: 'light' })
}));

describe('Pool3D', () => {
    const defaultProps = {
        poolLength: PoolLength.SC,
        numbering: NumberingDirection.AWAY,
        startingEnd: StartingEnd.LEFT,
        swimmers: [],
        orderOfFinish: [],
        onOrderOfFinishChange: vi.fn(),
    };

    let originalGetContext: typeof HTMLCanvasElement.prototype.getContext;
    let originalLocation: Location;

    beforeEach(() => {
        originalGetContext = HTMLCanvasElement.prototype.getContext;
        originalLocation = window.location;

        // Mock window.location to simulate test mode
        Object.defineProperty(window, 'location', {
            value: {
                ...originalLocation,
                search: '?testMode=true',
            },
            writable: true,
        });
    });

    afterEach(() => {
        HTMLCanvasElement.prototype.getContext = originalGetContext;
        Object.defineProperty(window, 'location', {
            value: originalLocation,
            writable: true,
        });
        vi.clearAllMocks();
    });

    it('renders Canvas when WebGL is available', () => {
        // Mock getContext to return a truthy value (simulate WebGL support)
        HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({});

        render(<Pool3D {...defaultProps} />);

        expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
        expect(screen.queryByText(/WebGL not available/i)).not.toBeInTheDocument();
    });

    it('handles WebGL context error gracefully', () => {
        // Mock getContext to throw an error
        HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation(() => {
            throw new Error('WebGL not supported');
        });

        render(<Pool3D {...defaultProps} />);

        // The component should catch the error and display the fallback message
        expect(screen.getByText(/WebGL not available\. Shadow Mock is active\./i)).toBeInTheDocument();
        expect(screen.queryByTestId('mock-canvas')).not.toBeInTheDocument();
    });

    it('handles WebGL context returning null gracefully', () => {
        // Mock getContext to return null
        HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null);

        render(<Pool3D {...defaultProps} />);

        expect(screen.getByText(/WebGL not available\. Shadow Mock is active\./i)).toBeInTheDocument();
        expect(screen.queryByTestId('mock-canvas')).not.toBeInTheDocument();
    });
});
