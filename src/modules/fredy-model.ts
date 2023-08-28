import { default as _ } from 'lodash';
import { PredicateStatus } from '../react/fredyComponents';

/**
 * The node of the fuzzy expresion tree
 */
export interface InferenceNode {
    /**
     * Returns the evaluated truth of node
     * @param model the model
     * @param evidences  the evidences
     */
    evaluate(model: Model, evidences: Map<string, number>): number;

    /**
     * Returns the dependencies set
     */
    dependencies(): string[];
}

const UNKNOWN_VALUE = 0.5;

/**
 * Computes the evidences appling the assertions
 */
export class Model {
    private _assertions: Map<string, InferenceNode>;
    private _hypothesis: string[];
    private _axioms: string[];
    private _inferences: string[];
    private _hypothesisByAxiom: Map<string, string[]>;

    constructor(assertions: Map<string, InferenceNode>) {
        this._assertions = assertions;
        const dependencies = createDependencies(assertions);
        this._hypothesis = extractRoots(dependencies);
        this._axioms = Array.from(extractLeaves(dependencies));
        this._inferences = extractIntermediates(dependencies);
        const revDep = deepReverseDependencies(dependencies);
        this._hypothesisByAxiom = new Map(_.map(revDep,
            ([child, parents]) => {
                const hyps = _.filter(parents, parent => this._hypothesis.indexOf(parent) >= 0);
                return [child, hyps];
            }));
    }

    /**
     * Returns the assertions map
     */
    get assertions() { return this._assertions; }

    /**
     * Returns the inferences
     */
    get hypothesis() { return this._hypothesis; }

    /**
     * Returns the inferences
     */
    get axioms() { return this._axioms; }


    /**
     * Returns the inferences
     */
    get inferences() { return this._inferences; }

    /**
     * Returns the infered evidences
     * @param evidences the initial evidences (axioms)
     */
    infere(evidences: Map<string, number>): Map<string, number> {
        this._assertions.forEach((exp, id) => {
            this.evaluate(id, evidences);
        });
        return evidences;
    }

    /**
     * Returns the value of the predicate
     * @param id the predicate identifier
     * @param evidences the evidences
     */
    evaluate(id: string, evidences: Map<string, number>): number {
        const value = evidences.get(id);
        if (value !== undefined) {
            return value;
        } else {
            const assertion = this._assertions.get(id);
            const assValue = assertion !== undefined
                ? assertion.evaluate(this, evidences)
                : UNKNOWN_VALUE;
            evidences.set(id, assValue);
            return assValue;
        }
    }

    /**
     * Returns the list of ordered predicate
     * @param evidences the evidences
     */
    orderedHypothesis(evidences: Map<string, number>): PredicateStatus[] {
        return _(toPredicateStatus(evidences))
            .filter(pred => this._hypothesis.indexOf(pred.id) >= 0)
            .sortBy(pred => pred.truth !== UNKNOWN_VALUE ? -pred.truth : 1000000)
            .value();
    }

    /**
     * Returns the list of ordered predicate
     * @param evidences the evidences
     */
    orderedInferences(evidences: Map<string, number>): PredicateStatus[] {
        return _(toPredicateStatus(evidences))
            .filter(pred => this._inferences.indexOf(pred.id) >= 0)
            .sortBy(pred => pred.truth !== UNKNOWN_VALUE ? -pred.truth : 1000000)
            .value();
    }

    /**
     * Returns the default axioms in unknown status
     */
    unknownAxioms(): Map<string, number> {
        return new Map(_.map(this._axioms, id => [id, UNKNOWN_VALUE]));
    }

    /**
     * Returns the axioms values
     * @param evidences the evidences
     */
    extractAxioms(evidences: Map<string, number>): Map<string, number> {
        const axioms = _.filter(Array.from(evidences), ([id, truth]) => this._axioms.indexOf(id) >= 0);
        return new Map(axioms);
    }

