import { useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";

type Props = {
    src: string;
    onClose?: () => void;
    hotspots?: any[];
    defaultYaw?: number;
    defaultPitch?: number;
    onPositionChange?: (yaw: number, pitch: number) => void;
    onReady?: (viewer: any) => void;
};

export default function ViewerWrapper({ src, onClose, hotspots = [], defaultYaw, defaultPitch, onPositionChange, onReady }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const viewerRef = useRef<Viewer | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (animationFrameRef.current) return; // Already rotating

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    handleRotate('up');
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    handleRotate('down');
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    handleRotate('left');
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    handleRotate('right');
                    break;
            }
        };

        const handleKeyUp = () => {
            stopRotation();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            stopRotation();
        };
    }, []);

    useEffect(() => {
        console.log("[ViewerWrapper] Mounting with src:", src);
        if (!containerRef.current) {
            console.error("[ViewerWrapper] Container ref is null!");
            return;
        }
        console.log("[ViewerWrapper] Container dimensions:", {
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight
        });

        let viewer: Viewer;
        try {
            viewer = new Viewer({
                container: containerRef.current,
                panorama: src,
                defaultYaw: defaultYaw || 0,
                defaultPitch: defaultPitch || 0,
                navbar: ['zoom', 'fullscreen', 'caption'],
                plugins: [
                    [MarkersPlugin, {
                        markers: hotspots.map(h => ({
                            id: h.id,
                            position: { yaw: h.yaw, pitch: h.pitch },
                            html: `<div class="bg-white/80 px-2 py-1 rounded text-sm font-bold shadow hover:bg-white cursor-pointer">${h.label}</div>`,
                            data: { ...h }
                        }))
                    }]
                ]
            });
        } catch (error) {
            console.error("[ViewerWrapper] Error initializing viewer:", error);
            return;
        }

        viewerRef.current = viewer;

        if (onReady) onReady(viewer);
        const markersPlugin = viewer.getPlugin(MarkersPlugin) as MarkersPlugin;

        markersPlugin.addEventListener("select-marker", (e: any) => {
            const marker = e.marker;
            if (marker.data && marker.data.onClick) {
                marker.data.onClick();
            }
        });

        if (onPositionChange) {
            viewer.addEventListener('position-updated', (e: any) => {
                onPositionChange(e.position.yaw, e.position.pitch);
            });
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            viewer.destroy();
            viewerRef.current = null;
        };
    }, [src, hotspots]);

    const handleRotate = (direction: 'up' | 'down' | 'left' | 'right') => {
        if (!viewerRef.current) return;

        const step = 0.05; // Rotation speed
        const rotate = () => {
            if (!viewerRef.current) return;

            const position = viewerRef.current.getPosition();
            let newYaw = position.yaw;
            let newPitch = position.pitch;

            switch (direction) {
                case 'left':
                    newYaw -= step;
                    break;
                case 'right':
                    newYaw += step;
                    break;
                case 'up':
                    newPitch += step;
                    break;
                case 'down':
                    newPitch -= step;
                    break;
            }

            viewerRef.current.rotate({ yaw: newYaw, pitch: newPitch });
            animationFrameRef.current = requestAnimationFrame(rotate);
        };

        rotate();
    };

    const stopRotation = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    };

    return (
        <div className="relative w-full h-full bg-black">
            <div className="w-full h-full" ref={containerRef} />

            {/* Virtual Arrow Keys */}
            <div className="absolute bottom-24 right-6 flex flex-col items-center gap-2 z-10">
                <button
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
                    onMouseDown={() => handleRotate('up')}
                    onMouseUp={stopRotation}
                    onMouseLeave={stopRotation}
                    onTouchStart={() => handleRotate('up')}
                    onTouchEnd={stopRotation}
                >
                    <ArrowUp size={24} />
                </button>
                <div className="flex gap-2">
                    <button
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
                        onMouseDown={() => handleRotate('left')}
                        onMouseUp={stopRotation}
                        onMouseLeave={stopRotation}
                        onTouchStart={() => handleRotate('left')}
                        onTouchEnd={stopRotation}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <button
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
                        onMouseDown={() => handleRotate('down')}
                        onMouseUp={stopRotation}
                        onMouseLeave={stopRotation}
                        onTouchStart={() => handleRotate('down')}
                        onTouchEnd={stopRotation}
                    >
                        <ArrowDown size={24} />
                    </button>
                    <button
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
                        onMouseDown={() => handleRotate('right')}
                        onMouseUp={stopRotation}
                        onMouseLeave={stopRotation}
                        onTouchStart={() => handleRotate('right')}
                        onTouchEnd={stopRotation}
                    >
                        <ArrowRight size={24} />
                    </button>
                </div>
            </div>

            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
            )}
        </div>
    );
}
