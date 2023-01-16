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
        animate(200, style({ scale: 1 }))
      ])
    ]),
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ColorComponent implements OnInit {
  copyMessage = "copied to clipboard"
  currentColor = "#FFFFFF";
  lightColorCode = "#FFFFFF";
  darkColorCode = "#000000";
  isLightColor = false;
  dialogColor = "#000000";
  dialogFontColor = "#000000";
  isShowFunc = false;
  isDarkMode = false;
  start = 1;
  end = 1000;
  randomNumber = 0;
  colorsDisplay: string[] = [];
  colors: string[] = [];
  delayLoop = interval(0);

  @ViewChild("dialogTemplate", { read: TemplateRef }) dialogTemplate!: TemplateRef<any>;

  constructor(private colorService: ColorService,
    private matDialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    const isDarkMode = !!Number(localStorage.getItem("darkMode"));
    if (isDarkMode) {
      this.darkMode(isDarkMode);
    }
    this.restart();
  }

  openDialog(color: string): void {
    this.currentColor = color;
    this.isLightColor = this.colorService.isLightColor(color);
    this.dialogColor = color;
    this.dialogFontColor = this.isLightColor ? this.darkColorCode : this.lightColorCode;
    const dialogRef = this.matDialog.open(this.dialogTemplate, {
      width: '300px',
      height: '300px'
    })
  }

  openSnackBar(message: string) {
    this._snackBar.open(`${message} ${this.copyMessage}`, "",
      {
        duration: 3000,
        horizontalPosition: 'end',
        panelClass: this.isDarkMode ? ['message-dark-mode'] : ['message']
      })
  }

  mainFunc() {
    this.isShowFunc = false;
    this.colorsDisplay = [];
    const takeOneByOne = this.delayLoop.pipe(take(this.colors.length));
    takeOneByOne.subscribe(index => {
      this.colorsDisplay.push(this.colors[index]);

      if (index === this.colors.length - 1) {
        this.isShowFunc = true;
      }
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 100);
    })
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
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", +this.isDarkMode + "");
  }
}
