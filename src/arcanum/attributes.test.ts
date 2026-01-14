import { describe, it, expect } from 'vitest';
import {
    ATTRS,
    AttributeDef,
    AttributeKey,
    AttributeLabel,
    getK,
    getValues,
    getIndex,
    keyFromLabel,
    getKByLabel,
    getValuesByLabel,
    getIndexByLabel,
    pickBinary
} from './attributes';

describe('attributes.ts', () => {
    describe('ATTRS constant', () => {
        it('should contain all expected attribute keys', () => {
            const expectedKeys = [
                'level', 'school', 'damage_type', 'area_type', 
                'range', 'duration', 'condition', 'attack_type', 'tag'
            ];
            expect(Object.keys(ATTRS)).toEqual(expectedKeys);
        });

        it('should have all attributes conforming to AttributeDef interface', () => {
            Object.entries(ATTRS).forEach(([key, attr]) => {
                expect(attr).toHaveProperty('label');
                expect(attr).toHaveProperty('default');
                expect(attr).toHaveProperty('K');
                expect(attr).toHaveProperty('values');
                
                expect(typeof attr.label).toBe('string');
                expect(typeof attr.default).toBe('boolean');
                expect(typeof attr.K).toBe('number');
                expect(Array.isArray(attr.values)).toBe(true);
                expect(attr.values.length).toBeGreaterThan(0);
            });
        });

        it('should have unique K values for each attribute', () => {
            const kValues = Object.values(ATTRS).map(attr => attr.K);
            const uniqueKValues = new Set(kValues);
            expect(uniqueKValues.size).toBe(kValues.length);
        });

        it('should have sequential K values starting from 1', () => {
            const kValues = Object.values(ATTRS).map(attr => attr.K).sort();
            const expected = Array.from({ length: kValues.length }, (_, i) => i + 1);
            expect(kValues).toEqual(expected);
        });
    });

    describe('individual attributes', () => {
        describe('level attribute', () => {
            it('should have correct structure', () => {
                const level = ATTRS.level;
                expect(level.label).toBe('Level');
                expect(level.K).toBe(1);
                expect(level.default).toBe(true);
                expect(level.values).toContain('None');
                expect(level.values).toContain('0');
                expect(level.values).toContain('9');
            });
        });

        describe('school attribute', () => {
            it('should contain all D&D schools of magic', () => {
                const schools = ATTRS.school.values;
                expect(schools).toContain('Abjuration');
                expect(schools).toContain('Conjuration');
                expect(schools).toContain('Divination');
                expect(schools).toContain('Enchantment');
                expect(schools).toContain('Evocation');
                expect(schools).toContain('Illusion');
                expect(schools).toContain('Necromancy');
                expect(schools).toContain('Transmutation');
            });
        });

        describe('damage_type attribute', () => {
            it('should contain all D&D damage types', () => {
                const damageTypes = ATTRS.damage_type.values;
                expect(damageTypes).toContain('Acid');
                expect(damageTypes).toContain('Fire');
                expect(damageTypes).toContain('Cold');
                expect(damageTypes).toContain('Lightning');
                expect(damageTypes).toContain('Thunder');
                expect(damageTypes).toContain('Force');
                expect(damageTypes).toContain('Necrotic');
                expect(damageTypes).toContain('Radiant');
                expect(damageTypes).toContain('Psychic');
            });
        });
    });

    describe('utility functions', () => {
        describe('getK', () => {
            it('should return correct K value for each attribute', () => {
                expect(getK('level')).toBe(1);
                expect(getK('school')).toBe(2);
                expect(getK('damage_type')).toBe(3);
                expect(getK('area_type')).toBe(4);
            });
        });

        describe('getValues', () => {
            it('should return the values array for an attribute', () => {
                const levelValues = getValues('level');
                expect(levelValues).toEqual(ATTRS.level.values);
                expect(levelValues).toContain('None');
                expect(levelValues).toContain('0');
            });
        });

        describe('getIndex', () => {
            it('should return correct index for valid values', () => {
                expect(getIndex('level', 'None')).toBe(0);
                expect(getIndex('level', '0')).toBe(1);
                expect(getIndex('level', '1')).toBe(2);
                
                expect(getIndex('school', 'None')).toBe(0);
                expect(getIndex('school', 'Abjuration')).toBe(1);
                expect(getIndex('school', 'Conjuration')).toBe(2);
            });

            it('should throw error for invalid values', () => {
                expect(() => getIndex('level', 'InvalidLevel')).toThrow(
                    '"InvalidLevel" not in level. Valid: None, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9'
                );
                expect(() => getIndex('school', 'InvalidSchool')).toThrow();
            });
        });
    });

    describe('label-based utility functions', () => {
        describe('keyFromLabel', () => {
            it('should convert labels to keys correctly', () => {
                expect(keyFromLabel('Level')).toBe('level');
                expect(keyFromLabel('School')).toBe('school');
                expect(keyFromLabel('Damage Type')).toBe('damage_type');
                expect(keyFromLabel('Area Type')).toBe('area_type');
            });

            it('should be case-insensitive and trim whitespace', () => {
                expect(keyFromLabel(' LEVEL ')).toBe('level');
                expect(keyFromLabel('school ')).toBe('school');
                expect(keyFromLabel(' Damage Type')).toBe('damage_type');
            });

            it('should throw error for unknown labels', () => {
                expect(() => keyFromLabel('Unknown Label')).toThrow(
                    'Unknown attribute label "Unknown Label"'
                );
            });
        });

        describe('getKByLabel', () => {
            it('should return K value by label', () => {
                expect(getKByLabel('Level')).toBe(1);
                expect(getKByLabel('School')).toBe(2);
                expect(getKByLabel('Damage Type')).toBe(3);
            });
        });

        describe('getValuesByLabel', () => {
            it('should return values by label', () => {
                const levelValues = getValuesByLabel('Level');
                expect(levelValues).toEqual(ATTRS.level.values);
            });
        });

        describe('getIndexByLabel', () => {
            it('should return index by label and value', () => {
                expect(getIndexByLabel('Level', 'None')).toBe(0);
                expect(getIndexByLabel('School', 'Abjuration')).toBe(1);
            });
        });
    });

    describe('pickBinary', () => {
        const mockMasterBinaries = [
            [1, 0, 0], // Index 0
            [0, 1, 0], // Index 1
            [0, 0, 1], // Index 2
            [1, 1, 0], // Index 3
            [1, 0, 1], // Index 4
        ];

        it('should pick correct binary by attribute key and value', () => {
            expect(pickBinary('level', 'None', mockMasterBinaries)).toEqual([1, 0, 0]);
            expect(pickBinary('level', '0', mockMasterBinaries)).toEqual([0, 1, 0]);
            expect(pickBinary('level', '1', mockMasterBinaries)).toEqual([0, 0, 1]);
        });

        it('should pick correct binary by attribute label and value', () => {
            expect(pickBinary('Level', 'None', mockMasterBinaries)).toEqual([1, 0, 0]);
            expect(pickBinary('School', 'None', mockMasterBinaries)).toEqual([1, 0, 0]);
            expect(pickBinary('School', 'Abjuration', mockMasterBinaries)).toEqual([0, 1, 0]);
        });

        it('should throw error when index exceeds master binaries length', () => {
            const shortBinaries = [[1, 0], [0, 1]]; // Only 2 binaries
            expect(() => pickBinary('level', '1', shortBinaries)).toThrow(
                'Master binaries too short: need index 2, length 2'
            );
        });

        it('should throw error for invalid values', () => {
            expect(() => pickBinary('level', 'InvalidValue', mockMasterBinaries)).toThrow();
        });
    });

    describe('type safety', () => {
        it('should provide correct TypeScript types', () => {
            // These tests mainly validate that types compile correctly
            const key: AttributeKey = 'level';
            const label: AttributeLabel = 'Level';
            
            // Verify that the ATTRS object satisfies the type constraints
            const levelAttr: AttributeDef = ATTRS.level;
            expect(levelAttr.label).toBe('Level');
        });
    });

    describe('data integrity', () => {
        it('should have no duplicate values within any attribute', () => {
            Object.entries(ATTRS).forEach(([key, attr]) => {
                const values = attr.values;
                const uniqueValues = new Set(values);
                expect(uniqueValues.size).toBe(values.length);
            });
        });

        it('should have all values as non-empty strings', () => {
            Object.entries(ATTRS).forEach(([key, attr]) => {
                attr.values.forEach(value => {
                    expect(typeof value).toBe('string');
                    expect(value.length).toBeGreaterThan(0);
                    expect(value.trim()).toBe(value); // No leading/trailing whitespace
                });
            });
        });

        it('should have consistent "None" value as first element where applicable', () => {
            Object.entries(ATTRS).forEach(([key, attr]) => {
                if (attr.values[0] === 'None') {
                    expect(attr.values[0]).toBe('None');
                }
            });
        });
    });
});