import { And, Iff, Implies, IsCertain, IsCertainFalse, IsCertainTrue, IsAntinomy, Not, Or, Predicate, Somewhat, Very, Xor, Truth, Falsity, Certainity } from "../modules/fredy-inference-nodes";
import { Model } from "../modules/fredy-model";

describe('Predicate', () => {
    const p = new Predicate("a");
    test('id', () => {
    });
    test('dependencies', () => {
        const model = new Model(new Map());
        const evidences = new Map([
            ['a', 1]
        ]);
        const result = p.dependencies();
        expect(result).toContain('a')
    });
    test('evaluate', () => {
        const model = new Model(new Map());
        const evidences = new Map([
            ['a', 1]
        ]);
        const result = p.evaluate(model, evidences);
        expect(result).toEqual(1);
    });
    test('evaluate unknown', () => {
        const model = new Model(new Map());
        const evidences = new Map();
        const result = p.evaluate(model, evidences);
        expect(result).toEqual(0.5);
    });
    test('evaluate assertion', () => {
        const model = new Model(new Map([
            ['a', new Predicate('b')]
        ]));
        const evidences = new Map([
            ['b', 0.2]
        ]);
        const result = p.evaluate(model, evidences);
        expect(result).toEqual(0.2);
        expect(evidences).toEqual(new Map([
            ['a', 0.2],
            ['b', 0.2]
        ]));
    });
});

describe('not', () => {
    const p = new Not(new Predicate("a"));

    test('dependencies', () => {
        const model = new Model(new Map());
        const evidences = new Map([
            ['a', 1]
        ]);
        const result = p.dependencies();
        expect(result).toContain('a')
    });

    [
        { a: 0, expected: 1 },
        { a: 0.25, expected: 0.75 },
        { a: 0.5, expected: 0.5 },
        { a: 0.75, expected: 0.25 },
        { a: 1, expected: 0 }
    ].forEach(({ a, expected }) => {
        test('evaluate a=' + a, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a]
            ]);
            const result = p.evaluate(model, evidences);
            expect(result).toEqual(expected);
        });
    });
});

describe('very', () => {
    const p = new Very(new Predicate("a"));

    test('dependencies', () => {
        const model = new Model(new Map());
        const evidences = new Map([
            ['a', 1]
        ]);
        const result = p.dependencies();
        expect(result).toContain('a')
    });

    [
        { a: 0, expected: 0 },
        { a: 0.25, expected: 1 / 16 },
        { a: 0.5, expected: 0.25 },
        { a: 0.75, expected: 9 / 16 },
        { a: 1, expected: 1 }
    ].forEach(({ a, expected }) => {
        test('evaluate a=' + a, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a]
            ]);

            const result = p.evaluate(model, evidences);

            expect(result).toBeCloseTo(expected, 3);
        });
    });
});

describe('somewhat', () => {
    const p = new Somewhat(new Predicate("a"));

    test('dependencies', () => {
        const model = new Model(new Map());
        const evidences = new Map([
            ['a', 1]
        ]);
        const result = p.dependencies();
        expect(result).toContain('a')
    });

    [
        { a: 0, expected: 0 },
        { a: 0.25, expected: 0.5 },
        { a: 0.5, expected: 0.707 },
        { a: 0.75, expected: 0.866 },
        { a: 1, expected: 1 }
    ].forEach(({ a, expected }) => {
        test('evaluate a=' + a, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a]
            ]);

            const result = p.evaluate(model, evidences);

            expect(result).toBeCloseTo(expected, 3);
        });
    });
});

describe('isCertain', () => {
    const p = new IsCertain(new Predicate("a"));

    test('dependencies', () => {
        const model = new Model(new Map());
        const evidences = new Map([
            ['a', 1]
        ]);
        const result = p.dependencies();
        expect(result).toContain('a')
    });

    [
        { a: 0, expected: 1 },
        { a: 0.25, expected: 0.5 },
        { a: 0.5, expected: 0 },
        { a: 0.75, expected: 0.5 },
        { a: 1, expected: 1 }
    ].forEach(({ a, expected }) => {
        test('evaluate a=' + a, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a]
            ]);

            const result = p.evaluate(model, evidences);

            expect(result).toBeCloseTo(expected, 3);
        });
    });
});

