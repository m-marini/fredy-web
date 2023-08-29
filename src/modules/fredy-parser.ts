import { And, Iff, Implies, IsCertain, IsCertainFalse, IsCertainTrue, IsAntinomy, Not, Or, Predicate, Somewhat, Very, Xor, Truth, Falsity, Certainity } from "./fredy-inference-nodes";
import { InferenceNode, Model } from "./fredy-model";
import { default as _ } from 'lodash';

export interface PropertiesMap {
    [index: string]: string
}

export interface LanguagesMap {
    [index: string]: PropertiesMap
}

export interface ModelDef {
    id: string,
    model: Model,
    languages?: LanguagesMap
}

type Creator = (doc: any, location: string) => InferenceNode;

interface CreatorMap {
    [index: string]: Creator
}

const CURRENT_VERSION = '0.1';

const CREATE_BY_TYPE: CreatorMap = {
    predicate: parsePredicate,
    not: parseNot,
    and: parseAnd,
    or: parseOr,
    xor: parseXor,
    isCertain: parseIsCertain,
    isCertainTrue: parseIsCertainTrue,
    isCertainFalse: parseIsCertainFalse,
    implies: parseImplies,
    iff: parseIff,
    isAntinomy: parseIsAntinomy,
    truth: parseTruth,
    falsity: parseFalsity,
    certainity: parseCertainity,
    very: parseVery,
    somewhat: parseSomewhat
};

/**
 * Returns the attribute by traversing a json document
 * @param doc the document
 * @param location the location
 */
function getOptAttr(doc: any, location: string) {
    if (location.startsWith('.')) {
        location = location.substring(1);
    }
    if (location === '') {
        return doc;
    }
    const node = _.get(doc, location, undefined);
    return node;
}

/**
 * Returns the attribute by traversing a json document
 * @param doc the document
 * @param location the location
 */
function getAttr(doc: any, location: string) {
    const node = getOptAttr(doc, location);
    if (node === undefined) {
        throw new Error('Missing node ' + location);
    }
    return node;
}

function getObject(doc: any, location: string): object {
    const node = getAttr(doc, location);
    if (typeof (node) !== 'object') {
        throw new Error('object expected: ' + location);
    }
    return node;
}

function getString(doc: any, location: string): string {
    const node = getAttr(doc, location);
    if (typeof (node) !== 'string') {
        throw new Error('string expected: ' + location);
    }
    return node;
}

function getArray(doc: any, location: string): any[] {
    const node = getAttr(doc, location);
    if (!Array.isArray(node)) {
        throw new Error('array expected: ' + location);
    }
    return node;
}

/**
 * Returns the predicate from document
 * @param doc the document
 * @param location the location
 */
function parsePredicate(doc: object, location: string): Predicate {
    return new Predicate(getString(doc, location + '.id'));
}

/**
 * Returns the not node from json document
 * @param doc the doc
 * @param location the location
 */
function parseNot(doc: object, location: string): Not {
    return new Not(parseNode(doc, location + '.expression'));
}


/**
 * Returns the very node from json document
 * @param doc the doc
 * @param location the location
 */
function parseVery(doc: object, location: string): Very {
    return new Very(parseNode(doc, location + '.expression'));
}

/**
 * Returns the somewhat node from json document
 * @param doc the doc
 * @param location the location
 */
function parseSomewhat(doc: object, location: string): Somewhat {
    return new Somewhat(parseNode(doc, location + '.expression'));
}

/**
 * Returns the isCertain node from json document
 * @param doc the doc
 * @param location the location
 */
function parseIsCertain(doc: object, location: string): IsCertain {
    return new IsCertain(parseNode(doc, location + '.expression'));
}

/**
 * Returns the isCertainTrue node from json document
 * @param doc the doc
 * @param location the location
 */
function parseIsCertainTrue(doc: object, location: string): IsCertainTrue {
    return new IsCertainTrue(parseNode(doc, location + '.expression'));
}

/**
 * Returns the isCertainFalse node from json document
 * @param doc the doc
 * @param location the location
 */
function parseIsCertainFalse(doc: object, location: string): IsCertainFalse {
    return new IsCertainFalse(parseNode(doc, location + '.expression'));
}

/**
 * Returns the and node from json document
 * @param doc the doc
 * @param location the location
 */
function parseAnd(doc: object, location: string): And {
    const expressions = getArray(doc, location + '.expressions');
    const expressionNodes = _.map(expressions as any[], (value, idx) =>
        parseNode(doc, location + '.expressions[' + idx + ']')
    );
    return new And(expressionNodes);
}

/**
 * Returns the or node from json document
 * @param doc the doc
 * @param location the location
 */
