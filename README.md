# Ng-Magnizoom

**DEMO:** [Stackblitz](https://stackblitz.com/edit/ng-magnizoom-demo)

## Getting Started

### Step 1: Installing via NPM

```
npm install ng-magnizoom
```

### Step 2: Importing the module

```ts
import { NgMagnizoomModule } from 'ng-magnizoom';

@NgModule({
  ...
  imports: [
    ... ,
    NgMagnizoomModule
  ],
  ...
})
export class AppModule {}
```

## Usage

Use the `ng-magnizoom` component with the `imageSrc` input to render the image with zoom options.
```html
...
  <ng-magnizoom
    zoomMode="LENS"
    imageSrc="/path/to">
  </ng-magnizoom>
...
```

## Options

Name | Type | Default | Two-way binding | Description
--- | --- | --- | --- | ---
imageSrc | string | (required) | - | Image source (url)
zoomMode | 'LENS', 'COVER' | 'COVER' | - | Mode
minZoomFactor | number | 1.2 | - | Minimum zooming factor
maxZoomFactor | number | 3 | - | Maximum zooming factor
imageStyle | { [x: string]: any; } | - | - | ngSytle for image canvas element
imageClass | any | - |  | ngClass for image canvas element
zoomFactor | number | 2 | x | current zoom level (between minZoomFactor and maxZoomFactor)
lensSizeUnit | 'NORMALIZED', 'PIXEL' | 'NORMALIZED' | - | 'NORMALIZED' - between 0 and 1, 'PIXEL' - pixel value
lensSize | { width: number, height: number } | { width: 0.5, height: 0.5 } | - | The size of the lens in `lensSizeUnit`
zoomCenterUnit | 'NORMALIZED', 'PIXEL' | 'NORMALIZED' | - | 'NORMALIZED' - between 0 and 1, 'PIXEL' - pixel value
zoomCenter | { x: number, y: number } or undefined | undefined | x | The center of the zoom, `undefined` if not in zoom mode
updateOnMouseEvents | boolean | true | - | Whether or not the magnifier uses the mouse events
