import React from 'react';
import { ComponentPreview, Previews } from '@react-buddy/ide-toolbox-next';
import Home from '@/app/page';
import RootLayout from '@/app/layout';
import { PaletteTree } from './palette';

function ComponentPreviews() {
  return (
    <Previews palette={<PaletteTree />}>
      <ComponentPreview path="/Home">
        <Home />
      </ComponentPreview>
      <ComponentPreview path="/RootLayout">
        <RootLayout />
      </ComponentPreview>
    </Previews>
  );
}

export default ComponentPreviews;
