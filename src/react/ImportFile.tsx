import React, { FunctionComponent } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface ImportFileProps {
    show: boolean;
    mapper?: Map<string, string>,
    onCancel?: () => void
    onFileRead?: (arg: string | ArrayBuffer | null) => void;
    onError?: (arg: string) => void;
};

/**
 * 
 */
export const ImportFile: FunctionComponent<ImportFileProps> = (props) => {
    const { show, mapper, onCancel, onFileRead, onError } = props;

    /**
     * 
     * @param file 
     */
    function onFileChange(file: Blob) {
        if (onFileRead) {
            const fr = new FileReader();
            fr.onload = (e) => {
                onFileRead(fr.result);
            };
            fr.onerror = (event) => {
                if (onError) {
                    onError('' + event);
                }
            };
            try {
                fr.readAsText(file);
            } catch (e: any) {
                if (onError) {
                    onError('' + e);
                }
            }
        }
    }

    return (
        <Modal size="lg" show={show} onHide={() => { if (onCancel) { onCancel(); } }}>
            <Modal.Header closeButton>
                <Modal.Title>{mapper?.get('importFile.title') || 'Import model from file'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{
                    mapper?.get('importFile.descr')
                    || 'The model will be imported from the selected file.'
                }</p>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Control type="file"
                            onChange={(ev: any) => onFileChange(ev.target.files[0])}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => { if (onCancel) { onCancel(); } }}>
                    {mapper?.get('cancelButton.text') || 'Cancel'}
                </Button>
            </Modal.Footer>
        </Modal >
    );
}
