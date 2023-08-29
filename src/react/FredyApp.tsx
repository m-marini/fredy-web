import React, { Component } from "react";
import { AxiomTable, PredicateStatus, PredicateTable } from "./fredyComponents";
import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Model } from "../modules/fredy-model";
import { default as _ } from 'lodash';

/**
 * Fredy application panel properties
 */
interface FredyAppPros {
    mapper?: Map<string, string>,
    model: Model
}

/**
 * Fredy application panel state
 */
interface FredyAppState {
    evidences: Map<string, number>
}

/**
 * Renders the main fredy application panel.
 * 
 * It's composed by accordion of three sections: axioms, hypothesis and inferences
 */
export class FredyApp extends Component<FredyAppPros, FredyAppState> {
    constructor(props: FredyAppPros) {
        super(props);
        // Sets the initial state
        this.state = {
            evidences: props.model.infere(props.model.unknownAxioms())
        };
    }

    /**
     * Handles the axioms changes
     * @param axioms the new axioms
     */
    private handleAxiomsChange(axioms: PredicateStatus[]) {
        const { model } = this.props;
        const { evidences } = this.state;
        const newAxioms = model.extractAxioms(evidences);
        axioms.forEach(({ id, truth }) => {
            newAxioms.set(id, truth);
        });
        const newEvidences = model.infere(newAxioms);
        this.setState({ evidences: newEvidences });
    }

    /**
     * Returns the displayable axioms
     */
    private getAxioms(): PredicateStatus[] {
        const { model } = this.props;
        const { evidences } = this.state;
        return _(model.getOrderedAxioms(evidences))
            .sortBy(({ truth }) => {
                return truth === 0.5 ? -1000 : -truth;
            }).filter(({ truth }, idx) => truth !== 0.5 || idx === 0)
            .value();
    }

    /**
     * Returns the hipothesis
     */
    private getHypothesys() {
        return this.props.model.orderedHypothesis(this.state.evidences)
    }

    /**
     * Returns the hipothesis
     */
    private getInferences() {
        return _.filter(this.props.model.orderedInferences(this.state.evidences),
            ({ truth }) => truth !== 0.5);
    }

    /**
     * Reset all axioms
     */
    private resetAll() {
        const { model } = this.props;
        const evidences = model.infere(model.unknownAxioms());
        this.setState({
            evidences
        });
    }

    /**
     * Renders the panel
     */
    render() {
        const { mapper = new Map() } = this.props;
        // Extracts the axioms
        const axioms = this.getAxioms();
        // Extracts the hypothesis
        const hypothesis = this.getHypothesys();;
        // Extracts the inferences
        const inferences = this.getInferences();
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <Accordion defaultActiveKey="axioms" alwaysOpen>
                            <Accordion.Item eventKey="axioms">
                                <Accordion.Header>{mapper.get('axioms.title') || 'Axioms'}</Accordion.Header>
                                <Accordion.Body>
                                    <Card>
                                        <Button variant="secondary" onClick={ev => this.resetAll()}>
                                            {mapper?.get('resetAllButton.text') || 'Reset all'}
                                        </Button>
                                        <AxiomTable id="axioms" states={axioms} onChange={axioms => this.handleAxiomsChange(axioms)} mapper={mapper} />
                                    </Card>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                    <Col>
                        <Accordion defaultActiveKey={['hypothesis', 'inferences']} alwaysOpen>
                            <Accordion.Item eventKey="hypothesis">
                                <Accordion.Header>{mapper.get('hypothesis.title') || 'Hypothesis'}</Accordion.Header>
                                <Accordion.Body>
                                    <Card>
                                        <PredicateTable predicates={hypothesis} mapper={mapper} />
                                    </Card>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="inferences">
                                <Accordion.Header>{mapper.get('inferences.title') || 'Inferences'}</Accordion.Header>
                                <Accordion.Body>
                                    <Card>
                                        <PredicateTable predicates={inferences} mapper={mapper} />
                                    </Card>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        );
    }
}