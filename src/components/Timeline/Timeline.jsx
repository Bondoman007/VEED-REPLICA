import React, { useRef, useEffect } from "react";
import { Slider, ActionIcon, Text } from "@mantine/core";
import { createStyles } from "@mantine/styles";
import { useSelector, useDispatch } from "react-redux";
import { seekTime, togglePlay } from "../../features/editorSlice";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
} from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  timelineContainer: {
    padding: theme.spacing.md,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    boxShadow: theme.shadows.sm,
  },

  controls: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  timeDisplay: {
    fontFamily: theme.fontFamilyMonospace,
    fontSize: theme.fontSizes.sm,
    minWidth: 60,
    textAlign: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[3]
        : theme.colors.gray[7],
  },

  slider: {
    flex: 1,
    "&:hover": {
      "& .mantine-Slider-bar": {
        backgroundColor: theme.colors.blue[5],
      },
      "& .mantine-Slider-thumb": {
        opacity: 1,
        transform: "scale(1)",
      },
    },
  },

  sliderBar: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[3],
    transition: "background-color 150ms ease",
  },

  sliderThumb: {
    backgroundColor: theme.colors.blue[6],
    border: "none",
    opacity: 0,
    transform: "scale(0.8)",
    transition: "opacity 150ms ease, transform 150ms ease",
    width: 16,
    height: 16,
    boxShadow: theme.shadows.sm,
  },

  playButton: {
    backgroundColor: theme.colors.gray[4],
    color: theme.white,
    "&:hover": {
      backgroundColor: theme.colors.blue[7],
    },
    transition: "background-color 150ms ease",
  },

  jumpButton: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[5]
        : theme.colors.gray[6],
    "&:hover": {
      color: theme.colors.blue[6],
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[1],
    },
  },
}));

const formatTime = (seconds) => {
  const date = new Date(seconds * 1000);
  return date.toISOString().substr(11, 8).replace(/^00:/, "");
};

const Timeline = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const { currentTime, duration, isPlaying } = useSelector(
    (state) => state.editor
  );
  const timelineRef = useRef(null);

  const handleSeek = (value) => {
    dispatch(seekTime(value));
  };

  const handleJump = (seconds) => {
    const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
    dispatch(seekTime(newTime));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        dispatch(togglePlay());
      } else if (e.code === "ArrowLeft") {
        handleJump(-0.5);
      } else if (e.code === "ArrowRight") {
        handleJump(0.5);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTime, duration]);

  return (
    <div className={classes.timelineContainer}>
      <div className={classes.controls}>
        <ActionIcon
          className={classes.playButton}
          size="lg"
          radius="xl"
          onClick={() => dispatch(togglePlay())}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <IconPlayerPause size={18} />
          ) : (
            <IconPlayerPlay size={18} />
          )}
        </ActionIcon>

        <ActionIcon
          className={classes.jumpButton}
          size="md"
          radius="xl"
          onClick={() => handleJump(-5)}
          aria-label="Jump back 5 seconds"
        >
          <IconPlayerTrackPrev size={16} />
        </ActionIcon>

        <ActionIcon
          className={classes.jumpButton}
          size="md"
          radius="xl"
          onClick={() => handleJump(5)}
          aria-label="Jump forward 5 seconds"
        >
          <IconPlayerTrackNext size={16} />
        </ActionIcon>

        <Text className={classes.timeDisplay}>{formatTime(currentTime)}</Text>

        <Slider
          ref={timelineRef}
          classNames={{
            root: classes.slider,
            bar: classes.sliderBar,
            thumb: classes.sliderThumb,
          }}
          value={currentTime}
          onChange={handleSeek}
          min={0}
          max={duration}
          step={0.01}
          label={(value) => formatTime(value)}
          aria-label="Timeline slider"
        />

        <Text className={classes.timeDisplay}>{formatTime(duration)}</Text>
      </div>
    </div>
  );
};

export default Timeline;
