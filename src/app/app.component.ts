import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  // Intro
  // buttonGrid: string[][] = [
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  // ];

  // Intro
  // buttonGrid: string[][] = [
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  // ];

  // Intro
  // buttonGrid: string[][] = [
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '3', '2', '_', '_', '_', '_', '_', '_'],
  //   ['_', '1', '0', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  // ];

  // Intro
  // buttonGrid: string[][] = [
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '2', '_', '_', '_', '_', '_', '_'],
  //   ['_', '0', '4', '0', '_', '_', '_', '_', '_'],
  //   ['_', '_', '2', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  // ];

  // Easy
  // buttonGrid: string[][] = [
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '_', '_', '_', '_', '_', '_'],
  //   ['_', '2', '4', '2', '_', '_', '_', '_', '_'],
  //   ['_', '_', '0', '0', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  // ];

  // Easy
  // buttonGrid: string[][] = [
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '_', '_', '_', '_', '_'],
  //   ['_', '0', '_', '0', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  // ];

  // Medium
  // buttonGrid: string[][] = [
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  // ];

  // Hard
  // buttonGrid: string[][] = [
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '0', '0', '_', '_', '_'],
  //   ['_', '_', '_', '0', '0', '0', '_', '_', '_'],
  //   ['_', '_', '_', '0', '0', '0', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  // ];

  // Medium
  // buttonGrid: string[][] = [
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '0', '0', '_', '_', '_'],
  //   ['_', '0', '0', '0', '0', '0', '_', '_', '_'],
  //   ['_', '0', '0', '0', '0', '0', '_', '_', '_'],
  //   ['_', '0', '0', '0', '0', '0', '_', '_', '_'],
  //   ['_', '0', '0', '0', '0', '0', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  // ];

  // Medium
  // buttonGrid: string[][] = [
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '0', '0', '_', '_', '_'],
  //   ['_', '0', '0', '_', '0', '0', '_', '_', '_'],
  //   ['_', '0', '_', '_', '_', '0', '_', '_', '_'],
  //   ['_', '0', '0', '_', '0', '0', '_', '_', '_'],
  //   ['_', '0', '0', '0', '0', '0', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  // ];

  // Medium
  buttonGrid: string[][] = [
    ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '2', '1', '_', '_', '_', '_', '_', '_'],
    ['_', '3', '0', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '0', '1', '_', '_', '_', '_'],
    ['_', '_', '_', '0', '2', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  ];

  // Medium
  // buttonGrid: string[][] = [
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '0', '1', '2', '_', '_', '_', '_', '_'],
  //   ['_', '0', '1', '2', '_', '_', '_', '_', '_'],
  //   ['_', '0', '1', '2', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  // ];

  // Hard
  // buttonGrid: string[][] = [
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '_', '_', '_', '_', '_'],
  //   ['_', '0', '0', '0', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  //   ['_', '_', '_', '_', '_', '_', '_', '_', '_'],
  // ];
  displayGrid: string[][] = [];
  buttonGridHistory: string[][][] = [];
  private numRows = 0;
  private numColumns = 0;
  private trimTop = 0;
  private trimBottom = 0;
  private trimLeft = 0;
  private trimRight = 0;

  ngOnInit(): void {
    this.validateButtonGrid();
    this.trimGrid();
  }

  private trimGrid() {
    this.numRows = this.buttonGrid.length;
    this.numColumns = this.buttonGrid[0].length;

    // Find topmost row with non-sea
    this.trimTop = 0;
    for (let y = 0; y < this.numRows; y++) {
      if (this.rowHasNonSea(y)) {
        this.trimTop = y;
        break;
      }
    }

    // Find bottommost row with non-sea
    this.trimBottom = this.numRows - 1;
    for (let y = this.numRows - 1; y >= 0; y--) {
      if (this.rowHasNonSea(y)) {
        this.trimBottom = y;
        break;
      }
    }

    // Find leftmost column with non-sea
    this.trimLeft = 0;
    for (let x = 0; x < this.numColumns; x++) {
      if (this.colHasNonSea(x)) {
        this.trimLeft = x;
        break;
      }
    }

    // Find rightmost column with non-sea
    this.trimRight = this.numColumns - 1;
    for (let x = this.numColumns - 1; x >= 0; x--) {
      if (this.colHasNonSea(x)) {
        this.trimRight = x;
        break;
      }
    }

    // Create trimmed display grid
    this.displayGrid = [];
    for (let y = this.trimTop; y <= this.trimBottom; y++) {
      const row: string[] = [];
      for (let x = this.trimLeft; x <= this.trimRight; x++) {
        row.push(this.buttonGrid[y][x]);
      }
      this.displayGrid.push(row);
    }
  }

  private rowHasNonSea(y: number): boolean {
    for (let x = 0; x < this.numColumns; x++) {
      if (this.buttonGrid[y][x] !== '_') {
        return true;
      }
    }
    return false;
  }

  private colHasNonSea(x: number): boolean {
    for (let y = 0; y < this.numRows; y++) {
      if (this.buttonGrid[y][x] !== '_') {
        return true;
      }
    }
    return false;
  }

  onButtonClick(x: number, y: number): void {
    const actualX = x + this.trimLeft;
    const actualY = y + this.trimTop;
    const previousText = this.buttonGrid[actualY][actualX];
    if (previousText === '_') {
      return;
    }
    if (this.isNonNegativeIntegerString(previousText)) {
      this.buttonGridHistory.push(structuredClone(this.buttonGrid));
      const previousValue = parseInt(previousText);
      if (previousValue === this.countNeighbours(actualX, actualY)) {
        this.buttonGrid[actualY][actualX] = '_';
      } else {
        this.raiseNeighboursByOne(actualX, actualY);
      }
      this.refreshDisplayGrid();
    } else {
      throw Error('Unexpected text on button: ' + previousText);
    }
  }

  private refreshDisplayGrid() {
    this.displayGrid = [];
    for (let y = this.trimTop; y <= this.trimBottom; y++) {
      const row: string[] = [];
      for (let x = this.trimLeft; x <= this.trimRight; x++) {
        row.push(this.buttonGrid[y][x]);
      }
      this.displayGrid.push(row);
    }
  }

  private raiseNeighboursByOne(x: number, y: number) {
    const minX = Math.max(x - 1, 0);
    const maxX = Math.min(x + 1, this.numColumns - 1);
    const minY = Math.max(y - 1, 0);
    const maxY = Math.min(y + 1, this.numRows - 1);
    for (let i = minX; i <= maxX; i++) {
      for (let j = minY; j <= maxY; j++) {
        if (i === x && j === y) {
          continue;
        }
        if (this.isNonNegativeIntegerString(this.buttonGrid[j][i])) {
          this.buttonGrid[j][i] = (parseInt(this.buttonGrid[j][i]) + 1).toString();
        }
      }
    }
  }

  private countNeighbours(x: number, y: number): number {
    const minX = Math.max(x - 1, 0);
    const maxX = Math.min(x + 1, this.numColumns - 1);
    const minY = Math.max(y - 1, 0);
    const maxY = Math.min(y + 1, this.numRows - 1);
    let count = 0;
    for (let i = minX; i <= maxX; i++) {
      for (let j = minY; j <= maxY; j++) {
        if (i === x && j === y) {
          continue;
        }
        if (this.isNonNegativeIntegerString(this.buttonGrid[j][i])) {
          count++;
        }
      }
    }
    return count;
  }

  private isNonNegativeIntegerString(str: string): boolean {
    return /^\d+$/.test(str);
  }

  private validateButtonGrid() {
    this.numRows = this.buttonGrid.length;
    this.numColumns = this.buttonGrid[0].length;
    if (this.numRows === 0 || this.numColumns === 0) {
      throw Error("Button grid must have values");
    }
    for (const row of this.buttonGrid) {
      if (!row || row.length !== this.numColumns) {
        console.log('row', row);
        console.log('this.numColumns', this.numColumns);
        throw Error("Button grid must be a rectangle");
      }
    }
  }

  undo() {
    if (this.buttonGridHistory.length === 0) {
      return;
    }
    this.buttonGrid = this.buttonGridHistory.pop()!;
    this.refreshDisplayGrid();
  }

  getButtonClass(text: string): string {
    if (text === '_') {
      return 'btn btn-sea';
    }
    const value = parseInt(text);
    if (isNaN(value)) {
      return 'btn btn-sea';
    }
    switch (value) {
      case 0: return 'btn btn-beach';
      case 1: return 'btn btn-grassy-dunes';
      case 2: return 'btn btn-grass';
      case 3: return 'btn btn-forest';
      case 4: return 'btn btn-mountain-4';
      case 5: return 'btn btn-mountain-5';
      case 6: return 'btn btn-mountain-6';
      case 7: return 'btn btn-mountain-7';
      default: return 'btn btn-mountain-8';
    }
  }

  isNumber(text: string): boolean {
    return /^\d+$/.test(text);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'z') {
      this.undo();
      event.preventDefault();
    }
  }


}