'use client'

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Box3, Color, Group, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import { ISwimmer } from "@/modules/SwimmerModel";
import { TestWindow } from "@/modules/testTypes";

type Swimmer3DProps = {
    swimmer: ISwimmer;
    laneIndex: number;
    laneWidth: number;
    poolLength: number;
    isRight: boolean;
    waterY: number;
    onPositionUpdate?: (index: number, x: number, z: number, vx: number, vz: number) => void;
};

function BoatModel({ color }: { color: string }) {
    const { scene } = useGLTF('/images/boat.glb');

    // Clone the scene so each swimmer/boat has its own color
    const clonedScene = useMemo(() => {
        const clone = scene.clone();

        // Calculate current length of the boat in the GLB (usually Y or Z depending on export)
        const bbox = new Box3().setFromObject(clone);
        const size = new Vector3();
        bbox.getSize(size);

        // We want the total length to be 1.5m
        // We'll find the largest dimension (assuming it's the length)
        const currentLength = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / currentLength;
        clone.scale.set(scale, scale, scale);

        // Re-center the boat so it's centered at (0,0,0) locally
        const center = new Vector3();
        bbox.getCenter(center);
        clone.position.sub(center.multiplyScalar(scale));

        // Shift it slightly up so it's not half-underwater if that's the intention,
        // but for now let's just center it as the avatar was.
        // The original avatar was centered at waterY.

        return clone;
    }, [scene]);

    // Apply color to all meshes in the boat
    useMemo(() => {
        const threeColor = new Color(color);
        clonedScene.traverse((obj) => {
            if ((obj as Mesh).isMesh) {
                const mesh = obj as Mesh;
                // If it already has a material, clone it and set the color
                if (mesh.material) {
                    const mat = (mesh.material as MeshStandardMaterial).clone();
                    mat.color.set(threeColor);
                    // Remove existing textures so they don't multiply with the color and make it look dark
                    mat.map = null;
                    mat.normalMap = null;
                    mat.roughnessMap = null;
                    mat.metalnessMap = null;
                    mat.aoMap = null;

                    // Explicitly opaque to avoid transparency sorting issues
                    mat.transparent = false;
                    mat.opacity = 1.0;

                    // Don't let vertex colors darken the model
                    mat.vertexColors = false;

                    // Standard properties for a clean look
                    mat.roughness = 0.7;
                    mat.metalness = 0.2;

                    mesh.material = mat;
                }
            }
        });
    }, [clonedScene, color]);

    return <primitive object={clonedScene} />;
}

export default function Swimmer3D({ swimmer, laneIndex, laneWidth, poolLength, isRight, waterY, onPositionUpdate }: Swimmer3DProps) {
    const groupRef = useRef<Group>(null);
    const color = swimmer.avatar.color;

    useFrame(() => {
        if (!groupRef.current) return;

        // Expose for testing
        if (laneIndex === 0) {
            const testWin = window as unknown as TestWindow;
            testWin.__TEST_SWIMMER_0__ = groupRef.current;
            testWin.__TEST_SWIMMER_0_MODEL__ = swimmer;
            testWin.__TEST_POOL_LENGTH__ = poolLength;
        }

        // Location is 0.0 to 1.0 representing the distance completed along the CURRENT lap.
        const { location: loc, direction: dir } = swimmer.where();

        // In SwimmerModel, Direction.TOTURN is 1, Direction.TOSTART is 0
        const headingToTurn = dir === 1;

        // Swimmer dimensions: Current avatars are 1.5m total
        const swimmerLength = 1.5;
        const halfLength = swimmerLength / 2;
        const travelRange = poolLength - swimmerLength;

        let xPos = 0;
        if (!isRight) {
            // Start is at X=0, Turn is at X=poolLength
            // Using anchor-like logic to keep the swimmer between 0 and poolLength.
            xPos = halfLength + loc * travelRange;
        } else {
            // Start is at X=poolLength, Turn is at X=0
            xPos = (poolLength - halfLength) - loc * travelRange;
        }

        // Z pos across lanes
        const zPos = (laneIndex + 0.5) * laneWidth;

        // Rotation: Point in direction of travel
        // Normal (isRight=false): ToTurn is +X, ToStart is -X
        // Flipped (isRight=true): ToTurn is -X, ToStart is +X
        let movingRight = false;
        if (!isRight) {
            movingRight = headingToTurn;
        } else {
            movingRight = !headingToTurn;
        }

        const isDone = swimmer.isDone();
        const vx = isDone ? 0.0 : (movingRight ? 1.0 : -1.0);
        const vz = 0.0;

        groupRef.current.position.set(xPos, waterY + 0.1, zPos);

        if (onPositionUpdate) {
            // The head tip is 0.75m from the group center in the direction of travel
            const forwardX = movingRight ? 0.75 : -0.75;
            onPositionUpdate(laneIndex, xPos + forwardX, zPos, vx, vz);
        }

        // The boat model should point in the direction of travel
        // We add Math.PI / 2 to the previous rotation to rotate 90 degrees CCW
        groupRef.current.rotation.y = movingRight ? Math.PI : 0;
    });

    return (
        <group ref={groupRef}>
            <BoatModel color={color} />
        </group>
    );
}

useGLTF.preload('/images/boat.glb');
