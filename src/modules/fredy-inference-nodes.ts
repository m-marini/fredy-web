import { default as _ } from 'lodash';
import { InferenceNode, Model } from './fredy-model';

/**
 * Evaluates the predicate
 */
export class Predicate implements InferenceNode {
    private _id: string;

    /**
     * Creates the predicate node
     * @param id the predicate identifier
     */
    constructor(id: string) {
        this._id = id;
    }

    /**
     * Returns the predicate identifier
     */
    get id() { return this._id; }

    /**
     * Returns the evaluated truth of the predicate
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        const value = evidences.get(this._id);
        return value !== undefined ? value : model.evaluate(this._id, evidences);
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        return [this._id];
    }
}

/**
 * Evaluates the negation of the argument expression
 */
export class Not implements InferenceNode {
    private _expression: InferenceNode;

    /**
     * Creates the not node
     * @param expression the expression
     */
    constructor(expression: InferenceNode) {
        this._expression = expression;
    }

    /**
     * Returns the argument expression
     */
    get expression() { return this._expression; }

    /**
     * Returns the negated truth of the expression
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        const a = this._expression.evaluate(model, evidences);
        return 1 - a;
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        return this._expression.dependencies();
    }
}

/**
 * Evaluates the hedge very of the argument expression
 */
export class Very implements InferenceNode {
    private _expression: InferenceNode;

    /**
     * Creates the very node
     * @param expression the expression
     */
    constructor(expression: InferenceNode) {
        this._expression = expression;
    }

    /**
     * Returns the argument expression
     */
    get expression() { return this._expression; }

    /**
     * Returns the very truth of the expression
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        const a = this._expression.evaluate(model, evidences);
        return a * a;
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        return this._expression.dependencies();
    }
}

/**
 * Evaluates the hedge somewhat of the argument expression
 */
export class Somewhat implements InferenceNode {
    private _expression: InferenceNode;

    /**
     * Creates the somewhat node
     * @param expression the expression
     */
    constructor(expression: InferenceNode) {
        this._expression = expression;
    }

    /**
     * Returns the argument expression
     */
    get expression() { return this._expression; }

    /**
     * Returns the somewhat truth of the expression
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        const a = this._expression.evaluate(model, evidences);
        return Math.sqrt(a);
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        return this._expression.dependencies();
    }
}

/**
 * Evaluates the hedge isCertain of the argument expression
 */
export class IsCertain implements InferenceNode {
    private _expression: InferenceNode;

    /**
     * Creates the isCertain node
     * @param expression the expression
     */
    constructor(expression: InferenceNode) {
        this._expression = expression;
    }

    /**
     * Returns the argument expression
     */
    get expression() { return this._expression; }

    /**
     * Returns the is certain truth of the expression
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        const a = this._expression.evaluate(model, evidences);
        return Math.abs(1 - a * 2);
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        return this._expression.dependencies();
    }
}

/**
 * Evaluates the hedge isCertainTrue of the argument expression
 */
export class IsCertainTrue implements InferenceNode {
    private _expression: InferenceNode;

    /**
     * Creates the isCertain node
     * @param expression the expression
     */
    constructor(expression: InferenceNode) {
        this._expression = expression;
    }

    /**
     * Returns the argument expression
     */
    get expression() { return this._expression; }

    /**
     * Returns the is certain true truth of the expression
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        const a = this._expression.evaluate(model, evidences);
        return Math.max(0, a * 2 - 1);
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        return this._expression.dependencies();
    }
}

/**
 * Evaluates the hedge isCertainFalse of the argument expression
 */
export class IsCertainFalse implements InferenceNode {
    private _expression: InferenceNode;

    /**
     * Creates the isCertain node
     * @param expression the expression
     */
    constructor(expression: InferenceNode) {
        this._expression = expression;
    }

    /**
     * Returns the argument expression
     */
    get expression() { return this._expression; }

    /**
     * Returns the is certain false truth of the expression
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        const a = this._expression.evaluate(model, evidences);
        return Math.max(0, 1 - a * 2);
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        return this._expression.dependencies();
    }
}

/**
 * Evaluates the implies of the two expression arguments
 */
export class Implies implements InferenceNode {
    private _antecedent: InferenceNode;
    private _consequent: InferenceNode;

