import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import styled from "styled-components";
import { createContext, useContext, useState } from "react";

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  overflow: auto;
`;

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const CabinContext = createContext();

function AppLayout() {
  const [isDirty, setIsDirty] = useState(false);
  const [closeForm, setCloseForm] = useState("");

  return (
    <CabinContext.Provider
      value={{
        setCloseForm,
        closeForm,
        isDirty,
        setIsDirty,
      }}
    >
      <StyledAppLayout>
        <Header />
        <Sidebar />
        <Main>
          <Container>
            <Outlet />
          </Container>
        </Main>
      </StyledAppLayout>
    </CabinContext.Provider>
  );
}

export function useCabinContext() {
  const context = useContext(CabinContext);
  if (context === undefined)
    throw new Error("useCabinContext was used outside of CabinContextProvider");
  return context;
}

export default AppLayout;
