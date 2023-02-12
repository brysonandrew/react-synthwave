import type { ChangeEvent, FC } from "react";
import { NumberSlider } from "@components/inputs/number-slider";
import { Select } from "@components/inputs/select";
import styled from "@emotion/styled";
import { useContext } from "@state/Context";
import { WRITABLE_OSCILLATOR_TYPES } from "react-synthwave";

const Root = styled.div``;
const List = styled.ul``;
const Item = styled.li``;

export const Options: FC = () => {
  const { options, dispatch } = useContext();
  const handleChange = ({
    currentTarget: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const resolveValue = () => {
      switch (name) {
        case "type": {
          return value;
        }
        default: {
          return +value;
        }
      }
    };
    dispatch({
      type: "update-options",
      value: { [name]: resolveValue() },
    });
  };
  return (
    <Root>
      <List>
        <Item>
          <Select
            name="type"
            title="type"
            value={options.type}
            options={WRITABLE_OSCILLATOR_TYPES}
            onChange={handleChange}
          />
        </Item>
        <Item className="py-1" />
        <Item>
          <NumberSlider
            name="midi"
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
            name="detune"
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
            name="gain"
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
            name="attack"
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
            name="decay"
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
            name="spread"
            title="spread"
            value={options.spread}
            min="0"
            max="400"
            step="1"
            onChange={handleChange}
          />
        </Item>
        <Item className="py-1" />
        <Item>
          <NumberSlider
            name="count"
            title="count"
            value={options.count}
            min="0"
            max="400"
            step="1"
            onChange={handleChange}
          />
        </Item>
      </List>
    </Root>
  );
};
