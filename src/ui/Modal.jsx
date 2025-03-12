import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import useOutsideClick from "../hooks/useOutsideClick.js";
import ConfirmCloseForm from "./ConfirmCloseForm.jsx";
import { useCabinContext } from "../ui/AppLayout.jsx";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

const ModalContext = createContext();

// Parent component
function Modal({ children }) {
  const [openName, setOpenName] = useState("");
  const { setCloseForm, closeForm, isDirty, setIsDirty } = useCabinContext();
  // const [openConfirm, setOpenConfirm] = useState("");

  const close = (e) => {
    if (openName === "edit") return setOpenName("");

    if (e?.target?.textContent === "Confirm") {
      setOpenName("");
      setIsDirty(false);
      setCloseForm("");
    } else if (e?.target?.textContent === "Cancel") setOpenName("");
    else if (isDirty && closeForm !== "confirm" && e === undefined)
      setCloseForm("confirm");
    else if (closeForm === "confirm") {
      setCloseForm("");
    } else setOpenName("");
  };
  const openModal = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, openModal, setOpenName }}>
      {children}
    </ModalContext.Provider>
  );
}

// Children
function Open({ children, opens }) {
  const { openModal } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => openModal(opens) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);

  const ref = useOutsideClick(close);

  // function handleCloseModal(e) {
  //   if (e.currentTarget === e.target) close();
  // }

  if (name !== openName) return null;

  return createPortal(
    // <Overlay onClick={handleCloseModal}>
    <div>
      <Overlay>
        <StyledModal ref={ref}>
          <Button onClick={() => close()}>
            <HiXMark />
          </Button>

          <div>
            {cloneElement(children, {
              onCloseModal: (e) => close(e),
            })}
          </div>
        </StyledModal>
      </Overlay>
    </div>,
    document.body
  );
}

function RemoveForm({ name }) {
  const { setOpenName, close, openName } = useContext(ModalContext);
  const { setCloseForm, setIsDirty } = useCabinContext();

  const ref = useOutsideClick(close);

  if (name !== "confirm") return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <ConfirmCloseForm
          mode={openName === "cabin-form" ? "creation" : "editing"}
          onClick={() => {
            setOpenName("");
            setIsDirty(false);
            setCloseForm("");
          }}
        />
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;
Modal.RemoveForm = RemoveForm;

export default Modal;