function parseOr(doc: object, location: string): Or {
    const expressions = getArray(doc, location + '.expressions');
    const expressionNodes = _.map(expressions as any[], (value, idx) =>
        parseNode(doc, location + '.expressions[' + idx + ']')
    );
    return new Or(expressionNodes);
}

/**
 * Returns the xor node from json document
 * @param doc the doc
 * @param location the location
 */
function parseXor(doc: object, location: string): Xor {
    const expressions = getArray(doc, location + '.expressions');
    const expressionNodes = _.map(expressions as any[], (value, idx) =>
        parseNode(doc, location + '.expressions[' + idx + ']')
    );
    return new Xor(expressionNodes);
}

/**
 * Returns the implies node from json document
 * @param doc the doc
 * @param location the location
 */
function parseImplies(doc: object, location: string): Implies {
    const antecedent = parseNode(doc, location + '.antecedent');
    const consequent = parseNode(doc, location + '.consequent');
    return new Implies(antecedent, consequent);
}

/**
 * Returns the implies node from json document
 * @param doc the doc
 * @param location the location
 */
function parseIff(doc: object, location: string): Iff {
    const antecedent = parseNode(doc, location + '.antecedent');
    const consequent = parseNode(doc, location + '.consequent');
    return new Iff(antecedent, consequent);
}

/**
 * Returns the isParadox node from json document
 * @param doc the doc
 * @param location the location
 */
function parseIsAntinomy(doc: object, location: string): IsAntinomy {
    const assertion = parseNode(doc, location + '.assertion');
    const negation = parseNode(doc, location + '.negation');
    return new IsAntinomy(assertion, negation);
}

/**
 * Returns the truth node from json document
 * @param doc the doc
 * @param location the location
 */
function parseTruth(doc: object, location: string): Truth {
    const assertion = parseNode(doc, location + '.assertion');
    const negation = parseNode(doc, location + '.negation');
    return new Truth(assertion, negation);
}

/**
 * Returns the falsity node from json document
 * @param doc the doc
 * @param location the location
 */
function parseFalsity(doc: object, location: string): Falsity {
    const assertion = parseNode(doc, location + '.assertion');
    const negation = parseNode(doc, location + '.negation');
    return new Falsity(assertion, negation);
}

/**
 * Returns the certainity node from json document
 * @param doc the doc
 * @param location the location
 */
function parseCertainity(doc: object, location: string): Certainity {
    const assertion = parseNode(doc, location + '.assertion');
    const negation = parseNode(doc, location + '.negation');
    return new Certainity(assertion, negation);
}

/**
 * Returns the model from json document
 * @param doc the document
 * @param location the location
 */
export function parseNode(doc: any, location: string): InferenceNode {
    getObject(doc, location)
    const nodeType = getString(doc, location + '.type');
    const creator = CREATE_BY_TYPE[nodeType];
    if (creator === undefined) {
        throw new Error('Unknown node type "' + nodeType + '": ' + location);
    }
    return creator(doc, location);
}

function parseLanguage(doc: any, location: string): PropertiesMap {
    const lang = getObject(doc, location);
    const ary = _.fromPairs(_.map(_.keys(lang), id =>
        [id, getString(doc, location + '.' + id)]));
    return ary;
}

function parseLanguages(doc: any, location: string): LanguagesMap | undefined {
    if (!getOptAttr(doc, location)) {
        return undefined;
    }
    const languages = getObject(doc, location);
    const ary = _.fromPairs(_.map(_.keys(languages), id => [id, parseLanguage(doc, location + '.' + id)]));
    return ary;
}

/**
 * Returns the model from json document
 * @param doc the doc
  */
export function parseModel(doc: any, location: string): Model {
    getObject(doc, location);
    const assertionAry = _(_.keys(getAttr(doc, location)))
        .map(id => [id, parseNode(doc, location + '.' + id)] as [string, InferenceNode]
        )
        .value();
    const assertionsMap = new Map(assertionAry);
    return new Model(assertionsMap);
}

/**
 * Validates the definitions version
 * @param version the version
 */
function validateVersion(version: string) {
    if (version !== CURRENT_VERSION) {
        throw new Error('Model version must be ' + CURRENT_VERSION + ' (' + version + ')');
    }
}

/**
 * Returns the model and languages definitions from document
 * @param doc the doc
  */
export function parseDefs(doc: any, locator: string): ModelDef {
    getObject(doc, locator);
    const version = getString(doc, locator + '.version');
    validateVersion(version);
    const id = getString(doc, locator + '.id');
    const model = parseModel(doc, locator + '.model');
    const languages = parseLanguages(doc, locator + '.languages');
    return { id, model, languages };
}