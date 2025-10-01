import { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  List,
  ListItem,
  Spacer,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { listProjects, createProject, deleteProject } from "../api.js";

export default function ProjectList({ selectedId, onSelect }) {
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");
  const toast = useToast();

  async function refresh() {
    try {
      const data = await listProjects();
      setProjects(data);
      if (!selectedId && data.length) onSelect(data[0].id);
    } catch {
      toast({ status: "error", title: "Load projects failed" });
    }
  }

  useEffect(() => {
    refresh(); /* eslint-disable-next-line */
  }, []);

  async function add() {
    const name = newName.trim();
    if (!name) return;
    try {
      await createProject(name);
      setNewName("");
      await refresh();
      toast({ status: "success", title: "Project created" });
    } catch {
      toast({ status: "error", title: "Create project failed" });
    }
  }

  async function del(id) {
    try {
      await deleteProject(id);
      await refresh();
      if (selectedId === id) onSelect(undefined);
      toast({ status: "info", title: "Project deleted" });
    } catch {
      toast({ status: "error", title: "Delete project failed" });
    }
  }

  return (
    <Box w="280px" h="100vh" borderRight="1px solid #2a2a2a" p={4}>
      <VStack align="stretch" spacing={3}>
        <HStack>
          <Input
            size="sm"
            placeholder="New project"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <Button size="sm" onClick={add}>
            Add
          </Button>
        </HStack>

        <List spacing={1}>
          {projects.map((p) => (
            <ListItem key={p.id} py={1}>
              <HStack>
                <Text
                  noOfLines={1}
                  cursor="pointer"
                  fontWeight={selectedId === p.id ? "bold" : "normal"}
                  onClick={() => onSelect(p.id)}
                >
                  {p.name}
                </Text>
                <Spacer />
                <IconButton
                  aria-label="delete"
                  size="xs"
                  variant="ghost"
                  icon={<DeleteIcon />}
                  onClick={() => del(p.id)}
                />
              </HStack>
            </ListItem>
          ))}
          {projects.length === 0 && (
            <Text color="gray.400" fontSize="sm">
              No projects yet
            </Text>
          )}
        </List>
      </VStack>
    </Box>
  );
}
