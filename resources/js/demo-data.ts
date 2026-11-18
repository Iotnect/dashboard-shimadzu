export const inspectionResults = ['ok', 'review', 'error'] as const;
export type InspectionResult = (typeof inspectionResults)[number];
export const resultLabels = { ok: 'OK', review: 'Needs review', error: 'Error' };

export type InspectionItem = {
    label: string;
    description: string;
    result: InspectionResult;
};

export const checklist: InspectionItem[] = [
    { label: 'Hazard warning label', description: 'Missing from the panel', result: 'error' },
    { label: 'Ethernet port', description: 'Port is aligned and unobstructed', result: 'ok' },
    { label: 'WLAN adapter', description: 'Adapter is partly obscured', result: 'review' },
    { label: 'USB port', description: 'Port is seated and unobstructed', result: 'ok' },
    { label: 'AC power inlet', description: 'Inlet is flush with the panel', result: 'ok' },
    { label: 'Rating label', description: 'Voltage marking is hard to read', result: 'review' },
];

export const events: { title: string; description: string; result: InspectionResult }[] = [
    { title: 'Hazard warning label missing', description: 'Camera 01 · Label not visible in the expected position', result: 'error' },
    { title: 'WLAN adapter partly obscured', description: 'Camera 01 · Visibility check inconclusive', result: 'review' },
    { title: 'Ethernet port verified', description: 'Camera 01 · Port aligned and unobstructed', result: 'ok' },
];
