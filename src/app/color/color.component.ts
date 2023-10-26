import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { interval, take } from 'rxjs';
import { ColorService } from '../core/services/color.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css'],
  animations: [
    trigger('scale', [
      transition('void => *', [
        style({ scale: 0 }),
        animate(200, style({ scale: 1 })),
      ]),
    ]),
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ColorComponent implements OnInit {
  copyMessage = 'copied to clipboard';
  currentColor = '#000000';
  lightColorCode = '#FFFFFF';
  darkColorCode = '#000000';
  isLightColor = false;
  dialogColor = '#000000';
  isShowFunc = false;
  isDarkMode = false;
  start = 1;
  end = 1000;
  randomNumber = 0;
  colorsDisplay: string[] = [];
  colors: string[] = [];
  delayLoop = interval(0);

  @ViewChild('dialogTemplate', { read: TemplateRef })
  dialogTemplate!: TemplateRef<any>;
  @ViewChild('dialogDownloadImageTemplate', { read: TemplateRef })
  dialogDownloadImageTemplate!: TemplateRef<any>;

  constructor(
    private colorService: ColorService,
    private matDialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const isDarkMode = !!Number(localStorage.getItem('darkMode'));
    if (isDarkMode) {
      this.darkMode(isDarkMode);
    }
    this.restart();
  }

  openDialog(color: string): void {
    this.currentColor = color;
    this.isLightColor = this.colorService.isLightColor(color);
    this.dialogColor = color;
    const dialogRef = this.matDialog.open(this.dialogTemplate, {
      width: '350px',
      height: '350px',
    });
  }

  openDialogDownloadImage(): void {
    const dialogRef = this.matDialog.open(this.dialogDownloadImageTemplate, {
      width: '350px',
      height: '350px',
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(`${message} ${this.copyMessage}`, '', {
      duration: 3000,
      horizontalPosition: 'end',
      panelClass: this.isDarkMode ? ['message-dark-mode'] : ['message'],
    });
  }

  mainFunc() {
    this.isShowFunc = false;
    this.colorsDisplay = [];
    const takeOneByOne = this.delayLoop.pipe(take(this.colors.length));
    takeOneByOne.subscribe((index) => {
      this.colorsDisplay.push(this.colors[index]);

      if (index === this.colors.length - 1) {
        this.isShowFunc = true;
      }
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 100);
    });
  }

  sort() {
    this.colors = this.colorService.sortColorsByHue(this.colors);
    this.mainFunc();
  }

  restart() {
    this.randomNumber = this.colorService.randomInRange(this.start, this.end);
    this.colors = this.colorService.generateRandomColorList(this.randomNumber);
    this.mainFunc();
  }

  darkMode(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', +this.isDarkMode + '');
  }

  downloadImage(res: number, color: string) {
    let Reg_Exp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
    if (!Reg_Exp.test(color)) {
      color = "#FFFFFF";
    }
    const resolutions = [
      { name: '1080', width: 1920, height: 1080 },
      { name: '2K', width: 2048, height: 1080 },
      { name: '4K', width: 4096, height: 2160 },
    ];
    let canvas = document.createElement('canvas');
    canvas.width = resolutions[res].width;
    canvas.height = resolutions[res].height;
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, resolutions[res].width, resolutions[res].height);
    let dataURL = canvas.toDataURL();

    var link = document.createElement('a');
    link.href = dataURL;
    link.download = `${color}.png`; // Set default file name
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
