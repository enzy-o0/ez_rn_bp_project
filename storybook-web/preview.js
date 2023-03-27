import React from 'react';
import {ThemeProvider} from 'styled-components';
import theme from '../src/styles/theme';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';
dayjs.locale('ko');

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
];

export const parameters = {
  viewport: {
    // viewports: newViewports, // newViewports would be an ViewportMap. (see below for examples)
    defaultViewport: 'responsive',
  },
};
