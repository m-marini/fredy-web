import React, { FunctionComponent } from "react";
import { ButtonGroup, Card, Table, ToggleButton } from "react-bootstrap";
import { default as _ } from 'lodash';

/**
 * The predicate is defined by the identifier and the truth value
 */
export interface PredicateStatus {
    id: string,
    truth: number
}

interface PredicateProps {
    id: string,
    descr: string,
    truth: number,
    level: number
    mapper?: Map<string, string>
}

interface PredicateListProps {
    predicates: PredicateStatus[],
    mapper?: Map<string, string>
}

interface AxiomRowProps extends PredicateProps {
    mapper?: Map<string, string>,
    onChange?: (status: PredicateStatus) => void
}

interface AxiomTableProps {
    id: string,
    states: PredicateStatus[],
    mapper?: Map<string, string>,
    onChange?: (states: PredicateStatus[]) => void
}

interface AxiomButtonsProps {
    id: string,
    level: number,
    mapper?: Map<string, string>,
    onChange?: (status: PredicateStatus) => void;
};

const VARIANTS = [
    'danger',
    'warning',
    'light',
    'info',
    'success'
];

const LEVEL_DESCR = [
    'False', 'Quite false', 'Unknown', 'Quite true', 'True'
];

const BUTTONS_ATTRS = [
    {
        checkedVariant: 'success',
        uncheckedVariant: 'outline-success',
        descr: 'True (1)',
        truth: 1,
        level: 4
    }, {
        checkedVariant: 'info',
        uncheckedVariant: 'outline-info',
        descr: 'Quite true (0.75)',
        truth: 0.75,
        level: 3
    }, {
        checkedVariant: 'light',
        uncheckedVariant: 'outline-secondary',
        descr: 'Unknown (0.5)',
        truth: 0.5,
        level: 2
    }, {
        checkedVariant: 'warning',
        uncheckedVariant: 'outline-warning',
        descr: 'Quite false (0.25)',
        truth: 0.25,
        level: 1
    }, {
        checkedVariant: 'danger',
        uncheckedVariant: 'outline-danger',
        descr: 'False (0)',
        truth: 0,
        level: 0
    }
];

/**
 * Returns the predicate states from evidences
 * @param evidences the evidences
 * @param idMap the description by id
 */
export function createPredicateProps(evidences: PredicateStatus[], mapper: Map<string, string> = new Map()) {
    return _.map(evidences, (evidence) => {
        const status: PredicateProps = {
            id: evidence.id,
            descr: mapper.get(evidence.id) || evidence.id,
            truth: evidence.truth,
            level: Math.round(evidence.truth * 4),
            mapper: mapper
        };
        return status;
    });
}

/**
 * Renders the predicate status 
 */
export const PredicateRow: FunctionComponent<PredicateProps> = (params) => {
    const { descr, truth, level, mapper = new Map() } = params;
    const levelDescr = (mapper.get('predicate.level_' + level + '.descr') || LEVEL_DESCR[level])
        + ' ('
        + truth
        + ')';
    const variant = VARIANTS[level];
    return (
        <tr>
            <td>
                <Card bg={variant}>
                    <Card.Body className={'text-bg-' + variant + ' p-3'}>{descr}</Card.Body>
                </Card>
            </td>
            <td>
                <Card border={VARIANTS[level]}>
                    <Card.Body className={'text-bg-' + variant + ' p-3'}>{levelDescr}</Card.Body>
                </Card>
            </td>
        </tr >
    );
}

/**
 * Renders the predicate status list
 */
export const PredicateTable: FunctionComponent<PredicateListProps> = (params) => {
    const { predicates, mapper = new Map() } = params;
    const props = createPredicateProps(predicates, mapper);
    return (
        <Table responsive bordered>
            <thead>
                <tr>
                    <th>{mapper.get('predicate.title') || 'Predicate'}</th>
                    <th>{mapper.get('truth.title') || 'Truth'}</th>
                </tr>
            </thead>
            <tbody>
                {_.map(props, ({ id, descr, truth, level }, idx) => {
                    return (
                        <PredicateRow id={id}
                            key={id}
                            descr={descr}
                            truth={truth}
                            level={level}
                            mapper={mapper}
                        />);
                })
                }
            </tbody>
        </Table>
    );
}

/**
 * Renders the axiom buttons
 */
export const AxiomButtons: FunctionComponent<AxiomButtonsProps> = (props) => {
    const { id, level, onChange, mapper = new Map() } = props;
    return (
        <ButtonGroup>
            {
                _.map(BUTTONS_ATTRS, (attrs, idx) => {
                    const descrKey = 'axiom.level_' + attrs.level + '.descr';
                    return (
                        <ToggleButton
                            key={id + '_value_' + idx}
                            id={id + '_value_' + idx}
                            type="radio"
                            variant={level === attrs.level ? attrs.checkedVariant : attrs.uncheckedVariant}
                            name={id + '_value_' + idx}
                            value={attrs.truth}
                            checked={level === attrs.level}
                            onChange={ev => {
                                if (onChange) {
                                    onChange({
                                        id: id,
                                        truth: attrs.truth
                                    })
                                }
                            }}
                        >
                            {mapper.get(descrKey) || attrs.descr}
                        </ToggleButton>
                    );
                })
            }
        </ButtonGroup>
    );
}

/**
 * Renders the axiom row
 */
export const AxiomRow: FunctionComponent<AxiomRowProps> = (props) => {
    const { id, descr, level, onChange, mapper = new Map() } = props;
    return (
        <tr>
            <td>{descr}</td>
            <td><AxiomButtons id={id} level={level}
                onChange={onChange}
                mapper={mapper}
            /></td>
        </tr>
    );
}

/**
 * Renders the table of axioms
 */
export const AxiomTable: FunctionComponent<AxiomTableProps> = (props) => {
    const { states, mapper = new Map(), onChange } = props;
    const predsProps = createPredicateProps(states, mapper);
    return (
        <Table responsive bordered>
            <thead>
                <tr>
                    <th>{mapper.get('axiom.title') || 'Axiom'}</th>
                    <th>{mapper.get('truth.title') || 'Truth'}</th>
                </tr>
            </thead>
            <tbody>
                {
                    _.map(predsProps, (predProps, idx) => {
                        return (
                            <AxiomRow id={predProps.id}
                                key={predProps.id}
                                descr={predProps.descr}
                                truth={predProps.truth}
                                level={predProps.level}
                                mapper={mapper}
                                onChange={p => {
                                    if (onChange) {
                                        const newStates = _.map(states, state => {
                                            return state.id === p.id ? p : state
                                        });
                                        onChange(newStates);
                                    }
                                }} />
                        );
                    })
                }
            </tbody>
        </Table>
    );
}