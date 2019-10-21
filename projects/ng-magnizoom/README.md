# Ng-Magnizoom

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

Name | Type | Default | Description
--- | --- | --- | ---
imageSrc | string | (required) | Image source (url)
zoomMode | 'LENS', 'COVER' | 'COVER' | Mode
minZoomFactor | number | 1.2 | Minimum zooming factor
maxZoomFactor | number | 3 | Maximum zooming factor
imageStyle | { [x: string]: any; } | - | ngSytle for image canvas element
imageClass | any | - | ngClass for image canvas element