    /**
     * Creates the implies node
     * @param antecedent the expression
     */
    constructor(antecedent: InferenceNode, consequent: InferenceNode) {
        this._antecedent = antecedent;
        this._consequent = consequent;
    }

    /**
     * Returns the antecedent expression argument
     */
    get antecedent() { return this._antecedent; }

    /**
     * Returns the consequent expression argument
     */
    get consequent() { return this._consequent; }

    /**
     * Returns the implies truth of the expression
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        const antecedent = this._antecedent.evaluate(model, evidences);
        const consequent = this._consequent.evaluate(model, evidences);
        return Math.max(1 - antecedent, consequent);
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        const ary = [...this._antecedent.dependencies(), ...this._consequent.dependencies()];
        return Array.from(new Set(ary));
    }
}

/**
 * Evaluates the iff of the two expression arguments
 */
export class Iff implements InferenceNode {
    private _antecedent: InferenceNode;
    private _consequent: InferenceNode;

    /**
     * Creates the iff node
     * @param antecedent the expression
     */
    constructor(antecedent: InferenceNode, consequent: InferenceNode) {
        this._antecedent = antecedent;
        this._consequent = consequent;
    }

    /**
     * Returns the antecedent expression argument
     */
    get antecedent() { return this._antecedent; }

    /**
     * Returns the consequent expression argument
     */
    get consequent() { return this._consequent; }

    /**
     * Returns the iff truth of the expression
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        const antecedent = this._antecedent.evaluate(model, evidences);
        const consequent = this._consequent.evaluate(model, evidences);
        return Math.max(
            Math.min(antecedent, consequent),
            Math.min(1 - antecedent, 1 - consequent));
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        const ary = [...this._antecedent.dependencies(), ...this._consequent.dependencies()];
        return Array.from(new Set(ary));
    }
}

/**
 * Evaluates the is antinomy of the two expression arguments
 */
export class IsAntinomy implements InferenceNode {
    private _assertion: InferenceNode;
    private _negation: InferenceNode;

    /**
     * Creates the is paradox node
     * @param assertion the assertion expression
     * @param negation the negtion expression
     */
    constructor(assertion: InferenceNode, negation: InferenceNode) {
        this._assertion = assertion;
        this._negation = negation;
    }

    /**
     * Returns the assertion expression argument
     */
    get assertion() { return this._assertion; }

    /**
     * Returns the negation expression argument
     */
    get negation() { return this._negation; }

    /**
     * Returns the is antinomy truth of the expressions
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        const assertion = this._assertion.evaluate(model, evidences);
        const negation = this._negation.evaluate(model, evidences);
        return Math.max(0, assertion + negation - 1);
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        const ary = [...this._assertion.dependencies(), ...this._negation.dependencies()];
        return Array.from(new Set(ary));
    }
}

/**
 * Evaluates the truth of the two expression arguments
 */
export class Truth implements InferenceNode {
    private _assertion: InferenceNode;
    private _negation: InferenceNode;

    /**
     * Creates the truth node
     * @param assertion the assertion expression
     * @param negation the negtion expression
     */
    constructor(assertion: InferenceNode, negation: InferenceNode) {
        this._assertion = assertion;
        this._negation = negation;
    }

    /**
     * Returns the assertion expression argument
     */
    get assertion() { return this._assertion; }

    /**
     * Returns the negation expression argument
     */
    get negation() { return this._negation; }

    /**
     * Returns the truth of the expressions
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        const assertion = this._assertion.evaluate(model, evidences);
        const negation = this._negation.evaluate(model, evidences);
        return Math.min(assertion, 1 - negation);
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        const ary = [...this._assertion.dependencies(), ...this._negation.dependencies()];
        return Array.from(new Set(ary));
    }
}

/**
 * Evaluates the falsity of the two expression arguments
 */
export class Falsity implements InferenceNode {
    private _assertion: InferenceNode;
    private _negation: InferenceNode;

