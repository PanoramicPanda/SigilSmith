// Core shape for attributes
export interface AttributeDef {
    // Human friendly label
    label: string;
    // Default K value for the attribute type
    K: number,
    // Ordered list of possible values for the attribute type
    values: readonly string[],
}

export const ATTRS = {
    level: {
        label: 'Level',
        K: 1,
        values: [
            "None",
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9"]
    },
    school: {
        label: 'School',
        K: 2,
        values: [
            "None",
            "Abjuration",
            "Conjuration",
            "Divination",
            "Enchantment",
            "Evocation",
            "Illusion",
            "Necromancy",
            "Transmutation"]
    },
    damage_type: {
        label: 'Damage Type',
        K: 3,
        values: [
            "None",
            "Acid",
            "Bludgeoning",
            "Cold",
            "Fire",
            "Force",
            "Lightning",
            "Necrotic",
            "Piercing",
            "Poison",
            "Psychic",
            "Radiant",
            "Slashing",
            "Thunder",
            "Multiple"
        ]
    },
    area_type: {
        label: 'Area Type',
        K: 4,
        values: [
            "None",
            "cone (15)",
            "cone (30)",
            "cone (40)",
            "cone (60)",
            "cube (1)",
            "cube (10)",
            "cube (100)",
            "cube (15)",
            "cube (150)",
            "cube (20)",
            "cube (200)",
            "cube (2500)",
            "cube (30)",
            "cube (40)",
            "cube (40000)",
            "cube (5)",
            "cube (5280)",
            "cylinder (10)",
            "cylinder (20)",
            "cylinder (40)",
            "cylinder (5)",
            "cylinder (50)",
            "cylinder (60)",
            "line (15)",
            "line (100)",
            "line (50)",
            "line (60)",
            "line (30)",
            "line (90)",
            "sphere (10)",
            "sphere (100)",
            "sphere (15)",
            "sphere (20)",
            "sphere (30)",
            "sphere (360)",
            "sphere (40)",
            "sphere (5)",
            "sphere (60)",
            "sphere (26400)",
            "square (10)",
            "square (20)",
            "square (5)",
            "square (2500)",
            "square (5280)"
        ]
    },
    range: {
        label: 'Range',
        K: 5,
        values: [
            "None",
            "1 mile",
            "10 feet",
            "100 feet",
            "120 feet",
            "150 feet",
            "30 feet",
            "300 feet",
            "5 feet",
            "500 feet",
            "500 miles",
            "60 feet",
            "90 feet",
            "Self",
            "Sight",
            "Special",
            "Touch",
            "Unlimited"
        ]
    },
    duration: {
        label: 'Duration',
        K: 6,
        values: [
            "Instantaneous",
            "1 hour",
            "1 minute",
            "1 round",
            "10 days",
            "10 minutes",
            "24 hours",
            "30 days",
            "7 days",
            "6 hours",
            "8 hours",
            "Special",
            "Until dispelled",
            "Up to 1 hour",
            "Up to 1 minute",
            "Up to 1 round",
            "Up to 10 minutes",
            "Up to 2 hours",
            "Up to 24 hours",
            "Up to 8 hours"
        ]
    },
    condition: {
        label: 'Condition',
        K: 7,
        values: [
            "None",
            "Blinded",
            "Charmed",
            "Deafened",
            "Exhaustion",
            "Frightened",
            "Grappled",
            "Incapacitated",
            "Invisible",
            "Paralyzed",
            "Petrified",
            "Poisoned",
            "Prone",
            "Restrained",
            "Stunned",
            "Unconscious",
            "Multiple"
        ]
    }
} as const satisfies Record<string, AttributeDef>;

export type AttributeKey = keyof typeof ATTRS;
export type AttributeLabel = (typeof ATTRS)[AttributeKey]['label'];


export const getK = (key: AttributeKey) => ATTRS[key].K;
export const getValues = (key: AttributeKey) => ATTRS[key].values;

export const getIndex = (key: AttributeKey, value: string) => {
    const index = (ATTRS[key].values as readonly string[]).indexOf(value);
    if (index === -1)
        throw new Error(
            `"${value}" not in ${key}. Valid: ${ATTRS[key].values.join(', ')}`
        );
    return index;
};


// label ↔ key convenience

const normalize = (s: string) => s.trim().toLowerCase();

/** Reverse map (normalized label -> key) for O(1) lookup */
const LABEL_TO_KEY = Object.fromEntries(
    (Object.keys(ATTRS) as AttributeKey[]).map(k => [normalize(ATTRS[k].label), k])
);

export const keyFromLabel = (label: string): AttributeKey => {
    const k = LABEL_TO_KEY[normalize(label)];
    if (!k) throw new Error(`Unknown attribute label "${label}". Known: ${Object.values(ATTRS).map(a => a.label).join(', ')}`);
    return k;
};

export const getKByLabel = (label: string) => getK(keyFromLabel(label));
export const getValuesByLabel = (label: string) => getValues(keyFromLabel(label));
export const getIndexByLabel = (label: string, value: string) => getIndex(keyFromLabel(label), value);


/**
 * Pick the binary row from the *master* binaries by the value's position
 * in that attribute's list.
 */
export const pickBinary = (
    keyOrLabel: AttributeKey | AttributeLabel | string,
    value: string,
    masterBinaries: readonly (readonly number[])[]
): readonly number[] => {
    const key: AttributeKey = (keyOrLabel in ATTRS
        ? (keyOrLabel as AttributeKey)
        : keyFromLabel(String(keyOrLabel)));

    const idx = getIndex(key, value);
    if (idx >= masterBinaries.length) {
        throw new Error(`Master binaries too short: need index ${idx}, length ${masterBinaries.length}`);
    }
    return masterBinaries[idx];
};