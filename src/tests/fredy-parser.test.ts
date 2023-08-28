import YAML from 'yaml'
import fs from 'fs';
import { parseDefs, parseModel, parseNode } from '../modules/fredy-parser';
import { And, Not, Or, Predicate } from '../modules/fredy-model';
import { default as _ } from 'lodash';

test('Yaml', () => {
    const file = fs.readFileSync('./src/animals.yml', 'utf8');
    const yaml = YAML.parse(file)
    //console.log(yaml);
});

describe('parseModel', () => {
    test('parseNode predicate', () => {
        const defs = {
            type: 'predicate',
            id: 'pred'
        };

        const result = parseNode(defs, '');
        expect(result).toBeInstanceOf(Predicate);
        expect((result as Predicate).id).toBe('pred');
    });

    test('parseNode not', () => {
        const defs = {
            type: 'not',
            expression: {
                type: 'predicate',
                id: 'pred'
            }
        };

        const result = parseNode(defs, '');

        expect(result).toBeInstanceOf(Not);
        const notArg = (result as Not).expression;
        expect(notArg).toBeInstanceOf(Predicate);
        expect((notArg as Predicate).id).toEqual('pred');
    });

    test('parseNode and', () => {
        const defs = {
            type: 'and',
            expressions: [
                {
                    type: 'predicate',
                    id: 'pred0'
                }, {
                    type: 'predicate',
                    id: 'pred1'
                }
            ]
        };

        const result = parseNode(defs, '');

        expect(result).toBeInstanceOf(And);
        const args = (result as And).expressions;
        expect(args).toHaveLength(2);
        expect(args[0]).toBeInstanceOf(Predicate);
        expect((args[0] as Predicate).id).toEqual('pred0');
        expect(args[1]).toBeInstanceOf(Predicate);
        expect((args[1] as Predicate).id).toEqual('pred1');
    });

    test('parseNode or', () => {
        const defs = {
            type: 'or',
            expressions: [
                {
                    type: 'predicate',
                    id: 'pred0'
                }, {
                    type: 'predicate',
                    id: 'pred1'
                }
            ]
        };

        const result = parseNode(defs, '');

        expect(result).toBeInstanceOf(Or);
        const args = (result as Or).expressions;
        expect(args).toHaveLength(2);
        expect(args[0]).toBeInstanceOf(Predicate);
        expect((args[0] as Predicate).id).toEqual('pred0');
        expect(args[1]).toBeInstanceOf(Predicate);
        expect((args[1] as Predicate).id).toEqual('pred1');
    });

    test('parseModel', () => {
        const defs = {
            a: {
                type: 'predicate',
                id: 'c'
            },
            b: {
                type: 'predicate',
                id: 'd'
            }
        };

        const result = parseModel(defs, '');

        const args = result.assertions;
        expect(args.size).toBe(2);
        expect(args.get('a')).toBeInstanceOf(Predicate);
        expect((args.get('a') as Predicate).id).toEqual('c');
        expect(args.get('b')).toBeInstanceOf(Predicate);
        expect((args.get('b') as Predicate).id).toEqual('d');
    });

    test('parse no lang', () => {
        const defs = {
            model: {
                a: {
                    type: 'predicate',
                    id: 'c'
                },
                b: {
                    type: 'predicate',
                    id: 'd'
                }
            }
        };

        const result = parseDefs(defs, '');

        const assertions = result.model.assertions;
        expect(assertions.size).toBe(2);
        expect(assertions.get('a')).toBeInstanceOf(Predicate);
        expect((assertions.get('a') as Predicate).id).toEqual('c');
        expect(assertions.get('b')).toBeInstanceOf(Predicate);
        expect((assertions.get('b') as Predicate).id).toEqual('d');
        expect(result.languages).toBeUndefined();
    });

    test('parse empty languages', () => {
        const defs = {
            model: {
                a: {
                    type: 'predicate',
                    id: 'c'
                },
                b: {
                    type: 'predicate',
                    id: 'd'
                }
            },
            languages: {}
        };

        const result = parseDefs(defs, '');

        const assertions = result.model.assertions;
        expect(assertions.size).toBe(2);
        expect(assertions.get('a')).toBeInstanceOf(Predicate);
        expect((assertions.get('a') as Predicate).id).toEqual('c');
        expect(assertions.get('b')).toBeInstanceOf(Predicate);
        expect((assertions.get('b') as Predicate).id).toEqual('d');
        expect(result.languages).toBeDefined();
        expect(_.keys(result.languages)).toHaveLength(0);
    });

    test('parse default empty language', () => {
        const defs = {
            model: {
                a: {
                    type: 'predicate',
                    id: 'c'
                },
                b: {
                    type: 'predicate',
                    id: 'd'
                }
            },
            languages: {
                'default': {}
            }
        };

        const result = parseDefs(defs, '');

        const assertions = result.model.assertions;
        expect(assertions.size).toBe(2);
        expect(assertions.get('a')).toBeInstanceOf(Predicate);
        expect((assertions.get('a') as Predicate).id).toEqual('c');
        expect(assertions.get('b')).toBeInstanceOf(Predicate);
        expect((assertions.get('b') as Predicate).id).toEqual('d');
        expect(result.languages?.default).toBeDefined();
    });

    test('parse default language', () => {
        const defs = {
            model: {
                a: {
                    type: 'predicate',
                    id: 'c'
                },
                b: {
                    type: 'predicate',
                    id: 'd'
                }
            },
            languages: {
                'default': {
                    a: 'a predicate'
                }
            }
        };

        const result = parseDefs(defs, '');

        const assertions = result.model.assertions;
        expect(assertions.size).toBe(2);
        expect(assertions.get('a')).toBeInstanceOf(Predicate);
        expect((assertions.get('a') as Predicate).id).toEqual('c');
        expect(assertions.get('b')).toBeInstanceOf(Predicate);
        expect((assertions.get('b') as Predicate).id).toEqual('d');
        expect(result.languages?.default?.a).toEqual('a predicate');
    });
})