    /**
     * Creates the falsity node
     * @param assertion the assertion expression
     * @param negation the negtion expression
     */
    constructor(assertion: InferenceNode, negation: InferenceNode) {
        this._assertion = assertion;
        this._negation = negation;
    }

    /**
     * Returns the assertion expression argument
     */
    get assertion() { return this._assertion; }

    /**
     * Returns the negation expression argument
     */
    get negation() { return this._negation; }

    /**
     * Returns the falsity truth of the expressions
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        const assertion = this._assertion.evaluate(model, evidences);
        const negation = this._negation.evaluate(model, evidences);
        return Math.min(1 - assertion, negation);
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        const ary = [...this._assertion.dependencies(), ...this._negation.dependencies()];
        return Array.from(new Set(ary));
    }
}

/**
 * Evaluates the certainity of the two expression arguments
 */
export class Certainity implements InferenceNode {
    private _assertion: InferenceNode;
    private _negation: InferenceNode;

    /**
     * Creates the certainity node
     * @param assertion the assertion expression
     * @param negation the negtion expression
     */
    constructor(assertion: InferenceNode, negation: InferenceNode) {
        this._assertion = assertion;
        this._negation = negation;
    }

    /**
     * Returns the assertion expression argument
     */
    get assertion() { return this._assertion; }

    /**
     * Returns the negation expression argument
     */
    get negation() { return this._negation; }

    /**
     * Returns the certainity truth of the expressions
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        const assertion = this._assertion.evaluate(model, evidences);
        const negation = this._negation.evaluate(model, evidences);
        return Math.max(
            Math.min(assertion, 1 - negation),
            Math.min(1 - assertion, negation));
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        const ary = [...this._assertion.dependencies(), ...this._negation.dependencies()];
        return Array.from(new Set(ary));
    }
}

/**
 * Evaluates the intersection value of the expressions
 */
export class And implements InferenceNode {
    private _expressions: InferenceNode[];

    /**
     * Creates the and node
     * @param expressions the expressions
     */
    constructor(expressions: InferenceNode[]) {
        this._expressions = expressions;
    }

    /**
     * Returns the argument expressions
     */
    get expressions() { return this._expressions; }

    /**
     * Returns the intersected truth of the expressions
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        let value = 1;
        this._expressions.forEach(expression => {
            const v = expression.evaluate(model, evidences);
            value = Math.min(value, v);
        })
        return value;
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        let result: string[] = [];
        this._expressions.forEach(expression => {
            const deps = expression.dependencies();
            result = [...result, ...deps];
        });
        return Array.from(new Set(result));
    }
}

/**
 * Evaluates the union value of the expressions
 */
export class Or implements InferenceNode {
    private _expressions: InferenceNode[];

    /**
     * Creates the or node
     * @param expressions the expressions
     */
    constructor(expressions: InferenceNode[]) {
        this._expressions = expressions;
    }

    /**
     * Returns the argument expressions
     */
    get expressions() { return this._expressions; }

    /**
     * Returns the union truth of the expressions
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        let value = 0;
        this._expressions.forEach(expression => {
            const v = expression.evaluate(model, evidences);
            value = Math.max(value, v);
        })
        return value;
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        let result: string[] = [];
        this._expressions.forEach(expression => {
            const deps = expression.dependencies();
            result = [...result, ...deps];
        });
        return Array.from(new Set(result));
    }
}

/**
 * Evaluates the exclusive disjunction value of the expressions
 */
export class Xor implements InferenceNode {
    private _expressions: InferenceNode[];

    /**
     * Creates the xor node
     * @param expressions the expressions
     */
    constructor(expressions: InferenceNode[]) {
        this._expressions = expressions;
    }

    /**
     * Returns the argument expressions
     */
    get expressions() { return this._expressions; }

