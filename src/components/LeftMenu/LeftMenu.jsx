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
import { useSelector, useDispatch } from "react-redux";
import {
  updateMediaItem,
  togglePlay,
  addMediaItem,
  selectItem,
  seekTime,
  setDuration,
} from "../../features/editorSlice";

const LeftMenu = () => {
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
    <AppShell.Navbar p="md" style={{ overflow: "auto" }}>
      <AppShell.Section>
        <Title order={4}>Media</Title>
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
          variant="outline"
        >
          Upload Media
        </Button>
      </AppShell.Section>

      {selectedItem && (
        <AppShell.Section mt="md">
          <Title order={4}>Properties</Title>
          <NumberInput
            label="Width"
            value={selectedItem.width}
            onChange={(value) => handlePropertyChange("width", value)}
            min={50}
            mt="sm"
          />
          <NumberInput
            label="Height"
            value={selectedItem.height}
            onChange={(value) => handlePropertyChange("height", value)}
            min={50}
            mt="sm"
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
          />
          <NumberInput
            label="End Time (s)"
            value={selectedItem.endTime}
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

      <AppShell.Section mt="md">
        <Group>
          <Button
            onClick={() => dispatch(togglePlay())}
            variant={isPlaying ? "filled" : "outline"}
            style={{ minWidth: "80px" }}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </Button>
          <TextInput
            value={currentTime.toFixed(2)}
            readOnly
            label="Current Time (s)"
            style={{ width: "100px" }}
          />
        </Group>
        <Slider
          value={currentTime}
          onChange={handleSeek}
          min={0}
          max={duration}
          step={0.01}
          mt="sm"
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
