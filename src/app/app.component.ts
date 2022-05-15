import { Component, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  file: UploadFile | null;
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver!: boolean;
  options: UploaderOptions;
  ctx!: CanvasRenderingContext2D;
  imgReader!: FileReader;
  logo = new Image();
  footer = new Image();
  @ViewChild('canvas') public canvas!: ElementRef;

  constructor() {
    this.options = { concurrency: 1, maxUploads: 1, maxFileSize: 1000000 };
    this.file = null;
    this.uploadInput = new EventEmitter<UploadInput>();
    this.imgReader = new FileReader();
    this.humanizeBytes = humanizeBytes;
    this.logo.src = "../assets/logo.svg";
    this.footer.src = "../assets/footer.svg";
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.file = output.file;
      this.imgReader.readAsDataURL(<File>this.file.nativeFile)
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
    } else if (output.type === 'cancelled' || output.type === 'removed') {
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    }
  }

  // draw() {
  //   const img = new Image();
  //   img.src = this.file?.nativeFile;
  //   this.ctx = this.canvas.nativeElement.getContext('2d');

  // }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.imgReader.onloadend = (event) => {
      const img = new Image();
      img.src = <string>event.target?.result
      img.onload = (e) => {
        this.ctx = <CanvasRenderingContext2D>this.canvas.nativeElement.getContext('2d');
        const height = img.naturalHeight
        const width = img.naturalWidth

        this.canvas.nativeElement.height = height
        this.canvas.nativeElement.width = width

        this.ctx.rect(0, 0, width, height);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
        this.ctx.drawImage(img, 10, 10, (width - 20), (height - 20));

        var grd = this.ctx.createLinearGradient(0, 0, width, height);
        grd.addColorStop(0, "transparent");
        grd.addColorStop(1, "black");

        // Fill with gradient
        this.ctx.fillStyle = grd;
        this.ctx.fillRect(0, 0, width, height);

        this.ctx.drawImage(this.logo, 15, (height - ((width / 10) + 15)), (width / 10), (width / 10));
        const coedWidth = width / 3
        const coeHeight = this.footer.naturalWidth / this.footer.naturalHeight
        const coedHeight = coedWidth / coeHeight

        this.ctx.drawImage(this.footer, (width - (coedWidth + 15)), (height - (coedHeight + 15)), coedWidth, coedHeight);

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(15 + (width / 10) + 15, ((height - (coedHeight + 15)) + (coedHeight / 2.4)), (width - (width / 10) + 30), (coedHeight / 50));

      }
    }
  }
}
