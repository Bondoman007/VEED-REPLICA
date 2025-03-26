import { AppShell } from "@mantine/core";
import LeftMenu from "./components/LeftMenu/LeftMenu";
import Canvas from "./components/Canvas/Canvas";
import Timeline from "./components/Timeline/Timeline";

function App() {
  return (
    <AppShell navbar={{ width: 300, breakpoint: "sm" }} padding="md">
      <AppShell.Navbar p="md">
        <LeftMenu />
      </AppShell.Navbar>
      <AppShell.Main>
        <Canvas />
        <Timeline />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
