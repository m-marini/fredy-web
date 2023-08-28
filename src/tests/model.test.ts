import YAML from 'yaml'
import { parseDefs } from '../modules/fredy-parser';
import fs from 'fs';
import { And, InferenceNode, Model, Not, Or, Predicate } from "../modules/fredy-model";
import { argv } from 'process';

describe('model', () => {
    const bExp: InferenceNode = new Not(new Predicate('a'));
    const cExp = new And([
        new Predicate('a'),
        new Predicate('b')]);
    const assertions: Map<string, InferenceNode> = new Map([
        ['b', bExp],
        ['c', cExp]
    ]);
    const model = new Model(assertions);

    [
        { a: 0, bExpected: 1, cExpected: 0 },
        { a: 0.25, bExpected: 0.75, cExpected: 0.25 },
        { a: 0.5, bExpected: 0.5, cExpected: 0.5 },
        { a: 0.75, bExpected: 0.25, cExpected: 0.25 },
        { a: 1, bExpected: 0, cExpected: 0 }
    ].forEach(({ a, bExpected, cExpected }) => {
        test('infere a=' + a, () => {

            // Given ...
            const evidences = new Map([
                ['a', a]
            ]);

            // When ...
            const result = model.infere(evidences);

            // Then ...
            expect(result).toEqual(new Map([
                ['a', a],
                ['b', bExpected],
                ['c', cExpected]
            ]));
        })
    });


    describe('ordered', () => {
        // Given ...
        /*
         *   a e
         *   | | 
         *   b f
         *  /|/|
         * c d g
         * 
         */
        const assertions = new Map<string, InferenceNode>([
            ['a', new Predicate('b')],
            ['b', new And([
                new Predicate('c'),
                new Predicate('d')
            ])],
            ['e', new Predicate('f')],
            ['f', new Or([
                new Predicate('d'),
                new Predicate('g')
            ])]
        ]);
        const model = new Model(assertions);

        test('id', () => {
            const axioms = model.axioms;
            expect(axioms).toContain('c');
            expect(axioms).toContain('d');
            expect(axioms).toContain('g');
            expect(axioms.length).toEqual(3);

            const hypothesis = model.hypothesis;
            expect(hypothesis).toContain('a');
            expect(hypothesis).toContain('e');
            expect(hypothesis.length).toEqual(2);

            const inferences = model.inferences;
            expect(inferences).toContain('b');
            expect(inferences).toContain('f');
            expect(inferences.length).toEqual(2);
        });

        test('unknownAxioms', () => {
            const result = model.unknownAxioms();
            expect(result).toEqual(new Map([
                ['c', 0.5],
                ['d', 0.5],
                ['g', 0.5]
            ]));
        });

        test('extractAxioms', () => {
            const evidences = new Map([
                ['a', 0],
                ['b', 0.1],
                ['c', 0.2],
                ['d', 0.3],
                ['e', 0.4],
                ['f', 0.5],
                ['g', 0.6],
            ])
            const result = model.extractAxioms(evidences);
            expect(result).toEqual(new Map([
                ['c', 0.2],
                ['d', 0.3],
                ['g', 0.6]
            ]));
        });

        test('hypothesis a e', () => {
            const evidences = new Map([
                ['a', 0.51],
                ['e', 0.49]
            ])
            const result = model.orderedHypothesis(evidences);
            expect(result).toEqual([
                {
                    id: 'a',
                    truth: 0.51
                }, {
                    id: 'e',
                    truth: 0.49
                }
            ])
        });

        test('hypothesis e a', () => {
            const evidences = new Map([
                ['a', 0.49],
                ['e', 0.51]
            ])
            const result = model.orderedHypothesis(evidences);
            expect(result).toEqual([
                {
                    id: 'e',
                    truth: 0.51
                }, {
                    id: 'a',
                    truth: 0.49
                }
            ])
        });

        test('hypothesis a(0) e?', () => {
            const evidences = new Map([
                ['a', 0],
                ['e', 0.5]
            ])
            const result = model.orderedHypothesis(evidences);
            expect(result).toEqual([
                {
                    id: 'a',
                    truth: 0
                }, {
                    id: 'e',
                    truth: 0.5
                }
            ])
        });

        test('hypothesis a(0.51) e?', () => {
            const evidences = new Map([
                ['a', 0.51],
                ['e', 0.5]
            ])
            const result = model.orderedHypothesis(evidences);
            expect(result).toEqual([
                {
                    id: 'a',
                    truth: 0.51
                }, {
                    id: 'e',
                    truth: 0.5
                }
            ])
        });

        test('inferences b f', () => {
            const evidences = new Map([
                ['b', 0.51],
                ['f', 0.49]
            ])
            const result = model.orderedInferences(evidences);
            expect(result).toEqual([
                {
                    id: 'b',
                    truth: 0.51
                }, {
                    id: 'f',
                    truth: 0.49
                }
            ])
        });

        test('inferences f b', () => {
            const evidences = new Map([
                ['b', 0.49],
                ['f', 0.51]
            ])
            const result = model.orderedInferences(evidences);
            expect(result).toEqual([
                {
                    id: 'f',
                    truth: 0.51
                }, {
                    id: 'b',
                    truth: 0.49
                }
            ])
        });

        test('inferences b f?', () => {
            const evidences = new Map([
                ['b', 0],
                ['f', 0.5]
            ])
            const result = model.orderedInferences(evidences);
            expect(result).toEqual([
                {
                    id: 'b',
                    truth: 0
                }, {
                    id: 'f',
                    truth: 0.5
                }
            ])
        });

        test('inferences b(0.51) f?', () => {
            const evidences = new Map([
                ['b', 0.51],
                ['f', 0.5]
            ])
            const result = model.orderedInferences(evidences);
            expect(result).toEqual([
                {
                    id: 'b',
                    truth: 0.51
                }, {
                    id: 'f',
                    truth: 0.5
                }
            ])
        });
    });
});

