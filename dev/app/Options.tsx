import type { ChangeEvent, FC } from "react";
import { NumberSlider } from "@components/inputs/number-slider";
import { Select } from "@components/inputs/select";
import styled from "@emotion/styled";
import { useContext } from "@state/Context";
import { WRITABLE_OSCILLATOR_TYPES } from "@react-synthwave/index";

const Root = styled.div``;
const List = styled.ul``;
const Item = styled.li``;

export const Options: FC = () => {
  const { options, multi, dispatch } = useContext();
  const handleChange = ({
    currentTarget: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const [key, key1] = name.split(".");
    const resolveValue = () => {
      switch (key1) {
        case "type": {
          return value;
        }
        default: {
          return +value;
        }
      }
    };
    dispatch({
      type: `update-${key as "multi" | "options"}`,
      value: { [key1]: resolveValue() },
    });
  };
  return (
    <Root>
      <List>
        <Item className="p-1 border-white-600 border-2 rounded-md">
          <List>
            <Item>
              <Select
                name="options.type"
                title="type"
                value={options.type}
                options={WRITABLE_OSCILLATOR_TYPES}
                onChange={handleChange}
              />
            </Item>
            <Item className="py-1" />
            <Item>
              <NumberSlider
                name="options.midi"
                title="midi"
                min="0"
                max="100"
                step="1"
                value={options.midi}
                onChange={handleChange}
              />
            </Item>
            <Item className="py-1" />
            <Item>
              <NumberSlider
                name="options.detune"
                title="detune"
                value={options.detune}
                min="-2400"
                max="2400"
                step="10"
                onChange={handleChange}
              />
            </Item>
            <Item className="py-1" />
            <Item>
              <NumberSlider
                name="options.gain"
                title="gain"
                value={options.gain}
                min="0"
                max="2"
                step="0.1"
                onChange={handleChange}
              />
            </Item>
            <Item className="py-1" />
            <Item>
              <NumberSlider
                name="options.attack"
                title="attack"
                value={options.attack}
                min="0"
                max="10"
                step="0.1"
                onChange={handleChange}
              />
            </Item>
            <Item className="py-1" />
            <Item>
              <NumberSlider
                name="options.decay"
                title="decay"
                value={options.decay}
                min="0"
                max="10"
                step="0.1"
                onChange={handleChange}
              />
            </Item>
            <Item className="py-1" />
            <Item>
              <NumberSlider
                name="options.delay"
                title="delay"
                value={options.delay}
                min="0"
                max="6"
                step="0.1"
                onChange={handleChange}
              />
            </Item>
          </List>
        </Item>
        <Item className="py-1" />
        <Item className="p-1 border-white-600 border-2 rounded-md">
          <List>
            <Item>
              <NumberSlider
                name="multi.spread"
                title="spread"
                value={multi.spread}
                min="0"
                max="400"
                step="1"
                onChange={handleChange}
              />
            </Item>
            <Item className="py-1" />
            <Item>
              <NumberSlider
                name="multi.count"
                title="count"
                value={multi.count}
                min="1"
                max="400"
                step="1"
                onChange={handleChange}
              />
            </Item>
            <Item className="py-1" />
            <Item>
              <NumberSlider
                name="multi.stagger"
                title="stagger"
                value={multi.stagger}
                min="0"
                max="5"
                step="0.01"
                onChange={handleChange}
              />
            </Item>
          </List>
        </Item>
      </List>
    </Root>
  );
};
