import React from "react";
import {
  AppShell,
  Title,
  TextInput,
  NumberInput,
  Button,
  Group,
} from "@mantine/core";
import { useSelector, useDispatch } from "react-redux";
import {
  updateMediaItem,
  togglePlay,
  addMediaItem,
  selectItem,
} from "../../features/editorSlice";

const LeftMenu = () => {
  const dispatch = useDispatch();
  const selectedItem = useSelector((state) => state.editor.selectedItem);
  const isPlaying = useSelector((state) => state.editor.isPlaying);
  const currentTime = useSelector((state) => state.editor.currentTime);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("video") ? "video" : "image";

    dispatch(
      addMediaItem({
        type,
        src: url,
        name: file.name,
      })
    );
  };

  const handlePropertyChange = (prop, value) => {
    if (selectedItem) {
      dispatch(
        updateMediaItem({
          id: selectedItem.id,
          [prop]: value,
        })
      );
    }
  };

  return (
    <AppShell.Navbar p="md">
      <AppShell.Section>
        <Title order={4}>Media</Title>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id="media-upload"
        />
        <Button component="label" htmlFor="media-upload" fullWidth mt="sm">
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
            mt="sm"
          />
          <NumberInput
            label="Height"
            value={selectedItem.height}
            onChange={(value) => handlePropertyChange("height", value)}
            mt="sm"
          />
          <NumberInput
            label="Start Time (s)"
            value={selectedItem.startTime}
            onChange={(value) => handlePropertyChange("startTime", value)}
            mt="sm"
          />
          <NumberInput
            label="End Time (s)"
            value={selectedItem.endTime}
            onChange={(value) => handlePropertyChange("endTime", value)}
            min={selectedItem.startTime + 1}
            mt="sm"
          />
        </AppShell.Section>
      )}

      <AppShell.Section mt="md">
        <Group>
          <Button
            onClick={() => dispatch(togglePlay())}
            variant={isPlaying ? "filled" : "outline"}
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <TextInput
            value={currentTime.toFixed(2)}
            readOnly
            label="Current Time (s)"
          />
        </Group>
      </AppShell.Section>
    </AppShell.Navbar>
  );
};

export default LeftMenu;