describe('axiom properties ', () => {
    // Given ...
    /*
     * a b
     * |X| 
     * c d
     */
    const assertions = new Map<string, InferenceNode>([
        ['a', new And([
            new Predicate('c'),
            new Predicate('d')
        ])],
        ['b', new Or([
            new Predicate('c'),
            new Predicate('d')
        ])]
    ]);
    const model = new Model(assertions);

    [
        [0, 0, 0, 0],
        [0, 0.5, 0, 0.5],
        [0, 1, 0, 1],
        [0.5, 0, 0, 0.5],
        [0.5, 0.5, 0.5, 0.5],
        [0.5, 1, 0.5, 1],
        [1, 0, 0, 1],
        [1, 0.5, 0.5, 1],
        [1, 1, 1, 1]
    ].forEach(([c, d, a, b]) => {
        test('infere ab ' + c + ', ' + d, () => {
            const axioms = new Map([['c', c], ['d', d]]);

            const evidences = model.infere(axioms);

            expect(Array.from(evidences)).toContainEqual(['a', a]);
            expect(Array.from(evidences)).toContainEqual(['b', b]);
            expect(Array.from(evidences)).toContainEqual(['c', c]);
            expect(Array.from(evidences)).toContainEqual(['d', d]);
        });
    });

    /*
    |   c |   d | a+b | a+b c0 | a+b c1 |  dc | a+b d0 | a+b d1 |  dd |
    +-----+-----+-----+--------+--------+-----+....----+--------+-----+
    |   0 |   0 |   0 |      0 |      1 |   1 |      0 |      1 |   1 |
    |   0 | 0.5 | 0.5 |    0.5 |    1.5 |   1 |    0.5 |      1 | 0.5 |
    |   0 |   1 |   1 |      1 |      1 |   1 |      0 |      1 |   0 |
    | 0.5 |   0 | 0.5 |      0 |      1 | 0.5 |    0.5 |    1.5 |   1 |
    | 0.5 | 0.5 |   1 |    0.5 |    1.5 | 0.5 |    0.5 |    1.5 | 0.5 |
    | 0.5 |   1 | 1.5 |      1 |      2 | 0.5 |    0.5 |    1.5 |   0 |
    |   1 |   0 |   1 |      0 |      1 |   0 |      1 |      2 |   1 |
    |   1 | 0.5 | 1.5 |    0.5 |    1.5 |   0 |      1 |      2 | 0.5 |
    |   1 |   1 |   2 |      1 |      2 |   0 |      1 |      1 |   0 |
    */
    [
        [0, 0, 1, 1],
        [0, 0.5, 1, 0.5],
        [0, 1, 1, 0],
        [0.5, 0, 0.5, 1],
        [0.5, 0.5, 0.5, 0.5],
        [0.5, 1, 0.5, 0],
        [1, 0, 0, 1],
        [1, 0.5, 0, 0.5],
        [1, 1, 0, 0]
    ].forEach(([c, d, exp_dc, exp_dd]) => {

        test('deltasHypothesis ' + c + ', ' + d, () => {
            const axioms = new Map([['c', c], ['d', d]]);
            const evidences = model.infere(axioms);

            const deltas = model.deltasHypothesis(evidences);

            expect(deltas).toContainEqual(['c', exp_dc]);
            expect(deltas).toContainEqual(['d', exp_dd]);
        });
    });

    [
        [0, 0, 'c', 'd'],
        [0, 0.5, 'd', 'c'],
        [0, 1, 'd', 'c'],
        [0.5, 0, 'c', 'd'],
        [0.5, 0.5, 'c', 'd'],
        [0.5, 1, 'c', 'd'],
        [1, 0, 'c', 'd'],
        [1, 0.5, 'd', 'c'],
        [1, 1, 'c', 'd']
    ].forEach(([c, d, first, second]) => {
        test('getOrderedAxioms ' + c + ', ' + d, () => {
            const axioms = new Map([['c', c as number], ['d', d as number]]);
            const evidences = model.infere(axioms);

            const result = model.getOrderedAxioms(evidences);

            expect(result).toHaveLength(2);
            expect(result[0].id).toEqual(first);
            expect(result[1].id).toEqual(second);
        });
    });

    [
        [0, 0, 0, 0],
        [0, 0.5, 1, 1],
        [0, 1, 0, 0],
        [0.5, 0, 1, 1],
        [0.5, 0.5, 2, 2],
        [0.5, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0.5, 1, 1],
        [1, 1, 0, 0]
    ].forEach(([c, d, countc, countd]) => {
        test('countUnknownHypothesis ' + c + ', ' + d, () => {
            const axioms = new Map([['c', c as number], ['d', d as number]]);
            const evidences = model.infere(axioms);

            const result = Array.from(model.countUnknownHypothesis(evidences));

            expect(result).toContainEqual(['c', countc]);
            expect(result).toContainEqual(['d', countd]);
            expect(result).toHaveLength(2);
        });
    });
});

describe('animals ', () => {
    const file = fs.readFileSync('./src/animals.yml', 'utf8');
    const modelJson = YAML.parse(file)
    const model = parseDefs(modelJson, '').model;
    test('zebra 1', () => {
        const axioms = model.unknownAxioms();
        axioms.set('has-fur', 1);
        axioms.set('suckles', 1);
        axioms.set('has-feathers', 0);
        axioms.set('lays-eggs', 0);
        axioms.set('eats-meat', 0);
        axioms.set('has-sharp-teeth', 0);
        axioms.set('has-hooves', 1);
        axioms.set('is-striped', 1);
        const evidences = model.infere(axioms);
        const axiomPred = model.getOrderedAxioms(evidences);
        expect(axiomPred[0].id).toEqual('is-ruminant')
    });
});