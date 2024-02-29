import type { ElementRef } from '@angular/core';
import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, ViewChild, EventEmitter } from '@angular/core';

interface Size2D { width: number; height: number; }
type Point2D = { x: number, y: number } | null;

@Component({
  selector: 'ng-magnizoom',
  templateUrl: './magnizoom.component.html',
  styleUrls: ['./magnizoom.component.scss']
})
export class NgMagnizoomComponent implements OnInit, OnChanges {

  @Input() imageSrc: string;
  @Input() zoomMode: 'LENS' | 'COVER' = 'COVER';
  @Input() minZoomFactor = 1.2;
  @Input() maxZoomFactor = 3;

  @Input() zoomFactor = 2;
  @Output() zoomFactorChange = new EventEmitter<number>();

  @Input() lensSizeUnit: 'NORMALIZED' | 'PIXEL' = 'NORMALIZED';
  @Input() lensSize: Size2D = { width: 0.5, height: 0.5 };

  @Input() zoomCenterUnit: 'NORMALIZED' | 'PIXEL' = 'NORMALIZED';
  @Input() zoomCenter?: Point2D;
  @Output() zoomCenterChange = new EventEmitter<Point2D | undefined>();


  @Input() updateOnMouseEvents = true;

  @Input() lensBorderSize: number = 1;
  @Input() lensBorderHexColor: string = "#ebebeb";
  @Input() imageStyle: { [x: string]: any; };
  @Input() imageClass: any;

  @ViewChild('mainCanvas', { static: true }) mainCanvasRef: ElementRef;

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  image: HTMLImageElement;

  _centerPosition: Point2D;
  _lensSize?: Size2D;
  _zoomFactor: number;

  imageReady = false;
  get canvasWidth() { return this.image && this.image.width || 800; }
  get canvasHeight() { return this.image && this.image.height || 600; }

  constructor() { }

