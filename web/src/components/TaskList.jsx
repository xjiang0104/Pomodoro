/*
    Task List Component
    - shows list of tasks for selected project
    - add new task  
    - toggle done
    - rename task
    - delete task
*/
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  HStack,
  IconButton,
  Input,
  List,
  ListItem,
  Spacer,
  Text,
  VStack,
  useToast,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { listTasks, createTask, deleteTask, patchTask } from "../api.js";

export default function TaskList({
  projectId,
  activeTaskId,
  onSelectTask,
  bump,
}) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [estimate, setEstimate] = useState(1); // NEW: planned tomatoes (default 1)
  const toast = useToast();

  async function refresh() {
    if (!projectId) return setTasks([]);
    try {
      const data = await listTasks(projectId);
      setTasks(data);
    } catch (e) {
      toast({
        status: "error",
        title: "Load tasks failed",
        description: String(e),
      });
    }
  }

  useEffect(() => {
    refresh(); /* eslint-disable-next-line */
  }, [projectId, bump]);

  async function add() {
    const t = title.trim();
    if (!t || !projectId) return;
    try {
      await createTask(projectId, t, estimate); // pass estimate
      setTitle("");
      setEstimate(1); // reset to default
      await refresh();
    } catch (e) {
      toast({
        status: "error",
        title: "Create task failed",
        description: String(e),
      });
    }
  }

  async function toggleDone(task) {
    try {
      await patchTask(task.id, { done: !task.done });
      await refresh();
    } catch (e) {
      toast({
        status: "error",
        title: "Update task failed",
        description: String(e),
      });
    }
  }

  async function rename(task, newTitle) {
    try {
      await patchTask(task.id, { title: newTitle });
      await refresh();
    } catch (e) {
      toast({
        status: "error",
        title: "Rename failed",
        description: String(e),
      });
    }
  }

  async function del(id) {
    try {
      await deleteTask(id);
      await refresh();
    } catch (e) {
      toast({
        status: "error",
        title: "Delete task failed",
        description: String(e),
      });
    }
  }

  return (
    <Box>
      {!projectId && <Text color="gray.400">Select a project on the left</Text>}

      {projectId && (
        <VStack align="stretch" spacing={4}>
          {/* NEW: input + number picker */}
          <HStack>
            <Input
              placeholder="Add a task and press Enter"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
            <HStack>
              <Text fontSize="sm" color="gray.300">
                🍅
              </Text>
              <NumberInput
                size="sm"
                min={1}
                max={12}
                value={estimate}
                onChange={(_, v) => setEstimate(Number.isFinite(v) ? v : 1)}
                w="80px"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
            <Button onClick={add} isDisabled={!title.trim()}>
              Add
            </Button>
          </HStack>

          <List spacing={2}>
            {tasks.map((t) => (
              <ListItem
                key={t.id}
                onClick={() => onSelectTask(t)}
                style={{
                  cursor: "pointer",
                  background: activeTaskId === t.id ? "#2a2a2a" : "transparent",
                }}
              >
                <HStack>
                  <Checkbox isChecked={t.done} onChange={() => toggleDone(t)} />
                  <Input
                    variant="unstyled"
                    value={t.title}
                    onChange={(e) => rename(t, e.target.value)}
                    textDecoration={t.done ? "line-through" : "none"}
                  />

                  {/* show completed vs planned */}
                  <Badge ml={2} title="Completed tomatoes">
                    🍅 {t.pomodoros ?? 0}
                  </Badge>
                  <Badge ml={1} variant="outline" title="Planned tomatoes">
                    / {t.estimate ?? 1}
                  </Badge>

                  <Spacer />
                  <IconButton
                    aria-label="delete"
                    size="sm"
                    variant="ghost"
                    icon={<DeleteIcon />}
                    onClick={() => del(t.id)}
                  />
                </HStack>
              </ListItem>
            ))}
            {tasks.length === 0 && (
              <Text color="gray.400" fontSize="sm">
                No tasks yet
              </Text>
            )}
          </List>
        </VStack>
      )}
    </Box>
  );
}
