export type InspectionResult = 'matched' | 'mismatch';

type InspectionItem = {
    label: string;
    description: string;
    result: InspectionResult;
};

export const checklist: InspectionItem[] = [
    { label: 'Part present', description: 'Part is seated in the fixture', result: 'matched' },
    { label: 'Part orientation', description: 'Part faces the reference direction', result: 'matched' },
    { label: 'Label alignment', description: 'Label sits inside the marked area', result: 'mismatch' },
    { label: 'Fasteners in place', description: 'All fasteners are visible', result: 'matched' },
];

export const events: { title: string; description: string; result: InspectionResult }[] = [
    { title: 'Label alignment mismatch', description: 'Camera 01 · Label outside the marked area', result: 'mismatch' },
    { title: 'Part orientation matched', description: 'Camera 01 · Correct orientation detected', result: 'matched' },
];