  ngOnInit() {
    this.initContext();
    this.loadImage(this.imageSrc);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes) {
      return;
    }
    if (changes.lensSize || changes.zoomCenter || changes.zoomFactor) {
      this.updateParameters();
    }
    if (changes.imageSrc && !changes.imageSrc.firstChange) {
      this.loadImage(changes.imageSrc.currentValue);
    }
  }

  initContext() {
    this.canvas = (this.mainCanvasRef.nativeElement as HTMLCanvasElement);
    this.context = this.canvas.getContext('2d');
  }

  loadImage(src: string) {
    this.image = new Image();
    this.image.onload = () => {
      this.imageReady = true;
      this.updateParameters();
      setTimeout(() => this.update());
    };
    this.image.src = src;
  }

  updateParameters() {
    if (this.lensSizeUnit === 'NORMALIZED') {
      if (this.imageReady) {
        this._lensSize = {
          width: this.lensSize.width * this.image.width,
          height: this.lensSize.height * this.image.height
        };
      }
    } else {
      this._lensSize = {
        width: this.lensSize.width,
        height: this.lensSize.height
      };
    }

    if (!this.zoomCenter) {
      this._centerPosition = undefined;
    } else if (this.zoomCenterUnit === 'NORMALIZED'){
      if (this.imageReady) {
        this._centerPosition = {
          x: this.zoomCenter.x * this.image.width,
          y: this.zoomCenter.y * this.image.height
        };
      }
    } else {
      this._centerPosition = {
        x: this.zoomCenter.x,
        y: this.zoomCenter.y
      };
    }

    this._zoomFactor = this.zoomFactor;
    if (this._zoomFactor > this.maxZoomFactor) {
      this._zoomFactor = this.maxZoomFactor;
    }
    if (this._zoomFactor < this.minZoomFactor) {
      this._zoomFactor = this.minZoomFactor;
    }

    this.update();
  }

  update() {
    this.render();
    let currUnitCenter: { x: number, y: number } | undefined, needUpdate = false;
    if (!this._centerPosition) {
      currUnitCenter = undefined;
      needUpdate = currUnitCenter !== this.zoomCenter;
    } else if (this.zoomCenterUnit === 'NORMALIZED') {
      if (this.imageReady) {
        currUnitCenter = {
          x: this._centerPosition.x / this.image.width,
          y: this._centerPosition.y / this.image.height
        };
        needUpdate = currUnitCenter.x !== this.zoomCenter?.x || currUnitCenter.y !== this.zoomCenter?.y;
      }
    } else {
      currUnitCenter = {
        x: this._centerPosition.x,
        y: this._centerPosition.y
      };
      needUpdate = currUnitCenter.x !== this.zoomCenter?.x || currUnitCenter.y !== this.zoomCenter?.y;
    }
    if (needUpdate) {
      this.zoomCenterChange.emit(currUnitCenter);
    }
  }

  render() {
    if (!this.context || !this.imageReady) {
      return;
    }

    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // clear canvas
    this.context.lineWidth = 1; // border width
    this.context.drawImage(this.image, 0, 0); // bg image

    if (this._centerPosition) {
      switch (this.zoomMode) {
        case 'LENS': this.renderLensMode(); break;
        case 'COVER': this.renderCoverMode(); break;
      }
    }
  }

  renderLensMode() {
    this.context.lineWidth = this.lensBorderSize; // border width
    const zoomRect = this.getZoomRect();
    this.context.fillRect(zoomRect.x, zoomRect.y, zoomRect.w, zoomRect.h); // bg (clear)
    const clippingRect = this.getClippingRect();
    // zoom image
    this.context.drawImage(
      this.image,
      clippingRect.x, clippingRect.y, clippingRect.w, clippingRect.h,
      zoomRect.x, zoomRect.y, zoomRect.w, zoomRect.h
    );
    this.context.strokeStyle =  this.lensBorderHexColor// border
    this.context.strokeRect(zoomRect.x, zoomRect.y, zoomRect.w, zoomRect.h);
  }

  renderCoverMode() {
    const covertRect = this.getCoverRect();
    this.context.drawImage(
      this.image,
      covertRect.x, covertRect.y, covertRect.w, covertRect.h,
      0, 0, this.canvasWidth, this.canvasHeight
    ); // cover image
  }

  getZoomRect() {
    const w = this._lensSize.width;
    const h = this._lensSize.height;
    const x = this._centerPosition.x - (w / 2);
    const y = this._centerPosition.y - (h / 2);
    return this.clampRect(x, y, w, h);
  }

  getClippingRect() {
    const w = this._lensSize.width / this._zoomFactor;
    const h = this._lensSize.height / this._zoomFactor;
    const x = this._centerPosition.x - (w / 2);
    const y = this._centerPosition.y - (h / 2);
    return this.clampRect(x, y, w, h);
  }

  getCoverRect() {
    const w = this.canvasWidth / this._zoomFactor;
    const h = this.canvasHeight / this._zoomFactor;
    // const x = this.mousePosition.x - (w / 2);
    // const y = this.mousePosition.y - (h / 2);
    const x = this._centerPosition.x - this._centerPosition.x / this._zoomFactor;
    const y = this._centerPosition.y - this._centerPosition.y / this._zoomFactor;
    return this.clampRect(x, y, w, h);
  }

  clampRect(x: number, y: number, w: number, h: number) {
    if (x <= 0) { x = 0; }
    if (x + w >= this.canvasWidth) { x = this.canvasWidth - w; }
    if (y < 0) { y = 0; }
    if (y + h >= this.canvasHeight) { y = this.canvasHeight - h; }
    return { x, y, w, h };
  }

  calculateMousePosition(clientX: number, clientY: number) {
    const boundingRect = this.canvas.getBoundingClientRect();

    const boundingRectX = (clientX - boundingRect.left);
    const boundingRectY = (clientY - boundingRect.top);

    let elementX = boundingRectX, elementY = boundingRectY;
    let elementWidth = boundingRect.width, elementHeight = boundingRect.height;

    const computedStyle = window.getComputedStyle(this.canvas, null);
    const domMatrix = new DOMMatrix(computedStyle.transform);
    if (!domMatrix.isIdentity) {
      const { a, b } = domMatrix;
      const transformRot = Math.atan2(b, a);
      const transformScale = Math.round( Math.sqrt(a * a + b * b) * 100 ) / 100;
      if (transformRot) {
        const boundingRectCenterX = boundingRect.width / 2;
        const boundingRectCenterY = boundingRect.height / 2;
        const dx = (boundingRectX - boundingRectCenterX);
        const dy = (boundingRectY - boundingRectCenterY);
        const d = Math.sqrt(dx * dx + dy * dy);
        const r = Math.atan2(dy, dx);
        elementWidth = this.canvas.clientWidth * transformScale;
        elementHeight = this.canvas.clientHeight * transformScale;
        elementX = (elementWidth / 2) + (d * Math.cos(r - transformRot));
        elementY = (elementHeight / 2) + (d * Math.sin(r - transformRot));
      }
    }

    const viewToModelX = this.canvasWidth / elementWidth;
    const viewToModelY = this.canvasHeight / elementHeight;
    const x = elementX * viewToModelX;
    const y = elementY * viewToModelY;
    this._centerPosition = { x, y };
  }

  onMouseLeave(event: MouseEvent) {
    if (!this.updateOnMouseEvents) { return; }
    this._centerPosition = null;
    this.update();
  }

  onMouseEnterOrMove(event: MouseEvent) {
    if (!this.updateOnMouseEvents) { return; }
    this.calculateMousePosition(event.clientX, event.clientY);
    this.update();
  }

  onMouseScroll(event: WheelEvent) {
    if (!this.updateOnMouseEvents) { return; }
    let newZoomFactor = this._zoomFactor;
    newZoomFactor -= event.deltaY / 1000;
    if (newZoomFactor < this.minZoomFactor) { newZoomFactor = this.minZoomFactor; }
    if (newZoomFactor > this.maxZoomFactor) { newZoomFactor = this.maxZoomFactor; }
    if (this._zoomFactor !== newZoomFactor) {
      this._zoomFactor = newZoomFactor;
      if (this.zoomFactor !== this._zoomFactor) {
        this.zoomFactorChange.emit(this._zoomFactor);
      }
      this.update();
    }
    event.preventDefault();
    event.stopPropagation();
  }


}
