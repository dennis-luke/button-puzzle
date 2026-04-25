import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelsService } from './levels.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  currentLevel = 1;
  showLevelComplete = false;
  showLevelMenu = false;
  completedLevels: Set<number> = new Set();
  buttonGrid: string[][] = [];
  private initialGrid!: string[][];
  displayGrid: string[][] = [];
  buttonGridHistory: string[][][] = [];
  private numRows = 0;
  private numColumns = 0;
  private trimTop = 0;
  private trimBottom = 0;
  private trimLeft = 0;
  private trimRight = 0;

  constructor(private levelsService: LevelsService) {}

  ngOnInit(): void {
    const savedLevel = localStorage.getItem('buttonPuzzleLevel');
    if (savedLevel) {
      this.currentLevel = parseInt(savedLevel, 10);
    }
    const savedCompleted = localStorage.getItem('buttonPuzzleCompleted');
    if (savedCompleted) {
      this.completedLevels = new Set(JSON.parse(savedCompleted));
    }
    this.loadLevel(this.currentLevel);
  }

  private saveLevelToStorage() {
    localStorage.setItem('buttonPuzzleLevel', this.currentLevel.toString());
    localStorage.setItem('buttonPuzzleCompleted', JSON.stringify([...this.completedLevels]));
  }

  openLevelMenu() {
    this.showLevelMenu = true;
  }

  closeLevelMenu() {
    this.showLevelMenu = false;
  }

  selectLevel(level: number) {
    if (!this.isLevelUnlocked(level)) {
      return;
    }
    this.currentLevel = level;
    this.saveLevelToStorage();
    this.loadLevel(this.currentLevel);
    this.closeLevelMenu();
  }

  isLevelUnlocked(level: number): boolean {
    return level <= this.currentLevel;
  }

  isLevelCompleted(level: number): boolean {
    return this.completedLevels.has(level);
  }

  isLevelCurrent(level: number): boolean {
    return level === this.currentLevel;
  }

  get levelsList(): number[] {
    return Array.from({ length: this.levelsService.getMaxLevel() }, (_, i) => i + 1);
  }

  private loadLevel(level: number) {
    const levelData = this.levelsService.getLevel(level);
    if (!levelData) {
      return;
    }
    this.buttonGrid = structuredClone(levelData);
    this.initialGrid = structuredClone(this.buttonGrid);
    this.buttonGridHistory = [];
    this.validateButtonGrid();
    this.trimGrid();
  }

  private trimGrid() {
    this.numRows = this.buttonGrid.length;
    this.numColumns = this.buttonGrid[0].length;

    this.trimTop = 0;
    for (let y = 0; y < this.numRows; y++) {
      if (this.rowHasNonSea(y)) {
        this.trimTop = y;
        break;
      }
    }

    this.trimBottom = this.numRows - 1;
    for (let y = this.numRows - 1; y >= 0; y--) {
      if (this.rowHasNonSea(y)) {
        this.trimBottom = y;
        break;
      }
    }

    this.trimLeft = 0;
    for (let x = 0; x < this.numColumns; x++) {
      if (this.colHasNonSea(x)) {
        this.trimLeft = x;
        break;
      }
    }

    this.trimRight = this.numColumns - 1;
    for (let x = this.numColumns - 1; x >= 0; x--) {
      if (this.colHasNonSea(x)) {
        this.trimRight = x;
        break;
      }
    }

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

      // Check if level is complete
      if (this.isLevelComplete()) {
        this.completedLevels.add(this.currentLevel);
        this.saveLevelToStorage();
        setTimeout(() => this.showLevelComplete = true, 300);
      }
    } else {
      throw Error('Unexpected text on button: ' + previousText);
    }
  }

  private isLevelComplete(): boolean {
    for (const row of this.buttonGrid) {
      for (const cell of row) {
        if (cell !== '_') {
          return false;
        }
      }
    }
    return true;
  }

  private nextLevel() {
    this.currentLevel++;
    this.saveLevelToStorage();
    if (this.currentLevel <= this.levelsService.getMaxLevel()) {
      this.loadLevel(this.currentLevel);
    }
  }

  nextLevelClick() {
    this.showLevelComplete = false;
    setTimeout(() => this.nextLevel(), 100);
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

  reset() {
    this.buttonGrid = structuredClone(this.initialGrid);
    this.buttonGridHistory = [];
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

  getCornerClass(x: number, y: number): string {
    const isSea = (cx: number, cy: number): boolean => {
      if (cx < 0 || cx >= this.displayGrid[0].length || cy < 0 || cy >= this.displayGrid.length) {
        return true;
      }
      return this.displayGrid[cy][cx] === '_';
    };

    const hasSeaAbove = isSea(x, y - 1);
    const hasSeaBelow = isSea(x, y + 1);
    const hasSeaLeft = isSea(x - 1, y);
    const hasSeaRight = isSea(x + 1, y);

    let classes = '';
    if (hasSeaAbove && hasSeaRight) classes += ' corner-tr';
    if (hasSeaAbove && hasSeaLeft) classes += ' corner-tl';
    if (hasSeaBelow && hasSeaRight) classes += ' corner-br';
    if (hasSeaBelow && hasSeaLeft) classes += ' corner-bl';

    return classes;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'z') {
      this.undo();
      event.preventDefault();
    }
  }
}