    /**
     * Returns the exclusive disjunction truth of the expressions
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number {
        const values = this._expressions.map(expression =>
            expression.evaluate(model, evidences)
        );
        let result = 0;
        const n = values.length;
        for (let i = 0; i < n; i++) {
            let single = 1;
            for (let j = 0; j < n; j++) {
                single = Math.min(single, i === j ? 1 - values[j] : values[j])
            }
            result = Math.max(result, single);
        }
        return result;
    }

    /**
     * Returns the dependencies set
     */
    dependencies(): string[] {
        let result: string[] = [];
        this._expressions.forEach(expression => {
            const deps = expression.dependencies();
            result = [...result, ...deps];
        });
        return Array.from(new Set(result));
    }
}

/**
 * Returns the dependencies
 * @param assertions the assertions
 */
export function createDependencies(assertions: Map<string, InferenceNode>): [string, string[]][] {
    return _(Array.from(assertions))
        .map(([id, expr]) => [id, expr.dependencies()] as [string, string[]])
        .value();
}

/**
 * Returns the children nodes
 * @param dependencies the dependencies
 */
export function extractChildren(dependencies: [string, string[]][]): string[] {
    let children: string[] = [];
    dependencies.forEach(([parent, nodeChildren]) => {
        children = [...children, ...nodeChildren];
    });
    return Array.from(new Set(children));
}

/**
 * Returns the parents nodes
 * @param dependencies the dependencies
 */
export function extractParents(dependencies: [string, string[]][]): string[] {
    return _(dependencies)
        .map(item => item[0])
        .value();
}

/**
 * Returns the leaves nodes
 * @param dependencies the axioms
 */
export function extractLeaves(dependencies: [string, string[]][]): string[] {
    const parents = extractParents(dependencies);
    const children = extractChildren(dependencies);
    return _.filter(children, node => parents.indexOf(node) < 0);
}

/**
 * Returns the leaves nodes
 * @param dependencies the axioms
 */
export function extractRoots(dependencies: [string, string[]][]): string[] {
    const parents = extractParents(dependencies);
    const children = extractChildren(dependencies);
    return _.filter(parents, node => children.indexOf(node) < 0);
}

/**
 * Returns the intermediate nodes
 * @param dependencies the axioms
 */
export function extractIntermediates(dependencies: [string, string[]][]): string[] {
    const parents = extractParents(dependencies);
    const children = extractChildren(dependencies);
    return _.filter(parents, node => children.indexOf(node) >= 0);
}

/**
 * Returns the adjacent matrix
 * 
 * @param nodes the node names
 * @param edges the edges
 */
export function createAdjacent(nodes: string[], edges: [string, string[]][]): boolean[][] {
    const n = nodes.length;
    // Initialize matrix
    const m: boolean[][] = [[]];
    for (let i = 0; i < n; i++) {
        const ni = nodes[i];
        m[i] = [];
        for (let j = 0; j < n; j++) {
            const nj = nodes[j];
            const connected = (edges)
                .filter(([parent, children]) => parent === ni)
                .flatMap(item => item[1])
                .filter(node => node === nj)
                .length > 0;
            m[i][j] = connected;
        }
    }
    return m;
}

/**
 * Returns the closure matrix (Warshall Floyd)
 * 
 * @param nodes the node names
 * @param edges the edges
 */
export function createClosure(nodes: string[], edges: [string, string[]][]): boolean[][] {
    const n = nodes.length;
    const m = createAdjacent(nodes, edges);
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                m[i][j] = m[i][j] || (m[i][k] && m[k][j]);
            }
        }
    }
    return m;
}

/**
 * Returns the deep reverse dependencies (parents by child)
 * @param edges the edges
 */
export function deepReverseDependencies(edges: [string, string[]][]): [string, string[]][] {
    const nodes = _(edges)
        .flatMap(([parent, children]) => {
            return [parent, ...children];
        })
        .uniq()
        .value();
    const closure = createClosure(nodes, edges);
    const n = nodes.length;
    const result: [string, string[]][] = [];
    for (let j = 0; j < n; j++) {
        const child = nodes[j];
        const parents: string[] = [];
        for (let i = 0; i < n; i++) {
            const parent = nodes[i];
            if (closure[i][j]) {
                parents.push(parent);
            }
        }
        if (parents.length > 0) {
            result.push([child, parents]);
        }
    }
    return result;
}
