import React, { useCallback } from "react";
import {
  AppShell,
  Title,
  TextInput,
  NumberInput,
  Button,
  Group,
  Slider,
} from "@mantine/core";

import { createStyles } from "@mantine/styles";

import { useSelector, useDispatch } from "react-redux";
import {
  updateMediaItem,
  togglePlay,
  addMediaItem,
  selectItem,
  seekTime,
  setDuration,
} from "../../features/editorSlice";
const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === "dark" ? "#1e1e1e" : "#ffffff",
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? "#333" : theme.colors.gray[3]
    }`,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[2]
        : theme.colors.dark[7],
    padding: theme.spacing.md,
  },
  section: {
    padding: `${theme.spacing.lg}px 0`,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? "#333" : theme.colors.gray[3]
    }`,
    "&:last-of-type": {
      borderBottom: "none",
    },
  },
  sectionTitle: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 700,
    textTransform: "uppercase",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[4]
        : theme.colors.gray[7],
    letterSpacing: 0.75,
    marginBottom: theme.spacing.sm,
  },
  uploadButton: {
    background: theme.colorScheme === "dark" ? "#333" : "#f5f5f5",
    color: theme.colorScheme === "dark" ? theme.white : theme.colors.dark[7],
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[5]
    }`,
    transition: "background 0.3s, transform 0.2s",
    "&:hover": {
      background: theme.colorScheme === "dark" ? "#444" : theme.colors.gray[1],
      transform: "scale(1.02)",
    },
  },
  playButton: {
    backgroundColor: theme.colors.pink[5],
    color: theme.white,
    minWidth: 120,
    padding: "12px 24px",
    fontSize: "1.1rem",
    fontWeight: 700,
    borderRadius: "8px",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    boxShadow: "0 4px 15px rgba(168, 30, 210, 0.3)",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    position: "relative",
    overflow: "hidden",

    "&:hover": {
      backgroundColor: theme.colors.blue[7],
      transform: "scale(1.08) rotate(-1deg)",
      boxShadow: "0 6px 20px rgba(168, 30, 210, 0.3)",
    },

    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "300%",
      height: "100%",
      background:
        "linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent)",
      transition: "left 0.6s ease-in-out",
    },

    "&:hover::before": {
      left: "100%",
    },

    "&:active": {
      transform: "scale(0.98)",
      boxShadow: "0 2px 10px rgba(168, 30, 210, 0.3)",
    },
  },

  numberInput: {
    input: {
      textAlign: "center",
      fontSize: theme.fontSizes.sm,
      fontFamily: "system-ui",
      fontWeight: 500,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.sm,
      fontWeight: 400,
      border: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[4]
      }`,
      transition: "border-color 0.3s ease-in-out, box-shadow 0.2s",
      "&:focus": {
        borderColor: theme.colors.blue[6],
        boxShadow: `0 0 4px ${theme.colors.blue[5]}`,
      },
      "&:hover": {
        borderColor: theme.colors.blue[7],
        transform: "scale(1.01)",
      },
    },
    label: {
      fontSize: theme.fontSizes.xs,
      fontWeight: 600,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.gray[4]
          : theme.colors.gray[7],
      marginBottom: theme.spacing.xs,
    },
  },
  timeInput: {
    width: 110,
    input: {
      textAlign: "center",
      fontWeight: 500,
      borderRadius: theme.radius.sm,
      border: `1px solid ${theme.colors.gray[4]}`,
      padding: theme.spacing.xs,
      transition: "background 0.3s, transform 0.2s",
    },
    "&:hover": {
      borderColor: theme.colors.blue[7],
      transform: "scale(1.01)",
    },
  },
  slider: {
    marginTop: theme.spacing.md,
    "& .mantine-Slider-track": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[3],
      height: 8,
      borderRadius: 5,
    },
    "& .mantine-Slider-bar": {
      backgroundColor: theme.colors.blue[6],
      height: 8,
      borderRadius: 5,
    },
    "& .mantine-Slider-thumb": {
      backgroundColor: theme.colors.blue[6],
      borderColor: theme.white,
      width: 18,
      height: 18,
      boxShadow: theme.shadows.sm,
    },
    "& .mantine-Slider-mark": {
      width: 6,
      height: 6,
      borderRadius: "50%",
      transform: "translateX(-3px) translateY(-2px)",
      borderColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[4],
    },
    "& .mantine-Slider-markLabel": {
      fontSize: theme.fontSizes.xs,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.gray[4]
          : theme.colors.gray[7],
      top: 20,
    },
  },
  errorText: {
    color: theme.colors.red[6],
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs,
    fontWeight: 500,
  },
}));