describe('isCertainTrue', () => {
    const p = new IsCertainTrue(new Predicate("a"));

    test('dependencies', () => {
        const model = new Model(new Map());
        const evidences = new Map([
            ['a', 1]
        ]);
        const result = p.dependencies();
        expect(result).toContain('a')
    });

    [
        { a: 0, expected: 0 },
        { a: 0.25, expected: 0 },
        { a: 0.5, expected: 0 },
        { a: 0.75, expected: 0.5 },
        { a: 1, expected: 1 }
    ].forEach(({ a, expected }) => {
        test('evaluate a=' + a, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a]
            ]);

            const result = p.evaluate(model, evidences);

            expect(result).toBeCloseTo(expected, 3);
        });
    });
});

describe('isCertainFalse', () => {
    const p = new IsCertainFalse(new Predicate("a"));

    test('dependencies', () => {
        const model = new Model(new Map());
        const evidences = new Map([
            ['a', 1]
        ]);
        const result = p.dependencies();
        expect(result).toContain('a')
    });

    [
        { a: 0, expected: 1 },
        { a: 0.25, expected: 0.5 },
        { a: 0.5, expected: 0 },
        { a: 0.75, expected: 0 },
        { a: 1, expected: 0 }
    ].forEach(({ a, expected }) => {
        test('evaluate a=' + a, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a]
            ]);

            const result = p.evaluate(model, evidences);

            expect(result).toBeCloseTo(expected, 3);
        });
    });
});

describe('and', () => {
    const node = new And([
        new Predicate("a"),
        new Predicate("b")
    ]);

    test('dependencies', () => {
        const node = new And([
            new Predicate("a"),
            new Predicate("b"),
            new Predicate("a")
        ]);

        const result = node.dependencies();

        expect(result).toContain('a');
        expect(result).toContain('b');
    });

    [
        { a: 0, b: 0, expected: 0 },
        { a: 0, b: 0.25, expected: 0 },
        { a: 0, b: 0.5, expected: 0 },
        { a: 0, b: 0.75, expected: 0 },
        { a: 0, b: 1, expected: 0 },
        { a: 0.25, b: 0, expected: 0 },
        { a: 0.25, b: 0.25, expected: 0.25 },
        { a: 0.25, b: 0.5, expected: 0.25 },
        { a: 0.25, b: 0.75, expected: 0.25 },
        { a: 0.25, b: 1, expected: 0.25 },
        { a: 0.5, b: 0, expected: 0 },
        { a: 0.5, b: 0.25, expected: 0.25 },
        { a: 0.5, b: 0.5, expected: 0.5 },
        { a: 0.5, b: 0.75, expected: 0.5 },
        { a: 0.5, b: 1, expected: 0.5 },
        { a: 0.75, b: 0, expected: 0 },
        { a: 0.75, b: 0.25, expected: 0.25 },
        { a: 0.75, b: 0.5, expected: 0.5 },
        { a: 0.75, b: 0.75, expected: 0.75 },
        { a: 0.75, b: 1, expected: 0.75 },
        { a: 1, b: 0, expected: 0 },
        { a: 1, b: 0.25, expected: 0.25 },
        { a: 1, b: 0.5, expected: 0.5 },
        { a: 1, b: 0.75, expected: 0.75 },
        { a: 1, b: 1, expected: 1 },
    ].forEach(({ a, b, expected }) => {
        test('evaluate and a=' + a + ', b=' + b, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a],
                ['b', b]
            ]);

            const result = node.evaluate(model, evidences);

            expect(result).toEqual(expected);
        });
    });
});

