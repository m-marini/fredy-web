import React, { Component } from 'react';
import './App.css';
import { FredyApp } from './react/FredyApp';
import { Col, Container, Nav, Navbar, Row, Tab, Tabs, Toast } from 'react-bootstrap';

import baseMapperJson from './react/mapper.json';
import { default as _ } from 'lodash';
import yamlModel from './animals.yml';
import YAML from 'yaml'
import { ModelDef, parseDefs } from './modules/fredy-parser';
import { EditorPanel } from './react/FredyEditor';
import { ImportFile } from './react/ImportFile';

const version = `${process.env.REACT_APP_VERSION}`;
const homepage = '#';

/**
 * Application state
 */
interface AppState {
  importModalShown: boolean;
  text: string,
  error?: string
  mapper?: Map<string, string>,
  modelDefs?: ModelDef
}

/**
 * Returns the results of the model definitions yaml text 
 *  
 * @param text the yaml text
 */
function loadModelDefs(text: string): { error?: string, modelDefs?: ModelDef, mapper?: Map<string, string> } {
  try {
    const modelJson = YAML.parse(text);
    const modelDefs = parseDefs(modelJson, '');
    const language = navigator.language.trim().split(/-|_/)[0];
    const uiMapper = _.get(baseMapperJson, language) || _.get(baseMapperJson, 'default');
    const modelLanguages = modelDefs.languages || {};
    const modelMapper = modelLanguages[language] || modelLanguages.default || {};
    const mapper: Map<string, string> =
      new Map(_.toPairs(_.defaults({}, uiMapper, modelMapper)));
    return { modelDefs, mapper, error: undefined };
  } catch (error: any) {
    return {
      error: '' + error
    };
  }
}

/**
 * The Fredy application component
 */
export default class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    // Sets the initial state
    const yamlText = yamlModel as string;
    //    const yamlText = 'yamlModel as string';
    const parsed = loadModelDefs(yamlText);
    this.state = { importModalShown: false, text: yamlText, ...parsed };
  }

  /**
   * Imports the text file
   * @param text the yaml text
   */
  private importFile(text: string | ArrayBuffer | null) {
    if (typeof (text) === 'string') {
      const parsed = loadModelDefs(text);
      this.setState({ importModalShown: false, text, ...parsed });
    } else {
      this.setState({ importModalShown: false, error: 'Wrong file content' });
    }

  }

  /**
   * Validates the yaml text 
   * @param text the yaml text
   */
  private validateYamlText(text: string) {
    const { error, modelDefs, mapper } = loadModelDefs(text);
    if (error) {
      this.setState({
        text, error
      });
    } else if (!modelDefs) {
      this.setState({
        text, error: 'Missing model definitions'
      });
    } else {
      this.setState({
        text,
        error,
        mapper,
        modelDefs
      });
    }
  }

  /**
   * Returns the rendered application
   */
  render() {
    const { error, mapper = new Map(), modelDefs, text, importModalShown } = this.state;
    const modelId = modelDefs?.id;
    return (
      <Container fluid>
        <Row>
          <Col>
            <Navbar expand="lg" bg="dark" data-bs-theme="dark">
              <Container fluid>
                <Navbar.Brand href="http://www.mmarini.org">www.mmarini.org</Navbar.Brand>
                Fredy {version}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                    <Nav.Item>
                      <Nav.Link href={`${homepage}`}>Fredy {version}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link onClick={ev => { this.setState({ importModalShown: true }) }}>
                        {mapper.get('import.title') || 'Import'}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link>
                        {mapper.get('help.title') || 'Help'}
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </Col>
        </Row>
        <Row>
          <Col>
            <Container>
              <Tabs defaultActiveKey={error ? 'fredy-editor' : 'fredy-panel'}
                id="fredy-tab"
                className="mb-3">
                <Tab eventKey="fredy-panel" title={(modelId ? (mapper.get(modelId) || modelId) : undefined) || 'Engine'}>
                  <Toast bg="danger" show={!!error}>
                    <Toast.Body className="text-white">{error}</Toast.Body>
                  </Toast>
                  {
                    modelDefs
                      ? (
                        <FredyApp mapper={mapper} model={modelDefs.model} />
                      )
                      : (<div></div>)
                  }
                </Tab>
                <Tab eventKey="fredy-editor" title={mapper.get('model.title') || 'Model'}>
                  <EditorPanel text={text}
                    error={error}
                    mapper={mapper}
                    onValidate={text => this.validateYamlText(text)} />
                </Tab>
              </Tabs>
            </Container>
          </Col>
        </Row>
        <ImportFile show={importModalShown}
          mapper={mapper}
          onCancel={() => this.setState({ importModalShown: false })}
          onFileRead={text => this.importFile(text)}
          onError={error => this.setState({
            error: 'Errror loading file',
            importModalShown: false
          })} />
      </Container >
    );
  }
}