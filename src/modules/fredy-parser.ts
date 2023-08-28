import { And, InferenceNode, Model, Not, Or, Predicate } from "./fredy-model";
import { default as _ } from 'lodash';

export interface PropertiesMap {
    [index: string]: string
}

export interface LanguagesMap {
    [index: string]: PropertiesMap
}

export interface ModelDef {
    model: Model,
    languages?: LanguagesMap
}
type Creator = (doc: any, location: string) => InferenceNode;

interface CreatorMap {
    [index: string]: Creator
}
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

const CREATE_BY_TYPE: CreatorMap = {
    predicate: parsePredicate,
    not: parseNot,
    and: parseAnd,
    or: parseOr
};

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
 * Returns the model and languages definitions from document
 * @param doc the doc
  */
export function parseDefs(doc: any, locator: string): ModelDef {
    getObject(doc, locator);
    const model = parseModel(doc, locator + '.model');
    const languages = parseLanguages(doc, locator + '.languages');
    return { model, languages };
}