import React, { Fragment } from 'react';
import {
  Category,
  Component,
  Variant,
  Palette,
} from '@react-buddy/ide-toolbox-next';
import AntdPalette from '@react-buddy/palette-antd';

export function PaletteTree() {
  return (
    <Palette>
      <Category name="App">
        <Component name="Loader">
          <Variant>
            <ExampleLoaderComponent />
          </Variant>
        </Component>
      </Category>
      <AntdPalette />
    </Palette>
  );
}

export function ExampleLoaderComponent() {
  return <>Loading...</>;
}
