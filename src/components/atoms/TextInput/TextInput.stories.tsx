import React from 'react';
import {Meta, Story} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {within, userEvent} from '@storybook/testing-library';
import {expect} from '@storybook/jest';
import {TextInput} from '.';
import Icon from '@/assets/images/icon_setting_notice_arrow.svg';

import {ITextInputProps} from './types';

export default {
  component: TextInput,
  title: 'atoms/TextInput',
} as Meta;

const TemplateDefault = (args: ITextInputProps) => <TextInput {...args} />;

const Template = (args: ITextInputProps) => (
  <TextInput {...args}>
    <TextInput.TextInputIcon>
      <Icon width={24} height={24} />
    </TextInput.TextInputIcon>
  </TextInput>
);

export const Default: Story = TemplateDefault.bind({});
Default.args = {
  nativeProps: {
    maxLength: 10,
    keyboardType: 'number-pad',
    onChangeText: action('onChangeText'),
    value: 'test',
  },
};

Default.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  const input = canvas.getByTestId<HTMLInputElement>('input');

  await userEvent.type(input, '12312312231');

  //TODO value 타입잡기
  await expect(input.value).toBe('12312312231');
  await expect(input.value.length).toBe(10);
};

export const WithIcon: Story = Template.bind({});
WithIcon.args = {
  nativeProps: {
    maxLength: 10,
    keyboardType: 'number-pad',
    onChangeText: action('onChangeText'),
    value: 'test',
  },
};

export const TextArea: Story = TemplateDefault.bind({});
TextArea.args = {
  customProps: {
    isTextarea: true,
  },
  nativeProps: {
    value: '',
    onChangeText: action('onChangeText'),
    placeholder: '내용을 입력해주세요',
  },
};
