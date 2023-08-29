import React, { FunctionComponent } from "react";
import { FloatingLabel, Form, InputGroup } from "react-bootstrap";

export interface EditorProps {
    text: string,
    error?: string,
    mapper?: Map<string, string>,
    onValidate?: (text: string) => void
}

/**
 * Renders the editor panel 
 */
export const EditorPanel: FunctionComponent<EditorProps> = (props) => {
    const { text, error, mapper, onValidate } = props;
    return (
        <Form noValidate>
            <Form.Group className="mb-3" id="yam-text">
                <InputGroup>
                    <FloatingLabel label={
                        mapper?.get('editorField.text') || 'Model text'
                    }>
                        <Form.Control id='yaml-text-field'
                            as="textarea"
                            placeholder="Yaml model definitions"
                            value={text}
                            isValid={!error}
                            isInvalid={!!error}
                            onChange={ev => {
                                if (onValidate) {
                                    onValidate(ev.target.value);
                                }
                            }}
                            className="font-monospace"
                            style={{ height: '600px' }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {error || ''}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                </InputGroup>
            </Form.Group>
        </Form>
    );
}