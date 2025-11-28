import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Layers, Map, MoreVertical, Share2 } from 'lucide-react';
import ViewerWrapper from './ViewerWrapper';
import manifestData from '../data/manifest.json';

import { SCENE_OVERRIDES } from '../data/scene_overrides';

export default function EditorLayout() {
    const { blockId } = useParams();
    const navigate = useNavigate();

    // Find the current block
    const block = useMemo(() =>
        manifestData.blocks.find(b => b.id === blockId),
        [blockId]);

    const scenes = useMemo(() => {
        if (!block) return [];

        const overrides = SCENE_OVERRIDES[block.id];
        if (overrides) {
            return overrides.map(override => {
                const originalScene = block.labs.find(lab => lab.id === override.id);
                if (originalScene) {
                    return { ...originalScene, label: override.label };
                }
                return null;
            }).filter((scene): scene is NonNullable<typeof scene> => scene !== null);
        }

        return block.labs;
    }, [block]);

    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Reset scene index when block changes
    useEffect(() => {
        setCurrentSceneIndex(0);
    }, [blockId]);

    if (!block) {
        return <div className="flex items-center justify-center h-screen text-white">Block not found</div>;
    }

    const currentScene = scenes[currentSceneIndex];

    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden">
            {/* Top Bar */}
            <header className="h-14 bg-surface border-b border-white/5 flex items-center justify-between px-4 z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-semibold text-sm">{block.label}</h1>
                        <div className="text-xs text-text-muted flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Saved
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="btn-secondary text-sm py-1.5 flex items-center gap-2">
                        <Share2 size={16} />
                        Share
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-text-secondary">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Sidebar - Scene Reel */}
                <div
                    className={`bg-surface border-r border-white/5 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 opacity-0'
                        }`}
                >
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <h2 className="font-medium text-sm flex items-center gap-2">
                            <Layers size={16} className="text-primary" />
                            Scenes ({scenes.length})
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {scenes.map((scene, idx) => (
                            <div
                                key={scene.id}
                                onClick={() => setCurrentSceneIndex(idx)}
                                className={`p-2 rounded-lg cursor-pointer transition-all border ${currentSceneIndex === idx
                                    ? 'bg-primary/10 border-primary/50'
                                    : 'hover:bg-white/5 border-transparent'
                                    }`}
                            >
                                <div className="aspect-video rounded bg-surface-light mb-2 overflow-hidden relative">
                                    <img
                                        src={scene.thumbnail || scene.panorama}
                                        alt={scene.label}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    {currentSceneIndex === idx && (
                                        <div className="absolute inset-0 border-2 border-primary rounded pointer-events-none" />
                                    )}
                                </div>
                                <div className={`text-xs truncate ${currentSceneIndex === idx ? 'text-primary font-medium' : 'text-text-secondary'}`}>
                                    {scene.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Toggle Sidebar Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-surface border border-white/10 p-1 rounded-r shadow-lg text-text-secondary hover:text-white"
                    style={{ left: isSidebarOpen ? '256px' : '0' }}
                >
                    {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>

                {/* Main Viewer Area */}
                <div className="flex-1 bg-black relative">
                    {currentScene && (
                        <ViewerWrapper
                            src={currentScene.panorama}
                            hotspots={[]} // TODO: Add hotspots from data
                        />
                    )}

                    {/* Bottom Control Bar Overlay */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl z-10">
                        <button className="text-white hover:text-primary transition-colors tooltip" title="Map View">
                            <Map size={20} />
                        </button>
                        <div className="w-px h-4 bg-white/20"></div>
                        <div className="text-sm font-medium min-w-[100px] text-center">
                            {currentScene?.label}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