describe('implies', () => {
    const node = new Implies(
        new Predicate("a"),
        new Predicate("b")
    );

    test('dependencies', () => {
        const node = new Implies(
            new Predicate("a"),
            new And([new Predicate("b"),
            new Predicate("a")])
        );

        const result = node.dependencies();

        expect(result).toContain('a');
        expect(result).toContain('b');
    });

    [
        [0, 0, 1],
        [0, 0.25, 1],
        [0, 0.5, 1],
        [0, 0.75, 1],
        [0, 1, 1],
        [0.25, 0, 0.75],
        [0.25, 0.25, 0.75],
        [0.25, 0.5, 0.75],
        [0.25, 0.75, 0.75],
        [0.25, 1, 1],
        [0.5, 0, 0.5],
        [0.5, 0.25, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.75, 0.75],
        [0.5, 1, 1],
        [0.75, 0, 0.25],
        [0.75, 0.25, 0.25],
        [0.75, 0.5, 0.5],
        [0.75, 0.75, 0.75],
        [0.75, 1, 1],
        [1, 0, 0],
        [1, 0.25, 0.25],
        [1, 0.5, 0.5],
        [1, 0.75, 0.75],
        [1, 1, 1],
    ].forEach(([a, b, expected]) => {
        test('evaluate and a=' + a + ', b=' + b, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a],
                ['b', b]
            ]);

            const result = node.evaluate(model, evidences);

            expect(result).toEqual(expected);
        });
    });
});

describe('iff', () => {
    const node = new Iff(
        new Predicate("a"),
        new Predicate("b")
    );

    test('dependencies', () => {
        const node = new Iff(
            new Predicate("a"),
            new And([new Predicate("b"),
            new Predicate("a")])
        );

        const result = node.dependencies();

        expect(result).toContain('a');
        expect(result).toContain('b');
    });

    [
        [0, 0, 1],
        [0, 0.25, 0.75],
        [0, 0.5, 0.5],
        [0, 0.75, 0.25],
        [0, 1, 0],
        [0.25, 0, 0.75],
        [0.25, 0.25, 0.75],
        [0.25, 0.5, 0.5],
        [0.25, 0.75, 0.25],
        [0.25, 1, 0.25],
        [0.5, 0, 0.5],
        [0.5, 0.25, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.75, 0.5],
        [0.5, 1, 0.5],
        [0.75, 0, 0.25],
        [0.75, 0.25, 0.25],
        [0.75, 0.5, 0.5],
        [0.75, 0.75, 0.75],
        [0.75, 1, 0.75],
        [1, 0, 0],
        [1, 0.25, 0.25],
        [1, 0.5, 0.5],
        [1, 0.75, 0.75],
        [1, 1, 1],
    ].forEach(([a, b, expected]) => {
        test('evaluate and a=' + a + ', b=' + b, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a],
                ['b', b]
            ]);

            const result = node.evaluate(model, evidences);

            expect(result).toEqual(expected);
        });
    });
});

describe('isAntinomy', () => {
    const node = new IsAntinomy(
        new Predicate("a"),
        new Predicate("b")
    );

    test('dependencies', () => {
        const node = new IsAntinomy(
            new Predicate("a"),
            new And([new Predicate("b"),
            new Predicate("a")])
        );

        const result = node.dependencies();

        expect(result).toContain('a');
        expect(result).toContain('b');
    });

    [
        [0, 0, 0],
        [0, 0.25, 0],
        [0, 0.5, 0],
        [0, 0.75, 0],
        [0, 1, 0],
        [0.25, 0, 0],
        [0.25, 0.25, 0],
        [0.25, 0.5, 0],
        [0.25, 0.75, 0],
        [0.25, 1, 0.25],
        [0.5, 0, 0],
        [0.5, 0.25, 0],
        [0.5, 0.5, 0],
        [0.5, 0.75, 0.25],
        [0.5, 1, 0.5],
        [0.75, 0, 0],
        [0.75, 0.25, 0],
        [0.75, 0.5, 0.25],
        [0.75, 0.75, 0.5],
        [0.75, 1, 0.75],
        [1, 0, 0],
        [1, 0.25, 0.25],
        [1, 0.5, 0.5],
        [1, 0.75, 0.75],
        [1, 1, 1],
    ].forEach(([a, b, expected]) => {
        test('evaluate and a=' + a + ', b=' + b, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a],
                ['b', b]
            ]);

            const result = node.evaluate(model, evidences);

            expect(result).toEqual(expected);
        });
    });
});