    /**
     * Returns the delta of assertions for a given axiom
     * @param evidences the evidences
     * @param axiom the axiom
     */
    private deltaHypothesis(evidences: Map<string, number>, axiom: string): number {
        const y = _(Array.from(evidences))
            .filter(([id, truth]) => this._hypothesis.indexOf(id) >= 0)
            .map(pred => pred[1])
            .sum();
        const negAxioms = this.extractAxioms(evidences);
        negAxioms.set(axiom, 0);
        const negationEvidences = this.infere(negAxioms);
        const y0 = _(Array.from(negationEvidences))
            .filter(([id, truth]) => this._hypothesis.indexOf(id) >= 0)
            .map(pred => pred[1])
            .sum();

        const assertAxioms = this.extractAxioms(evidences);
        assertAxioms.set(axiom, 1);
        const assertionEvidences = this.infere(assertAxioms);
        const y1 = _(Array.from(assertionEvidences))
            .filter(([id, truth]) => this._hypothesis.indexOf(id) >= 0)
            .map(pred => pred[1])
            .sum();
        return Math.max(y0, y1) - y;
    }

    /**
     * Returns the deltaHypothesis by axiom
     * @param evidences the evidences
     */
    deltasHypothesis(evidences: Map<string, number>): [string, number][] {
        return _.map(this._axioms, axiom => [axiom, this.deltaHypothesis(evidences, axiom)]);
    }

    /**
     * Returns the number of unknown hypothesis by axiom
     * @param evidences the evidences
     */
    countUnknownHypothesis(evidences: Map<string, number>) {
        const ary = _(Array.from(evidences))
            .filter(([id, truth]) => this._axioms.indexOf(id) >= 0)
            .map(([axiom, truth]) => {
                const hyps = this._hypothesisByAxiom.get(axiom);
                if (hyps === undefined) {
                    return [axiom, 0] as [string, number];
                }
                const count = _.filter(hyps, hypotheses => {
                    const hypTruth = evidences.get(hypotheses);
                    return hypTruth !== undefined && hypTruth === 0.5;
                }).length;
                return [axiom, count] as [string, number];
            })
            .value()
        return new Map(ary);
    }

    /**
     * Returns the number of unknown hypothesis by axiom
     * @param evidences the evidences
     */
    unknownHypothesis(evidences: Map<string, number>) {
        const ary = _(Array.from(evidences))
            .filter(([id, truth]) => this._axioms.indexOf(id) >= 0)
            .map(([axiom, truth]) => {
                const hyps = this._hypothesisByAxiom.get(axiom);
                if (hyps === undefined) {
                    return [axiom, []] as [string, string[]];
                }
                const unknownHyps = _.filter(hyps, hypotheses => {
                    const hypTruth = evidences.get(hypotheses);
                    return hypTruth !== undefined && hypTruth === 0.5;
                });
                return [axiom, unknownHyps] as [string, string[]];
            })
            .value()
        return new Map(ary);
    }

    /**
     * Returns the axioms ordered descendant by delta assertion 
     */
    getOrderedAxioms(evidences: Map<string, number>) {
        const deltaHyp = new Map(this.deltasHypothesis(evidences));
        const unkownHyps = new Map(this.unknownHypothesis(evidences));
        return _(Array.from(evidences))
            .filter(([id]) => this._axioms.indexOf(id) >= 0)
            .map(([id, truth]) => {
                const dh = deltaHyp.get(id);
                const unknown = unkownHyps.get(id)||[];
                const ct = unknown.length;
                return {
                    id, truth,
                    to: truth === 0.5 ? 2 : truth,
                    dh: dh === undefined ? 0 : dh,
                    unknown,
                    ct
                };
            })
            .orderBy(['to','dh','ct'],['desc', 'desc','desc'])
            .value();
    }
}

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
 * Returns the dependencies
 * @param assertions the assertions
 */
export function createDependencies(assertions: Map<string, InferenceNode>): [string, string[]][] {
    return _(Array.from(assertions))
        .map(([id, expr]) => [id, expr.dependencies()] as [string, string[]])
        .value();
}

/**
 * Returns the predicate status list
 * @param evidences the evidences
 */
function toPredicateStatus(evidences: Map<string, number>): PredicateStatus[] {
    return _.map(Array.from(evidences), ([id, truth]) => { return { id, truth }; });
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
