import { Camera, Group, Scene } from 'three';
import { ISwimmer } from './SwimmerModel';

export interface TestWindow extends Window {
    __TEST_DATA__?: string;
    __TEST_SWIMMER_0__?: Group | { position: { x: number; y: number; z: number }; rotation: { y: number } };
    __TEST_SWIMMER_0_MODEL__?: ISwimmer;
    __TEST_POOL_LENGTH__?: number;
    __TEST_CAMERA__?: Camera | { position: { x: number; y: number; z: number }; rotation: { x: number; y: number; z: number }; fov: number };
    __TEST_PIP_CAMERA__?: Camera | { position: { x: number; y: number; z: number }; rotation: { x: number; y: number; z: number }; fov: number };
    __TEST_SCENE__?: Scene;
}
