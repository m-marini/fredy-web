import { And, InferenceNode, Predicate, createAdjacent, createClosure, createDependencies, deepReverseDependencies, extractChildren, extractIntermediates, extractLeaves, extractParents, extractRoots } from "../modules/fredy-model";

test('createDependencies', () => {
    const assertions = new Map<string, InferenceNode>([
        ['a', new Predicate('b')],
        ['b', new And([
            new Predicate('c'),
            new Predicate('d')
        ])]
    ]);

    const result = createDependencies(assertions);

    expect(result).toEqual([
        ['a', ['b']],
        ['b', ['c', 'd']]
    ])
});

test('extractChildren', () => {
    // Given ...
    /*     a
     *    /|
     *   / b
     *   |/|
     *   c d
     */
    const dependencies = [
        ['a', ['b', 'c']],
        ['b', ['c', 'd']],
    ] as [string, string[]][];

    const result = extractChildren(dependencies);

    expect(result).toEqual(['b', 'c', 'd']);
});

test('extractParents', () => {
    // Given ...
    /*     a
     *    /|
     *   / b
     *   |/|
     *   c d
     */
    const dependencies = [
        ['a', ['b', 'c']],
        ['b', ['c', 'd']],
    ] as [string, string[]][];

    const result = extractParents(dependencies);

    expect(result).toEqual(['a', 'b']);
});

test('extractLeaves', () => {
    // Given ...
    /*     a
     *    /|
     *   / b
     *   |/|
     *   c d
     */
    const dependencies = [
        ['a', ['b', 'c']],
        ['b', ['c', 'd']],
    ] as [string, string[]][];

    const result = extractLeaves(dependencies);

    expect(result).toEqual(['c', 'd']);
});

test('extractRoots', () => {
    // Given ...
    /*     a
     *    /|
     *   / b
     *   |/|
     *   c d
     */
    const dependencies = [
        ['a', ['b', 'c']],
        ['b', ['c', 'd']],
    ] as [string, string[]][];

    const result = extractRoots(dependencies);

    expect(result).toEqual(['a']);
});

test('extractIntermediate', () => {
    // Given ...
    /*     a
     *    /|
     *   / b
     *   |/|
     *   c d
     */
    const dependencies = [
        ['a', ['b', 'c']],
        ['b', ['c', 'd']],
    ] as [string, string[]][];

    const result = extractIntermediates(dependencies);
    expect(result).toEqual(['b']);
});

describe('connection matrix', () => {
    /*
      a
      |
      b
      |\
      c d
    */
    const nodes = ['a', 'b', 'c', 'd'];
    const edges = [
        ['a', ['b']],
        ['b', ['c', 'd']]
    ] as [string, string[]][];
    test('createAdjacent', () => {
        const result = createAdjacent(nodes, edges);
        expect(result).toEqual([
            [false, true, false, false],
            [false, false, true, true],
            [false, false, false, false],
            [false, false, false, false]
        ]);
    });
    test('createClosure', () => {
        const result = createClosure(nodes, edges);
        expect(result).toEqual([
            [false, true, true, true],
            [false, false, true, true],
            [false, false, false, false],
            [false, false, false, false]
        ]);
    });
    test('deepReverseDependencies', () => {
        const result = deepReverseDependencies(edges);

        expect(result).toContainEqual(['b', ['a']]);
        expect(result).toContainEqual(['c', ['a', 'b']]);
        expect(result).toContainEqual(['d', ['a', 'b']]);
        expect(result).toHaveLength(3);        
    })
});
