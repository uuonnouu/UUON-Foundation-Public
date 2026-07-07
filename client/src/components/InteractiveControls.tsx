import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractiveControlsProps {
  children: React.ReactNode;
  enablePivoting?: boolean;
  enableRotation?: boolean;
  enableScaling?: boolean;
  onTransformChange?: (transform: {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
  }) => void;
  onReset?: () => void;
}

export default function InteractiveControls({
  children,
  enablePivoting = true,
  enableRotation = true,
  enableScaling = true,
  onTransformChange,
  onReset
}: InteractiveControlsProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { camera, gl, controls } = useThree();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPointer, setLastPointer] = useState({ x: 0, y: 0 });
  const [pivotPoint] = useState(new THREE.Vector3(0, 0, 0));
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  // Track transform state using quaternions for smooth rotation
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));
  const [quaternion, setQuaternion] = useState(new THREE.Quaternion());
  const [scale, setScale] = useState(new THREE.Vector3(1, 1, 1));
  
  // Trackball rotation state
  const [trackballRadius] = useState(1.0);
  const [isTracking, setIsTracking] = useState(false);
  const [lastTrackballPos, setLastTrackballPos] = useState(new THREE.Vector3());
  const [rotationVelocity, setRotationVelocity] = useState(new THREE.Vector3());
  const [dampingFactor] = useState(0.95);

  // Store initial transform state for reset - ensure perfect centering
  const initialPosition = new THREE.Vector3(0, 0, 0);
  const initialQuaternion = new THREE.Quaternion();
  const initialScale = new THREE.Vector3(1, 1, 1);
  const initialCameraPosition = new THREE.Vector3(6, 6, 6);
  
  // Optimal viewing distance for different object types
  const getOptimalCameraDistance = useCallback(() => {
    if (!meshRef.current) return 8;
    
    // Calculate bounding box to determine optimal distance
    const box = new THREE.Box3().setFromObject(meshRef.current);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Optimal distance based on object size with better framing
    return Math.max(maxDim * 2.5, 6); // Minimum distance of 6, scaled by object size
  }, []);
  
  // Calculate optimal camera position for centered viewing
  const getOptimalCameraPosition = useCallback(() => {
    if (!meshRef.current) return initialCameraPosition.clone();
    
    const distance = getOptimalCameraDistance();
    const center = new THREE.Vector3();
    
    // Get object center
    const box = new THREE.Box3().setFromObject(meshRef.current);
    box.getCenter(center);
    
    // Position camera at optimal angle for best view
    const cameraPos = new THREE.Vector3(
      center.x + distance * 0.7,  // Slightly offset for better perspective
      center.y + distance * 0.5,  // Elevated view
      center.z + distance * 0.7   // Forward position
    );
    
    return cameraPos;
  }, [getOptimalCameraDistance]);

  // Trackball mathematics - convert 2D screen coordinates to 3D trackball position
  const getTrackballPosition = useCallback((x: number, y: number) => {
    const rect = gl.domElement.getBoundingClientRect();
    const minDimension = Math.min(rect.width, rect.height);
    
    // Normalize coordinates to [-1, 1] - fix Y-axis inversion
    const normalizedX = (2 * x - rect.width) / minDimension;
    const normalizedY = (2 * y - rect.height) / minDimension;
    
    // Calculate z coordinate for trackball sphere
    const distanceSquared = normalizedX * normalizedX + normalizedY * normalizedY;
    let z = 0;
    
    if (distanceSquared <= trackballRadius * trackballRadius / 2) {
      // Inside sphere - use spherical surface
      z = Math.sqrt(trackballRadius * trackballRadius - distanceSquared);
    } else {
      // Outside sphere - use hyperbolic sheet
      z = (trackballRadius * trackballRadius / 2) / Math.sqrt(distanceSquared);
    }
    
    return new THREE.Vector3(normalizedX, normalizedY, z).normalize();
  }, [gl.domElement, trackballRadius]);

  // Calculate rotation quaternion from trackball movement
  const calculateTrackballRotation = useCallback((startPos: THREE.Vector3, endPos: THREE.Vector3) => {
    const axis = new THREE.Vector3().crossVectors(startPos, endPos).normalize();
    const angle = Math.acos(Math.max(-1, Math.min(1, startPos.dot(endPos))));
    
    if (axis.length() === 0 || angle === 0) {
      return new THREE.Quaternion();
    }
    
    return new THREE.Quaternion().setFromAxisAngle(axis, angle);
  }, []);

  // Reset both transform and camera to initial state with smooth transition
  const resetTransform = useCallback(() => {
    if (!meshRef.current) return;

    setIsResetting(true);

    // Reset shape transform instantly
    meshRef.current.position.copy(initialPosition);
    meshRef.current.quaternion.copy(initialQuaternion);
    meshRef.current.scale.copy(initialScale);

    setPosition(initialPosition.clone());
    setQuaternion(initialQuaternion.clone());
    setScale(initialScale.clone());

    // Calculate optimal camera position based on object size
    const optimalCameraPos = getOptimalCameraPosition();
    const center = new THREE.Vector3();
    
    // Get object center for target
    const box = new THREE.Box3().setFromObject(meshRef.current);
    box.getCenter(center);

    // Smooth camera transition for better user experience
    if (controls) {
      // Disable damping temporarily for immediate response
      (controls as any).enableDamping = false;
      
      // Set new target (object center)
      (controls as any).target.copy(center);
      
      // Animate camera to optimal position
      const startPos = camera.position.clone();
      const endPos = optimalCameraPos;
      let animationProgress = 0;
      
      const animateCamera = () => {
        animationProgress += 0.1; // Smooth 1-second animation
        
        if (animationProgress <= 1) {
          // Smooth interpolation
          camera.position.lerpVectors(startPos, endPos, animationProgress);
          camera.lookAt(center);
          camera.updateProjectionMatrix();
          
          requestAnimationFrame(animateCamera);
        } else {
          // Animation complete - re-enable damping
          (controls as any).enableDamping = true;
          (controls as any).dampingFactor = 0.05;
          (controls as any).update();
          
          console.log('Camera centered and zoomed to optimal viewing distance');
        }
      };
      
      requestAnimationFrame(animateCamera);
    } else {
      // Fallback if no controls available
      camera.position.copy(optimalCameraPos);
      camera.lookAt(center);
      camera.updateProjectionMatrix();
    }

    console.log('Transform and camera reset with optimal positioning');

    // Trigger callback if provided
    if (onReset) {
      onReset();
    }

    // Hide reset indicator after positioning completes
    setTimeout(() => setIsResetting(false), 1200);
  }, [camera, controls, onReset, getOptimalCameraPosition]);

  // Handle pointer down with double-click detection and trackball initialization
  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;

    // Double-click detection (within 400ms for better precision)
    if (timeDiff < 400 && timeDiff > 50) {
      resetTransform();
      setLastClickTime(0); // Reset to prevent triple-click issues
      return;
    }

    setLastClickTime(currentTime);
    setIsDragging(true);
    setIsTracking(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setLastPointer({ x: e.clientX, y: e.clientY });
    
    // Initialize trackball position
    const trackballPos = getTrackballPosition(e.clientX, e.clientY);
    setLastTrackballPos(trackballPos);
    setRotationVelocity(new THREE.Vector3(0, 0, 0));
  }, [lastClickTime, resetTransform, getTrackballPosition]);

  // Handle pointer move with trackball rotation
  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !meshRef.current) return;
    e.stopPropagation();

    if (isTracking && enableRotation && e.buttons === 1 && !e.shiftKey && !e.altKey && !e.ctrlKey) {
      // Trackball rotation - smooth mathematical object rotation
      const currentTrackballPos = getTrackballPosition(e.clientX, e.clientY);
      const rotationQuat = calculateTrackballRotation(lastTrackballPos, currentTrackballPos);
      
      if (rotationQuat.length() > 0) {
        // Apply trackball rotation to current quaternion - fix inverted rotation
        const newQuaternion = quaternion.clone();
        newQuaternion.multiplyQuaternions(newQuaternion, rotationQuat);
        newQuaternion.normalize();

        setQuaternion(newQuaternion);
        meshRef.current.quaternion.copy(newQuaternion);
        
        // Calculate rotation velocity for momentum
        const axis = new THREE.Vector3().crossVectors(lastTrackballPos, currentTrackballPos);
        const speed = lastTrackballPos.distanceTo(currentTrackballPos) * 0.5;
        setRotationVelocity(axis.multiplyScalar(speed));
      }
      
      setLastTrackballPos(currentTrackballPos);
    }
    else if (enablePivoting && e.buttons === 1 && e.shiftKey) {
      // Shift + left mouse - constrained axis rotation
      const deltaX = (e.clientX - lastPointer.x) * 0.01;
      const deltaY = (e.clientY - lastPointer.y) * 0.01;
      
      const zQuaternion = new THREE.Quaternion();
      const zAxis = new THREE.Vector3(0, 0, 1);
      zQuaternion.setFromAxisAngle(zAxis, deltaX);

      const newQuaternion = quaternion.clone();
      newQuaternion.multiplyQuaternions(zQuaternion, newQuaternion);
      newQuaternion.normalize();

      setQuaternion(newQuaternion);
      meshRef.current.quaternion.copy(newQuaternion);
    }
    else if (enablePivoting && e.buttons === 2) {
      // Right mouse button - translation
      const deltaX = (e.clientX - lastPointer.x) * 0.01;
      const deltaY = (e.clientY - lastPointer.y) * 0.01;
      
      meshRef.current.position.x += deltaX;
      meshRef.current.position.y -= deltaY;

      setPosition(meshRef.current.position.clone());
    }

    setLastPointer({ x: e.clientX, y: e.clientY });
  }, [isDragging, isTracking, lastPointer, lastTrackballPos, enablePivoting, enableRotation, quaternion, getTrackballPosition, calculateTrackballRotation]);

  // Handle pointer up - end trackball interaction
  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsDragging(false);
    setIsTracking(false);
  }, []);

  // Handle wheel for scaling
  const handleWheel = useCallback((e: ThreeEvent<WheelEvent>) => {
    if (!meshRef.current || !enableScaling) return;
    e.stopPropagation();

    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = scale.clone().multiplyScalar(scaleFactor);

    // Clamp scale to reasonable limits
    newScale.clampScalar(0.1, 10);
    setScale(newScale);

    meshRef.current.scale.copy(newScale);
  }, [enableScaling, scale]);

  // Momentum-based rotation animation
  useFrame(() => {
    if (!meshRef.current) return;

    // Apply momentum rotation when not actively dragging
    if (!isDragging && rotationVelocity.length() > 0.001) {
      const axis = rotationVelocity.clone().normalize();
      const speed = rotationVelocity.length();
      
      // Create momentum rotation
      const momentumQuat = new THREE.Quaternion().setFromAxisAngle(axis, speed * 0.016); // 60fps
      
      // Apply to current quaternion
      const newQuaternion = quaternion.clone();
      newQuaternion.multiplyQuaternions(momentumQuat, newQuaternion);
      newQuaternion.normalize();
      
      setQuaternion(newQuaternion);
      meshRef.current.quaternion.copy(newQuaternion);
      
      // Apply damping to velocity
      setRotationVelocity(rotationVelocity.multiplyScalar(dampingFactor));
    }

    // Update transform callback
    if (onTransformChange) {
      onTransformChange({
        position: meshRef.current.position,
        rotation: meshRef.current.rotation,
        scale: meshRef.current.scale
      });
    }
  }, [isDragging, rotationVelocity, quaternion, dampingFactor, onTransformChange]);

  return (
    <group 
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    >
      {children}

      {/* Visual indicators for interaction */}
      {isDragging && (
        <>
          {/* Pivot point indicator */}
          <mesh position={pivotPoint}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ff6b6b" transparent opacity={0.7} />
          </mesh>

          {/* Rotation rings */}
          <group>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[2, 0.02, 8, 32]} />
              <meshBasicMaterial color="#4ecdc4" transparent opacity={0.3} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[2, 0.02, 8, 32]} />
              <meshBasicMaterial color="#45b7d1" transparent opacity={0.3} />
            </mesh>
            <mesh>
              <torusGeometry args={[2, 0.02, 8, 32]} />
              <meshBasicMaterial color="#f9ca24" transparent opacity={0.3} />
            </mesh>
          </group>
        </>
      )}

      {/* Reset indicator - Enhanced visibility */}
      {isResetting && (
        <group>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.2, 20, 20]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.9} />
          </mesh>
          {/* Pulsing ring for better visibility */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.02, 8, 16]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.25, 0.02, 8, 16]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.6} />
          </mesh>
        </group>
      )}
    </group>
  );
}