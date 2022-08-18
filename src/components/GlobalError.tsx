import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { globalErrorSelector, setGlobalError } from "../app/core-slice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import AppIcon from "./AppIcon";

export default function GlobalError() {
  const error = useAppSelector(globalErrorSelector);

  const dispatch = useAppDispatch();

  const hideError = () => {
    dispatch(setGlobalError(''));
  }

  return <Modal isOpen={!!error} toggle={hideError} size='md' centered backdrop="static">
    <ModalHeader toggle={hideError} className="text-danger">
      <AppIcon icon='warning' />
      <span className="ms-2">Error</span>
      </ModalHeader>
    <ModalBody>
      {error}
    </ModalBody>
    <ModalFooter className="text-center">
      <Button color="primary" onClick={hideError}>Ok</Button>
    </ModalFooter>
  </Modal>
}