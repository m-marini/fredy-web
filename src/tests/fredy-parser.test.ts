import YAML from 'yaml'
import fs from 'fs';
import { parseDefs, parseModel, parseNode } from '../modules/fredy-parser';
import { And, Iff, Implies, IsCertain, IsCertainFalse, IsCertainTrue, IsAntinomy, Not, Or, Predicate, Somewhat, Very, Xor, Truth, Falsity, Certainity } from '../modules/fredy-inference-nodes';
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

    test('parseNode very', () => {
        const defs = {
            type: 'very',
            expression: {
                type: 'predicate',
                id: 'pred'
            }
        };

        const result = parseNode(defs, '');

        expect(result).toBeInstanceOf(Very);
        const notArg = (result as Very).expression;
        expect(notArg).toBeInstanceOf(Predicate);
        expect((notArg as Predicate).id).toEqual('pred');
    });

    test('parseNode somewhat', () => {
        const defs = {
            type: 'somewhat',
            expression: {
                type: 'predicate',
                id: 'pred'
            }
        };

        const result = parseNode(defs, '');

        expect(result).toBeInstanceOf(Somewhat);
        const notArg = (result as Somewhat).expression;
        expect(notArg).toBeInstanceOf(Predicate);
        expect((notArg as Predicate).id).toEqual('pred');
    });

    test('parseNode isCertain', () => {
        const defs = {
            type: 'isCertain',
            expression: {
                type: 'predicate',
                id: 'pred'
            }
        };

        const result = parseNode(defs, '');

        expect(result).toBeInstanceOf(IsCertain);
        const notArg = (result as IsCertain).expression;
        expect(notArg).toBeInstanceOf(Predicate);
        expect((notArg as Predicate).id).toEqual('pred');
    });

    test('parseNode isCertainTrue', () => {
        const defs = {
            type: 'isCertainTrue',
            expression: {
                type: 'predicate',
                id: 'pred'
            }
        };

        const result = parseNode(defs, '');

        expect(result).toBeInstanceOf(IsCertainTrue);
        const notArg = (result as IsCertainTrue).expression;
        expect(notArg).toBeInstanceOf(Predicate);
        expect((notArg as Predicate).id).toEqual('pred');
    });

    test('parseNode isCertainFalse', () => {
        const defs = {
            type: 'isCertainFalse',
            expression: {
                type: 'predicate',
                id: 'pred'
            }
        };

        const result = parseNode(defs, '');

        expect(result).toBeInstanceOf(IsCertainFalse);
        const notArg = (result as IsCertainFalse).expression;
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

    test('parseNode xor', () => {
        const defs = {
            type: 'xor',
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

        expect(result).toBeInstanceOf(Xor);
        const args = (result as Xor).expressions;
        expect(args).toHaveLength(2);
        expect(args[0]).toBeInstanceOf(Predicate);
        expect((args[0] as Predicate).id).toEqual('pred0');
        expect(args[1]).toBeInstanceOf(Predicate);
        expect((args[1] as Predicate).id).toEqual('pred1');
    });

    test('parseNode implies', () => {
        const defs = {
            type: 'implies',
            antecedent: {
                type: 'predicate',
                id: 'pred0'
            },
            consequent: {
                type: 'predicate',
                id: 'pred1'
            }
        };

        const result = parseNode(defs, '');

        expect(result).toBeInstanceOf(Implies);
        const left = (result as Implies).antecedent;
        expect(left).toBeInstanceOf(Predicate);
        expect((left as Predicate).id).toEqual('pred0');
        const right = (result as Implies).consequent;
        expect(right).toBeInstanceOf(Predicate);
        expect((right as Predicate).id).toEqual('pred1');
    });

    test('parseNode iff', () => {
        const defs = {
            type: 'iff',
            antecedent: {
                type: 'predicate',
                id: 'pred0'
            },
            consequent: {
                type: 'predicate',
                id: 'pred1'
            }
        };

        const result = parseNode(defs, '');

        expect(result).toBeInstanceOf(Iff);
        const left = (result as Iff).antecedent;
        expect(left).toBeInstanceOf(Predicate);
        expect((left as Predicate).id).toEqual('pred0');
        const right = (result as Iff).consequent;
        expect(right).toBeInstanceOf(Predicate);
        expect((right as Predicate).id).toEqual('pred1');
    });

    test('parseNode isAntinomy', () => {
        const defs = {
            type: 'isAntinomy',
            assertion: {
                type: 'predicate',
                id: 'pred0'
            },
            negation: {
                type: 'predicate',
                id: 'pred1'
            }
        };

        const result = parseNode(defs, '');

        expect(result).toBeInstanceOf(IsAntinomy);
        const left = (result as IsAntinomy).assertion;
        expect(left).toBeInstanceOf(Predicate);
        expect((left as Predicate).id).toEqual('pred0');
        const right = (result as IsAntinomy).negation;
        expect(right).toBeInstanceOf(Predicate);
        expect((right as Predicate).id).toEqual('pred1');
    });

    test('parseNode truth', () => {
        const defs = {
            type: 'truth',
            assertion: {
                type: 'predicate',
                id: 'pred0'
            },
            negation: {
                type: 'predicate',
                id: 'pred1'
            }
        };

        const result = parseNode(defs, '');

        expect(result).toBeInstanceOf(Truth);
        const left = (result as Truth).assertion;
        expect(left).toBeInstanceOf(Predicate);
        expect((left as Predicate).id).toEqual('pred0');
        const right = (result as Truth).negation;
        expect(right).toBeInstanceOf(Predicate);
        expect((right as Predicate).id).toEqual('pred1');
    });

    test('parseNode falsity', () => {
        const defs = {
            type: 'falsity',
            assertion: {
                type: 'predicate',
                id: 'pred0'
            },
            negation: {
                type: 'predicate',
                id: 'pred1'
            }
        };

        const result = parseNode(defs, '');

        expect(result).toBeInstanceOf(Falsity);
        const left = (result as Falsity).assertion;
        expect(left).toBeInstanceOf(Predicate);
        expect((left as Predicate).id).toEqual('pred0');
        const right = (result as Falsity).negation;
        expect(right).toBeInstanceOf(Predicate);
        expect((right as Predicate).id).toEqual('pred1');
    });

    test('parseNode certainity', () => {
        const defs = {
            type: 'certainity',
            assertion: {
                type: 'predicate',
                id: 'pred0'
            },
            negation: {
                type: 'predicate',
                id: 'pred1'
            }
        };

        const result = parseNode(defs, '');

        expect(result).toBeInstanceOf(Certainity);
        const left = (result as Certainity).assertion;
        expect(left).toBeInstanceOf(Predicate);
        expect((left as Predicate).id).toEqual('pred0');
        const right = (result as Certainity).negation;
        expect(right).toBeInstanceOf(Predicate);
        expect((right as Predicate).id).toEqual('pred1');
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
            version: "0.1",
            id: "test",
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
            version: "0.1",
            id: "test",
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
            version: "0.1",
            id: "test",
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
            version: "0.1",
            id: "test",
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