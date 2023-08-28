import React from 'react';
import './App.css';
import { FredyApp } from './react/FredyPanel';
import { Col, Container, Row } from 'react-bootstrap';

import baseMapperJson from './react/mapper.json';
import { default as _ } from 'lodash';
import yamlModel from './animals.yml';
import YAML from 'yaml'
import { parseDefs } from './modules/fredy-parser';

const modelJson = YAML.parse(yamlModel as string);
const modelDef = parseDefs(modelJson, '');

function App() {
  const language = navigator.language.trim().split(/-|_/)[0];

  const uiMapper = _.get(baseMapperJson, language) || _.get(baseMapperJson, 'default');
  const modelLanguages = modelDef.languages || {};
  const modelMapper = modelLanguages[language] || modelLanguages.default || {};
  const mapper: Map<string, string> =
    new Map(_.toPairs(_.defaults({}, uiMapper, modelMapper)));
  return (
    <Container fluid>
      <Row>
        <Col>
          <FredyApp mapper={mapper} model={modelDef.model} />
        </Col>
      </Row>
    </Container >
  );
}

export default App;
