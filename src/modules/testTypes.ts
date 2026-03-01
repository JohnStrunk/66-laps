import { Camera, Group } from 'three';
import { ISwimmer } from './SwimmerModel';

export interface TestWindow extends Window {
    __TEST_SWIMMER_0__?: Group;
    __TEST_SWIMMER_0_MODEL__?: ISwimmer;
    __TEST_POOL_LENGTH__?: number;
    __TEST_CAMERA__?: Camera;
}
