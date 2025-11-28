export interface SceneOverride {
    id: string;
    label: string;
}

export const SCENE_OVERRIDES: Record<string, SceneOverride[]> = {
    "block1": [
        { id: "block1-12", label: "Entrance 1" },
        { id: "block1-13", label: "Entrance 2" },
        { id: "block1-43", label: "Reception" },
        { id: "block1-44", label: "Office" },
        { id: "block1-56", label: "Panel room" },
        { id: "block1-45", label: "MBA and SBM" },
        { id: "block1-49", label: "Library Entrance" },
        { id: "block1-50", label: "Library." },
        { id: "block1-47", label: "Auditorium" },
        { id: "block1-51", label: "Auditorium Exit" },
        { id: "block1-53", label: "Bloombergs Lab" },
        { id: "block1-57", label: "Classroom" },
        { id: "block1-58", label: "Chemistry Lab" },
        { id: "block1-59", label: "Chemistry Lab 2" },
        { id: "block1-61", label: "MBA Canteen" }
    ],
    "gatetologo": [
        { id: "gatetologo-1", label: "Main Entrance" },
        { id: "gatetologo-5", label: "KNS" },
        { id: "gatetologo-6", label: "BirdsPark near KNS" },
        { id: "gatetologo-9", label: "The Pathway" },
        { id: "gatetologo-10", label: "The Pathway" },
        { id: "gatetologo-3", label: "Car Parking" },
        { id: "gatetologo-4", label: "Electric Car charging" },
        { id: "gatetologo-11", label: "Christ Sign Board" }
    ]
};
