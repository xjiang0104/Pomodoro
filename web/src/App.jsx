/*
  App.jsx
  Main application component that manages the state of the selected project
  and renders the ProjectList and TaskList components.
*/

import { HStack, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import ProjectList from "./components/ProjectList.jsx";
import TaskList from "./components/TaskList.jsx";
import PomodoroTimer from "./components/PomodoroTimer.jsx";

export default function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(undefined);
  const [activeTask, setActiveTask] = useState(null);
  const [bump, setBump] = useState(0);
  <PomodoroTimer
    activeTask={activeTask}
    onPomodoroAdded={(updated) => {
      // notify task list to refresh
      setBump((x) => x + 1);

      // update active task's pomodoro count if it's the same task
      setActiveTask((t) =>
        t && t.id === updated.id ? { ...t, pomodoros: updated.pomodoros } : t
      );
    }}
  />;
  return (
    <>
      <HStack align="start" spacing={0}>
        <ProjectList
          selectedId={selectedProjectId}
          onSelect={(id) => {
            setSelectedProjectId(id);
            setActiveTask(null);
          }}
        />
        <Box flex="1" p={6}>
          <Text fontSize="xl" fontWeight="bold">
            Tasks
          </Text>
          <TaskList
            projectId={selectedProjectId}
            activeTaskId={activeTask?.id}
            onSelectTask={setActiveTask}
            bump={bump}
          />
        </Box>
      </HStack>

      <PomodoroTimer
        activeTask={activeTask}
        onPomodoroAdded={() => setBump((x) => x + 1)}
      />
    </>
  );
}