const LeftMenu = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const { selectedItem, isPlaying, currentTime, duration } = useSelector(
    (state) => state.editor
  );
  const mediaItems = useSelector((state) => state.editor.mediaItems);

  const getVideoDuration = useCallback((file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        resolve(video.duration);
        URL.revokeObjectURL(video.src);
      };
      video.onerror = () => {
        resolve(10); // Fallback duration
      };
    });
  }, []);

  const handleFileUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("video") ? "video" : "image";
      let mediaDuration = 10;

      if (type === "video") {
        mediaDuration = await getVideoDuration(file);
      }

      dispatch(
        addMediaItem({
          type,
          src: url,
          name: file.name,
          duration: mediaDuration,
          endTime: mediaDuration,
        })
      );

      // Update global duration if needed
      const newDuration = Math.max(
        ...mediaItems.map((item) => item.endTime),
        mediaDuration
      );
      if (newDuration > duration) {
        dispatch(setDuration(newDuration));
      }
    },
    [dispatch, getVideoDuration, mediaItems, duration]
  );

  const handlePropertyChange = useCallback(
    (prop, value) => {
      if (selectedItem) {
        dispatch(
          updateMediaItem({
            id: selectedItem.id,
            [prop]: value,
          })
        );

        // Update global duration if endTime was changed
        if (prop === "endTime") {
          const newDuration = Math.max(
            ...mediaItems.map((item) => item.endTime)
          );
          if (newDuration !== duration) {
            dispatch(setDuration(newDuration));
          }
        }
      }
    },
    [dispatch, selectedItem, mediaItems, duration]
  );

  const handleSeek = useCallback(
    (value) => {
      dispatch(seekTime(value));
    },
    [dispatch]
  );

  return (
    <AppShell.Navbar p="md" className={classes.navbar}>
      <AppShell.Section className={classes.section}>
        <Title order={4} className={classes.sectionTitle}>
          Media
        </Title>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id="media-upload"
        />
        <Button
          component="label"
          htmlFor="media-upload"
          fullWidth
          mt="sm"
          className={classes.uploadButton}
          variant="outline"
        >
          Upload Media
        </Button>
      </AppShell.Section>

      {selectedItem && (
        <AppShell.Section className={classes.section}>
          <Title order={4} className={classes.sectionTitle}>
            Properties
          </Title>
          <NumberInput
            label="Width"
            value={selectedItem.width}
            onChange={(value) => handlePropertyChange("width", value)}
            min={50}
            mt="sm"
            className={classes.numberInput}
          />
          <NumberInput
            label="Height"
            value={selectedItem.height}
            onChange={(value) => handlePropertyChange("height", value)}
            min={50}
            mt="sm"
            className={classes.numberInput}
          />
          <NumberInput
            label="Start Time (s)"
            value={selectedItem.startTime}
            onChange={(value) =>
              handlePropertyChange(
                "startTime",
                Math.min(value, selectedItem.endTime - 0.1)
              )
            }
            min={0}
            max={selectedItem.endTime - 0.1}
            precision={2}
            step={0.1}
            mt="sm"
            className={classes.numberInput}
          />
          <NumberInput
            label="End Time (s)"
            value={selectedItem.endTime}
            className={classes.numberInput}
            onChange={(value) =>
              handlePropertyChange(
                "endTime",
                Math.max(value, selectedItem.startTime + 0.1)
              )
            }
            min={selectedItem.startTime + 0.1}
            max={duration}
            precision={2}
            step={0.1}
            mt="sm"
          />
        </AppShell.Section>
      )}

      <AppShell.Section className={classes.section}>
        <Group>
          <Button
            onClick={() => dispatch(togglePlay())}
            className={classes.playButton}
          >
            {isPlaying ? "Pause" : " Play"}
          </Button>
          <TextInput
            value={currentTime.toFixed(2)}
            readOnly
            label="Current Time (s)"
            className={classes.timeInput}
            styles={{
              input: {
                backgroundColor: "transparent",
                borderColor: "#444",
                textAlign: "center",
              },
            }}
          />
        </Group>
        <Slider
          value={currentTime}
          onChange={handleSeek}
          min={0}
          max={duration}
          step={0.01}
          className={classes.slider}
          label={(value) => `${value.toFixed(2)}s`}
          marks={[
            { value: 0, label: "0s" },
            { value: duration / 2, label: `${(duration / 2).toFixed(1)}s` },
            { value: duration, label: `${duration.toFixed(1)}s` },
          ]}
        />
      </AppShell.Section>
    </AppShell.Navbar>
  );
};

export default React.memo(LeftMenu);
