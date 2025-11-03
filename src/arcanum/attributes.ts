// Core shape for attributes
export interface AttributeDef {
    // Human friendly label
    label: string,
    // If the attribute is visible by default
    default: boolean,
    // Default K value for the attribute type
    K: number,
    // What empty binary is known as
    empty: string,
    // If it has a 'Multiple' catch all at the end
    has_multiple: boolen,
    // Ordered list of possible values for the attribute type
    values: readonly string[],
}

export const ATTRS = {
    level: {
        label: 'Level',
        K: 1,
        default: true,
        empty: "None",
        has_multiple: false,
        values: [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9"
        ]
    },
    school: {
        label: 'School',
        K: 2,
        default: true,
        empty: "None",
        has_multiple: false,
        values: [
            "Abjuration",
            "Conjuration",
            "Divination",
            "Enchantment",
            "Evocation",
            "Illusion",
            "Necromancy",
            "Transmutation"
        ]
    },
    damage_type: {
        label: 'Damage Type',
        K: 3,
        default: true,
        empty: "None",
        has_multiple: true,
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
            "Thunder"
        ]
    },
    area_type: {
        label: 'Area Type',
        K: 4,
        default: true,
        empty: "None",
        has_multiple: false,
        values: [
            "Cone (15)",
            "Cone (30)",
            "Cone (40)",
            "Cone (60)",
            "Cube (1)",
            "Cube (10)",
            "Cube (100)",
            "Cube (15)",
            "Cube (150)",
            "Cube (20)",
            "Cube (200)",
            "Cube (2500)",
            "Cube (30)",
            "Cube (40)",
            "Cube (40000)",
            "Cube (5)",
            "Cube (5280)",
            "Cylinder (10)",
            "Cylinder (20)",
            "Cylinder (40)",
            "Cylinder (5)",
            "Cylinder (50)",
            "Cylinder (60)",
            "Line (15)",
            "Line (100)",
            "Line (50)",
            "Line (60)",
            "Line (30)",
            "Line (90)",
            "Sphere (10)",
            "Sphere (100)",
            "Sphere (15)",
            "Sphere (20)",
            "Sphere (30)",
            "Sphere (360)",
            "Sphere (40)",
            "Sphere (5)",
            "Sphere (60)",
            "Sphere (26400)",
            "Square (10)",
            "Square (20)",
            "Square (5)",
            "Square (2500)",
            "Square (5280)"
        ]
    },
    range: {
        label: 'Range',
        K: 5,
        default: true,
        empty: "None",
        has_multiple: false,
        values: [
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
        default: true,
        empty: "Instantaneous",
        has_multiple: false,
        values: [
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
        default: false,
        empty: "None",
        has_multiple: true,
        values: [
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
    },
    attack_type: {
        label: "Attack Type",
        K: 8,
        default: false,
        empty: "None",
        has_multiple: true,
        values: [
            "Charisma",
            "Constitution",
            "Dexterity",
            "Intelligence",
            "Melee Attack",
            "Ranged Attack",
            "Strength",
            "Wisdom"
        ]
    },
    tag: {
        label: 'Tag',
        K: 9,
        default: false,
        empty: "None",
        has_multiple: true,
        values: [
            "Banishment",
            "Biomancy",
            "Buff",
            "Charmed",
            "Chronomancy",
            "Circle Spell",
            "Combat",
            "Communication",
            "Compulsion",
            "Contaminated",
            "Control",
            "Creation",
            "Curse",
            "Damage",
            "Debuff",
            "Deception",
            "Detection",
            "Dunamancy",
            "Elemental",
            "Environment",
            "Exploration",
            "Fey",
            "Foreknowledge",
            "Foresight",
            "Healing",
            "Illumination",
            "Liminal",
            "Movement",
            "Negation",
            "Psionic",
            "Sangromancy",
            "Scrying",
            "Shadow",
            "Shapechanging",
            "Social",
            "Special",
            "Summoning",
            "Teleportation",
            "Utility",
            "Void",
            "Warding",
            "Weather"
        ]
    }
} as const satisfies Record<string, AttributeDef>;

export type AttributeKey = keyof typeof ATTRS;
export type AttributeLabel = (typeof ATTRS)[AttributeKey]['label'];


export const getK = (key: AttributeKey) => ATTRS[key].K;
export const getEmpty = (key: AttributeKey) => ATTRS[key].empty;
export const getMultiple = (key: AttributeKey) => ATTRS[key].has_multiple;
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
export const getEmptyByLabel = (label: string) => getEmpty(keyFromLabel(label));
export const getMultipleByLabel = (label: string) => getMultiple(keyFromLabel(label));
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