describe('truth', () => {
    const node = new Truth(
        new Predicate("a"),
        new Predicate("b")
    );

    test('dependencies', () => {
        const node = new Truth(
            new Predicate("a"),
            new And([new Predicate("b"),
            new Predicate("a")])
        );

        const result = node.dependencies();

        expect(result).toContain('a');
        expect(result).toContain('b');
    });

    [
        [0, 0, 0],
        [0, 0.25, 0],
        [0, 0.5, 0],
        [0, 0.75, 0],
        [0, 1, 0],
        [0.25, 0, 0.25],
        [0.25, 0.25, 0.25],
        [0.25, 0.5, 0.25],
        [0.25, 0.75, 0.25],
        [0.25, 1, 0],
        [0.5, 0, 0.5],
        [0.5, 0.25, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.75, 0.25],
        [0.5, 1, 0],
        [0.75, 0, 0.75],
        [0.75, 0.25, 0.75],
        [0.75, 0.5, 0.5],
        [0.75, 0.75, 0.25],
        [0.75, 1, 0],
        [1, 0, 1],
        [1, 0.25, 0.75],
        [1, 0.5, 0.5],
        [1, 0.75, 0.25],
        [1, 1, 0],
    ].forEach(([a, b, expected]) => {
        test('evaluate and a=' + a + ', b=' + b, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a],
                ['b', b]
            ]);

            const result = node.evaluate(model, evidences);

            expect(result).toEqual(expected);
        });
    });
});

describe('falsity', () => {
    const node = new Falsity(
        new Predicate("a"),
        new Predicate("b")
    );

    test('dependencies', () => {
        const node = new Falsity(
            new Predicate("a"),
            new And([new Predicate("b"),
            new Predicate("a")])
        );

        const result = node.dependencies();

        expect(result).toContain('a');
        expect(result).toContain('b');
    });

    [
        [0, 0, 0],
        [0, 0.25, 0.25],
        [0, 0.5, 0.5],
        [0, 0.75, 0.75],
        [0, 1, 1],
        [0.25, 0, 0],
        [0.25, 0.25, 0.25],
        [0.25, 0.5, 0.5],
        [0.25, 0.75, 0.75],
        [0.25, 1, 0.75],
        [0.5, 0, 0],
        [0.5, 0.25, 0.25],
        [0.5, 0.5, 0.5],
        [0.5, 0.75, 0.5],
        [0.5, 1, 0.5],
        [0.75, 0, 0],
        [0.75, 0.25, 0.25],
        [0.75, 0.5, 0.25],
        [0.75, 0.75, 0.25],
        [0.75, 1, 0.25],
        [1, 0, 0],
        [1, 0.25, 0],
        [1, 0.5, 0],
        [1, 0.75, 0],
        [1, 1, 0],
    ].forEach(([a, b, expected]) => {
        test('evaluate and a=' + a + ', b=' + b, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a],
                ['b', b]
            ]);

            const result = node.evaluate(model, evidences);

            expect(result).toEqual(expected);
        });
    });
});

describe('certainity', () => {
    const node = new Certainity(
        new Predicate("a"),
        new Predicate("b")
    );

    test('dependencies', () => {
        const node = new Certainity(
            new Predicate("a"),
            new And([new Predicate("b"),
            new Predicate("a")])
        );

        const result = node.dependencies();

        expect(result).toContain('a');
        expect(result).toContain('b');
    });

    [
        [0, 0, 0],
        [0, 0.25, 0.25],
        [0, 0.5, 0.5],
        [0, 0.75, 0.75],
        [0, 1, 1],
        [0.25, 0, 0.25],
        [0.25, 0.25, 0.25],
        [0.25, 0.5, 0.5],
        [0.25, 0.75, 0.75],
        [0.25, 1, 0.75],
        [0.5, 0, 0.5],
        [0.5, 0.25, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.75, 0.5],
        [0.5, 1, 0.5],
        [0.75, 0, 0.75],
        [0.75, 0.25, 0.75],
        [0.75, 0.5, 0.5],
        [0.75, 0.75, 0.25],
        [0.75, 1, 0.25],
        [1, 0, 1],
        [1, 0.25, 0.75],
        [1, 0.5, 0.5],
        [1, 0.75, 0.25],
        [1, 1, 0],
    ].forEach(([a, b, expected]) => {
        test('evaluate and a=' + a + ', b=' + b, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a],
                ['b', b]
            ]);

            const result = node.evaluate(model, evidences);

            expect(result).toEqual(expected);
        });
    });
});

