import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

interface Size2D { width: number; height: number; }
type Point2D = { x: number, y: number } | null;

@Component({
  selector: 'ng-magnizoom',
  templateUrl: './magnizoom.component.html',
  styleUrls: ['./magnizoom.component.scss']
})
export class MagnizoomComponent implements OnInit {

  @Input() imageSrc: string;
  @Input() zoomMode: 'LENS' | 'COVER' = 'COVER';
  @Input() minZoomFactor = 1.2;
  @Input() maxZoomFactor = 3;

  @Input() imageStyle: { [x: string]: any; };
  @Input() imageClass: any;

  @ViewChild('mainCanvas', { static: true }) mainCanvasRef: ElementRef;

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  image: HTMLImageElement;

  mousePosition: Point2D = null;
  lensSize: Size2D = { width: 400, height: 300 };
  zoomFactor = 2;

  get canvasWidth() { return this.image && this.image.width || 800; }
  get canvasHeight() { return this.image && this.image.height || 600; }

  constructor() { }

  ngOnInit() {
    this.initContext();
    this.loadImage(this.imageSrc);
  }

  initContext() {
    this.canvas = (this.mainCanvasRef.nativeElement as HTMLCanvasElement);
    this.context = this.canvas.getContext('2d');
  }

  loadImage(src: string) {
    this.image = new Image();
    this.image.onload = () => {
      this.lensSize = { width: this.image.width / 2, height: this.image.height / 2 };
      this.render();
    };
    this.image.src = src;
  }

  render() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // clear canvas
    this.context.lineWidth = 1; // border width
    this.context.drawImage(this.image, 0, 0); // bg image

    if (this.mousePosition) {
      switch (this.zoomMode) {
        case 'LENS': this.renderLensMode(); break;
        case 'COVER': this.renderCoverMode(); break;
      }
    }
  }

  renderLensMode() {
    this.context.lineWidth = 5; // border width
    const zoomRect = this.getZoomRect();
    this.context.fillRect(zoomRect.x, zoomRect.y, zoomRect.w, zoomRect.h); // bg (clear)
    const clippingRect = this.getClippingRect();
    // zoom image
    this.context.drawImage(
      this.image,
      clippingRect.x, clippingRect.y, clippingRect.w, clippingRect.h,
      zoomRect.x, zoomRect.y, zoomRect.w, zoomRect.h
    );
    this.context.strokeRect(zoomRect.x, zoomRect.y, zoomRect.w, zoomRect.h); // border
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
    const w = this.lensSize.width;
    const h = this.lensSize.height;
    const x = this.mousePosition.x - (w / 2);
    const y = this.mousePosition.y - (h / 2);
    return this.clampRect(x, y, w, h);
  }

  getClippingRect() {
    const w = this.lensSize.width / this.zoomFactor;
    const h = this.lensSize.height / this.zoomFactor;
    const x = this.mousePosition.x - (w / 2);
    const y = this.mousePosition.y - (h / 2);
    return this.clampRect(x, y, w, h);
  }

  getCoverRect() {
    const w = this.canvasWidth / this.zoomFactor;
    const h = this.canvasHeight / this.zoomFactor;
    // const x = this.mousePosition.x - (w / 2);
    // const y = this.mousePosition.y - (h / 2);
    const x = this.mousePosition.x - this.mousePosition.x / this.zoomFactor;
    const y = this.mousePosition.y - this.mousePosition.y / this.zoomFactor;
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
    const viewToModelX = this.canvasWidth / boundingRect.width;
    const viewToModelY = this.canvasHeight / boundingRect.height;
    const x = (clientX - boundingRect.left) * viewToModelX;
    const y = (clientY - boundingRect.top) * viewToModelY;
    this.mousePosition = { x, y };
  }

  onMouseLeave(event: MouseEvent) {
    this.mousePosition = null;
    this.render();
  }

  onMouseEnterOrMove(event: MouseEvent) {
    this.calculateMousePosition(event.clientX, event.clientY);
    this.render();
  }

  onMouseScroll(event: WheelEvent) {
    let newZoomFactor = this.zoomFactor;
    newZoomFactor -= event.deltaY / 1000;
    if (newZoomFactor < this.minZoomFactor) { newZoomFactor = this.minZoomFactor; }
    if (newZoomFactor > this.maxZoomFactor) { newZoomFactor = this.maxZoomFactor; }
    if (this.zoomFactor !== newZoomFactor) {
      this.zoomFactor = newZoomFactor;
      this.render();
    }
    event.preventDefault();
    event.stopPropagation();
  }


}
