import { useEffect, useRef, useState } from "react";
import {
  Box,
  HStack,
  Text,
  IconButton,
  Select,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { RepeatIcon, CheckIcon } from "@chakra-ui/icons";
import { FiPlay, FiPause, FiX, FiMaximize } from "react-icons/fi";
import { patchTask } from "../api.js";

const MODES = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
const SRC = new URL("../assets/ding.wav", import.meta.url).toString();

export default function PomodoroTimer({ activeTask, onPomodoroAdded }) {
  const [mode, setMode] = useState("focus");
  const [seconds, setSeconds] = useState(MODES.focus);
  const [running, setRunning] = useState(false);
  const tRef = useRef(null);
  const toast = useToast();
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dingRef = useRef(null);

  useEffect(() => {
    stop();
    setSeconds(MODES[mode]);
  }, [mode]);

  useEffect(() => {
    if (!running) return;
    tRef.current = setInterval(
      () => setSeconds((s) => Math.max(0, s - 1)),
      1000
    );
    return () => clearInterval(tRef.current);
  }, [running]);

  useEffect(() => {
    if (seconds !== 0) return;
    if (running) stop();
    if (mode === "focus") {
      playDing();
      completeNow(false);
    } else if (mode === "short") {
      playDing();
    } else if (mode === "long") {
      playDing();
    }
  }, [seconds]); // eslint-disable-line

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        toggleRun();
      } // Space
      else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } // F:
      else if (e.key === "r" || e.key === "R") {
        reset();
      }
    };
    const onFsChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));

    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFsChange);
    };
  }, []);

  useEffect(() => {
    const audio = new Audio(SRC);
    audio.preload = "auto";
    audio.volume = 1.0;
    dingRef.current = audio;
  }, []);

  function stop() {
    setRunning(false);
    clearInterval(tRef.current);
  }
  function reset() {
    stop();
    setSeconds(MODES[mode]);
  }
  function toggleRun() {
    setRunning((r) => !r);
  }
  function playDing() {
    const a = dingRef.current ?? new Audio(SRC);
    try {
      a.currentTime = 0;
      a.volume = 1.0;
      a.play().catch(() => new Audio(SRC).play().catch(() => {}));
    } catch {}
  }
  async function toggleFullscreen() {
    const el = containerRef.current || document.documentElement;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch (e) {
      // ignore
    }
  }
  async function completeNow(manual = true) {
    if (!activeTask) {
      toast({ status: "warning", title: "Select a task first" });
      return;
    }
    try {
      if (manual) {
        playDing(); //
      }
      const next = (activeTask.pomodoros ?? 0) + 1;
      // update task
      const updated = await patchTask(activeTask.id, { pomodoros: next });

      const id = toast({
        status: "success",
        title: manual ? `Completed early: +1 🍅` : `Focus finished: +1 🍅`,
        description: `Task: ${activeTask.title}`,
        duration: 500,
        isClosable: true,
      });
      // inform parent
      onPomodoroAdded && onPomodoroAdded(updated);

      stop();
      setMode("short");
      setSeconds(MODES.short);
    } catch (e) {
      toast({
        status: "error",
        title: "Update failed",
        description: String(e),
      });
    }
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const disabled = !activeTask;

  return (
    <Box ref={containerRef}>
      {isFullscreen ? (
        // ======= Full Screen Mode =======
        <Box
          w="100vw"
          h="100vh"
          bg="#0B0F14"
          color="#CFFAE3"
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          userSelect="none"
        >
          <Text fontWeight="bold" opacity={0.7} mb={4}>
            {activeTask ? activeTask.title : "No task selected"}
          </Text>

          <Text
            fontFamily="'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="clamp(6rem, 18vw, 24rem)"
            lineHeight="1"
            letterSpacing="0.05em"
            textShadow="0 0 24px rgba(0,255,170,.25)"
            color="#00FF88"
          >
            {mm}:{ss}
          </Text>

          <HStack mt={10} spacing={4}>
            <IconButton
              aria-label="play/pause"
              icon={running ? <FiPause /> : <FiPlay />}
              onClick={toggleRun}
              isDisabled={disabled}
              size="md"
              rounded="full"
              variant="outline"
            />
            <IconButton
              aria-label="complete now"
              icon={<CheckIcon />}
              onClick={() => {
                playDing(); // 🔔
                completeNow(true); //
              }}
              isDisabled={disabled || mode !== "focus"}
              size="md"
              rounded="full"
              variant="outline"
            />
            <IconButton
              aria-label="reset"
              icon={<RepeatIcon />}
              onClick={reset}
              isDisabled={disabled}
              size="md"
              rounded="full"
              variant="outline"
            />
            <IconButton
              aria-label="exit fullscreen"
              icon={<FiX />}
              onClick={toggleFullscreen}
              size="md"
              rounded="full"
              variant="outline"
            />
          </HStack>

          <Text
            mt={8}
            fontSize="sm"
            letterSpacing="0.1em"
            color="gray.400"
            textAlign="center"
          >
            <Box as="span" px={2} py={0.5} bg="gray.700" rounded="md">
              Space
            </Box>{" "}
            Play/Pause ·{" "}
            <Box as="span" px={2} py={0.5} bg="gray.700" rounded="md">
              F
            </Box>{" "}
            Fullscreen ·{" "}
            <Box as="span" px={2} py={0.5} bg="gray.700" rounded="md">
              R
            </Box>{" "}
            Reset ·{" "}
            <Box as="span" px={2} py={0.5} bg="gray.700" rounded="md">
              Esc
            </Box>{" "}
            Exit
          </Text>
        </Box>
      ) : (
        // ======= Usual Mode =======
        <Box
          position="fixed"
          left="50%"
          bottom="24px"
          transform="translateX(-50%)"
          px={4}
          py={2}
          bg="rgba(15,18,22,0.85)"
          border="1px solid #2a2a2a"
          rounded="full"
          shadow="lg"
          backdropFilter="blur(6px)"
        >
          <HStack spacing={3} align="center">
            <Select
              size="sm"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              w="140px"
              variant="filled"
              bg="#111"
              borderColor="#222"
            >
              <option value="focus">Focus 25m</option>
              <option value="short">Short 5m</option>
              <option value="long">Long 15m</option>
            </Select>

            <Text
              fontFamily="'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="3xl"
              fontWeight="bold"
              minW="96px"
              textAlign="center"
              color="#00FF88"
              textShadow="0 0 8px #00ff8890"
            >
              {mm}:{ss}
            </Text>

            {/* Start/Pause */}
            <Tooltip label={running ? "Pause" : "Start"}>
              <IconButton
                aria-label="start/pause"
                icon={running ? <FiPause /> : <FiPlay />}
                onClick={toggleRun}
                isDisabled={disabled}
                size="sm"
                rounded="full"
                variant="outline"
              />
            </Tooltip>

            {/* Complete */}
            <Tooltip label="Complete">
              <IconButton
                aria-label="complete now"
                icon={<CheckIcon />}
                onClick={() => completeNow(true)}
                isDisabled={disabled || mode !== "focus"}
                size="sm"
                rounded="full"
                variant="outline"
              />
            </Tooltip>

            {/* Reset */}
            <Tooltip label="Reset">
              <IconButton
                aria-label="reset"
                icon={<RepeatIcon />}
                onClick={reset}
                isDisabled={disabled}
                size="sm"
                rounded="full"
                variant="outline"
              />
            </Tooltip>

            {/* Enter Focus (Fullscreen) */}
            <Tooltip label="Focus (Fullscreen)">
              <IconButton
                aria-label="focus fullscreen"
                icon={<FiMaximize />}
                onClick={toggleFullscreen}
                size="sm"
                rounded="full"
                variant="outline"
              />
            </Tooltip>

            <Text fontSize="sm" color="gray.300" minW="180px" noOfLines={1}>
              {activeTask ? activeTask.title : "No task selected"}
            </Text>
          </HStack>
        </Box>
      )}
    </Box>
  );
}