describe('or', () => {
    const node = new Or([
        new Predicate("a"),
        new Predicate("b")
    ]);

    test('dependencies', () => {
        const node = new Or([
            new Predicate("a"),
            new Predicate("b"),
            new Predicate("a")
        ]);
        const model = new Model(new Map());
        const evidences = new Map([
            ['a', 1]
        ]);
        const result = node.dependencies();
        expect(result).toContain('a');
        expect(result).toContain('b');
    });

    [
        { a: 0, b: 0, expected: 0 },
        { a: 0, b: 0.25, expected: 0.25 },
        { a: 0, b: 0.5, expected: 0.5 },
        { a: 0, b: 0.75, expected: 0.75 },
        { a: 0, b: 1, expected: 1 },
        { a: 0.25, b: 0, expected: 0.25 },
        { a: 0.25, b: 0.25, expected: 0.25 },
        { a: 0.25, b: 0.5, expected: 0.5 },
        { a: 0.25, b: 0.75, expected: 0.75 },
        { a: 0.25, b: 1, expected: 1 },
        { a: 0.5, b: 0, expected: 0.5 },
        { a: 0.5, b: 0.25, expected: 0.5 },
        { a: 0.5, b: 0.5, expected: 0.5 },
        { a: 0.5, b: 0.75, expected: 0.75 },
        { a: 0.5, b: 1, expected: 1 },
        { a: 0.75, b: 0, expected: 0.75 },
        { a: 0.75, b: 0.25, expected: 0.75 },
        { a: 0.75, b: 0.5, expected: 0.75 },
        { a: 0.75, b: 0.75, expected: 0.75 },
        { a: 0.75, b: 1, expected: 1 },
        { a: 1, b: 0, expected: 1 },
        { a: 1, b: 0.25, expected: 1 },
        { a: 1, b: 0.5, expected: 1 },
        { a: 1, b: 0.75, expected: 1 },
        { a: 1, b: 1, expected: 1 },
    ].forEach(({ a, b, expected }) => {
        test('evaluate or a=' + a + ', b=' + b, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a],
                ['b', b]
            ]);
            const result = node.evaluate(model, evidences);
            expect(result).toEqual(expected);
        });
    });
});

describe('xor', () => {
    const node = new Xor([
        new Predicate("a"),
        new Predicate("b")
    ]);

    test('dependencies', () => {
        const node = new Xor([
            new Predicate("a"),
            new Predicate("b"),
            new Predicate("a")
        ]);
        const result = node.dependencies();
        expect(result).toContain('a');
        expect(result).toContain('b');
    });

    [
        [0, 0, 0],
        [0, 0.25, 0.25],
        [0, 0.5, 0.5],
        [0, 0.75, 0.75],
        [0, 1, 1],
        [0.25, 0, 0.25],
        [0.25, 0.25, 0.25],
        [0.25, 0.5, 0.5],
        [0.25, 0.75, 0.75],
        [0.25, 1, 0.75],
        [0.5, 0, 0.5],
        [0.5, 0.25, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.75, 0.5],
        [0.5, 1, 0.5],
        [0.75, 0, 0.75],
        [0.75, 0.25, 0.75],
        [0.75, 0.5, 0.5],
        [0.75, 0.75, 0.25],
        [0.75, 1, 0.25],
        [1, 0, 1],
        [1, 0.25, 0.75],
        [1, 0.5, 0.5],
        [1, 0.75, 0.25],
        [1, 1, 0],
    ].forEach(([a, b, expected]) => {
        test('evaluate xor a=' + a + ', b=' + b, () => {
            const model = new Model(new Map());
            const evidences = new Map([
                ['a', a],
                ['b', b]
            ]);
            const result = node.evaluate(model, evidences);
            expect(result).toEqual(expected);
        });
    });
});
