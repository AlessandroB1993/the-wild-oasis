import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled, { css } from "styled-components";

const StyledDiv = styled.div`
  border: 1px solid var(--color-grey-700);
  background-color: var(--color-grey-100);
  border-radius: var(--border-radius-sm);
  padding: 2rem;

  & p {
    font-size: 1.4rem;
    font-weight: 400;
    text-align: center;
    color: var(--color-grey-500);
  }

  ${(props) =>
    props.isDragActive === true &&
    css`
      background-color: var(--color-grey-700);

      & p {
        color: var(--color-green-100);
      }
    `}

  ${(props) =>
    props.selectedFile === true &&
    css`
      background-color: var(--color-green-100);
      border: 1px solid var(--color-green-700);
      opacity: 0.8;

      & p {
        color: var(--color-green-700);
      }
    `}
`;

const Preview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 15rem;
  margin: 0 auto;

  & img {
    max-width: 13rem;
    justify-self: center;
    align-self: center;
  }
`;

const StyledPara = styled.p`
  font-size: 1.7rem;
  color: var(--color-green-700);
`;

const StyledErr = styled.p`
  font-size: 1.6rem;
  color: var(--color-red-700);
`;

const Check = styled.span`
  font-size: 2.3rem;
  color: #19ad19;
`;

function DragAndDrop({ name, setValue, register, isEditingSession, errors }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setValue(name, acceptedFiles);
      setSelectedFile(acceptedFiles[0]);
    },
    [setValue, name]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  return (
    // Assigns drag and drop events, must be called on a parent container
    <>
      <StyledDiv
        $isDragActive={isDragActive}
        $selectedFile={selectedFile ? true : false}
        {...getRootProps()}
      >
        {/* Manages selection of file when user clicks */}
        <input id="image" {...getInputProps()} />
        <input
          type="hidden"
          {...register("image", {
            required: isEditingSession ? false : "This field is required",
          })}
        />
        {isDragActive ? (
          <p>Drop your files here...</p>
        ) : (
          <p>Drag the files here or click to select</p>
        )}
      </StyledDiv>
      {selectedFile && (
        <Preview>
          <StyledPara>
            <Check>✔</Check> {selectedFile.name}
          </StyledPara>
          <img src={URL.createObjectURL(selectedFile)} alt="Preview" />
        </Preview>
      )}

      {errors[name] && !selectedFile && (
        <StyledErr>{errors[name].message}</StyledErr>
      )}
    </>
  );
}

export default DragAndDrop;
