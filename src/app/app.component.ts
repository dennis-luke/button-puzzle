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
  currentGroup = 'Ionian Sea';
  showLevelComplete = false;
  showLevelMenu = false;
  showRules = false;
  showBadgeDialog = false;
  unlockedLevels: Map<string, Set<number>> = new Map([['Ionian Sea', new Set([1])]]);
  unlockedGroups: Set<string> = new Set(['Ionian Sea']);
  earnedBadges: Set<string> = new Set();
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
    const savedGroup = localStorage.getItem('buttonPuzzleGroup');
    if (savedGroup) {
      this.currentGroup = savedGroup;
    }
    const savedUnlocked = localStorage.getItem('buttonPuzzleUnlocked');
    if (savedUnlocked) {
      const parsed = JSON.parse(savedUnlocked);
      this.unlockedLevels = new Map(Object.entries(parsed).map(([k, v]) => [k, new Set(v as number[])]));
    }
    const savedUnlockedGroups = localStorage.getItem('buttonPuzzleUnlockedGroups');
    if (savedUnlockedGroups) {
      this.unlockedGroups = new Set(JSON.parse(savedUnlockedGroups));
    }
    const savedBadges = localStorage.getItem('buttonPuzzleBadges');
    if (savedBadges) {
      this.earnedBadges = new Set(JSON.parse(savedBadges));
    }
    this.loadLevel(this.currentLevel, this.currentGroup);
  }

  private saveLevelToStorage() {
    localStorage.setItem('buttonPuzzleLevel', this.currentLevel.toString());
    localStorage.setItem('buttonPuzzleGroup', this.currentGroup);
    const unlockedObj: { [key: string]: number[] } = {};
    this.unlockedLevels.forEach((levels, group) => {
      unlockedObj[group] = [...levels];
    });
    localStorage.setItem('buttonPuzzleUnlocked', JSON.stringify(unlockedObj));
    localStorage.setItem('buttonPuzzleUnlockedGroups', JSON.stringify([...this.unlockedGroups]));
    localStorage.setItem('buttonPuzzleBadges', JSON.stringify([...this.earnedBadges]));
  }

  openLevelMenu() {
    this.showLevelMenu = true;
  }

  closeLevelMenu() {
    this.showLevelMenu = false;
  }

  openRules() {
    this.showRules = true;
  }

  closeRules() {
    this.showRules = false;
  }

  openBadgeDialog() {
    this.showBadgeDialog = true;
  }

  closeBadgeDialog() {
    this.showBadgeDialog = false;
  }

  goToLevelMenuFromBadge() {
    this.closeBadgeDialog();
    this.openLevelMenu();
  }

  getBadgeColor(groupName: string): string {
    switch (groupName) {
      case 'Ionian Sea': return '#e53935';
      case 'Aegean Sea': return '#ff9800';
      case 'Tyrrhenian Sea': return '#ffeb3b';
      default: return '#8b4513';
    }
  }

  selectLevel(level: number, groupName: string) {
    if (!this.isLevelUnlockedInGroup(level, groupName)) {
      return;
    }
    this.currentLevel = level;
    this.currentGroup = groupName;
    this.saveLevelToStorage();
    this.loadLevel(this.currentLevel, this.currentGroup);
    this.closeLevelMenu();
  }

  private checkAndUnlockGroups() {
    const groups = this.levelsService.getGroups();
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (this.unlockedGroups.has(group.group)) {
        continue;
      }
      const prevGroup = groups[i - 1];
      if (!prevGroup) {
        continue;
      }
      const prevGroupLevels = this.levelsService.getLevelsInGroup(prevGroup.group);
      const prevUnlockedLevels = this.unlockedLevels.get(prevGroup.group);
      const allPrevCompleted = prevGroupLevels.every(lvl => prevUnlockedLevels ? prevUnlockedLevels.has(lvl) : false);
      if (allPrevCompleted) {
        const groupLevels = this.levelsService.getLevelsInGroup(group.group);
        let newGroupLevels = this.unlockedLevels.get(group.group);
        if (!newGroupLevels) {
          newGroupLevels = new Set();
          this.unlockedLevels.set(group.group, newGroupLevels);
        }
        newGroupLevels.add(groupLevels[0]);
        this.unlockedGroups.add(group.group);
        if (prevGroup.group === 'Ionian Sea') {
          const nextGroups = groups.slice(i + 1);
          for (const nextGroup of nextGroups) {
            const nextGroupLevels = this.levelsService.getLevelsInGroup(nextGroup.group);
            if (nextGroupLevels.length > 0) {
              let ngLevels = this.unlockedLevels.get(nextGroup.group);
              if (!ngLevels) {
                ngLevels = new Set();
                this.unlockedLevels.set(nextGroup.group, ngLevels);
              }
              ngLevels.add(nextGroupLevels[0]);
              this.unlockedGroups.add(nextGroup.group);
            }
          }
        }
      }
    }
  }

  isGroupUnlocked(groupName: string): boolean {
    return this.unlockedGroups.has(groupName);
  }

  isGroupUnlockedAndHasFirstLevelUnlocked(groupName: string): boolean {
    if (!this.isGroupUnlocked(groupName)) {
      return false;
    }
    const levels = this.levelsService.getLevelsInGroup(groupName);
    const groupLevels = this.unlockedLevels.get(groupName);
    return levels.length > 0 && groupLevels ? groupLevels.has(levels[0]) : false;
  }

  isLevelUnlocked(level: number): boolean {
    const groupLevels = this.unlockedLevels.get(this.currentGroup);
    return groupLevels ? groupLevels.has(level) : false;
  }

  isLevelCurrent(level: number, groupName: string): boolean {
    return level === this.currentLevel && groupName === this.currentGroup;
  }

  isLevelUnlockedInGroup(level: number, groupName: string): boolean {
    const groupLevels = this.unlockedLevels.get(groupName);
    return groupLevels ? groupLevels.has(level) : false;
  }

  hasNextLevel(): boolean {
    const currentGroupLevels = this.levelsService.getLevelsInGroup(this.currentGroup);
    const currentIndex = currentGroupLevels.indexOf(this.currentLevel);
    if (currentIndex < currentGroupLevels.length - 1) {
      return true;
    }
    const groups = this.levelsService.getGroups();
    const currentGroupIndex = groups.findIndex(g => g.group === this.currentGroup);
    return currentGroupIndex < groups.length - 1;
  }

  get levelsList(): number[] {
    return Array.from({ length: this.levelsService.getMaxLevel() }, (_, i) => i + 1);
  }

  get levelTitle(): string {
    const levelInGroup = this.levelsService.getLevelsInGroup(this.currentGroup).indexOf(this.currentLevel) + 1;
    return `${this.currentGroup} ${levelInGroup}`;
  }

  get groups() {
    return this.levelsService.getGroups();
  }

  get earnedBadgesList(): string[] {
    return [...this.earnedBadges];
  }

  hasEarnedBadge(groupName: string): boolean {
    return this.earnedBadges.has(groupName);
  }

  getLevelsInGroup(groupName: string): number[] {
    return this.levelsService.getLevelsInGroup(groupName);
  }

  private loadLevel(level: number, groupName: string) {
    const levelData = this.levelsService.getLevel(level, groupName);
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
      const previousValue = parseInt(previousText);
      const neighborsCount = this.countNeighbours(actualX, actualY);
      const willClear = previousValue === neighborsCount;
      const hasNumericNeighbors = this.hasNumericNeighbors(actualX, actualY);

      if (!willClear && !hasNumericNeighbors) {
        return;
      }

      this.buttonGridHistory.push(structuredClone(this.buttonGrid));

      if (willClear) {
        this.buttonGrid[actualY][actualX] = '_';
      } else {
        this.raiseNeighboursByOne(actualX, actualY);
      }

      this.refreshDisplayGrid();

      // Check if level is complete
      if (this.isLevelComplete()) {
        const currentGroupLevels = this.levelsService.getLevelsInGroup(this.currentGroup);
        const isLastInGroup = this.currentLevel === currentGroupLevels[currentGroupLevels.length - 1];
        if (isLastInGroup) {
          this.earnedBadges.add(this.currentGroup);
          this.checkAndUnlockGroups();
          this.saveLevelToStorage();
          setTimeout(() => {
            this.showLevelComplete = false;
            this.openBadgeDialog();
          }, 300);
        } else {
          let groupLevels = this.unlockedLevels.get(this.currentGroup);
          if (!groupLevels) {
            groupLevels = new Set();
            this.unlockedLevels.set(this.currentGroup, groupLevels);
          }
          groupLevels.add(this.currentLevel + 1);
          this.saveLevelToStorage();
          setTimeout(() => this.showLevelComplete = true, 300);
        }
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
    const currentGroupLevels = this.levelsService.getLevelsInGroup(this.currentGroup);
    const currentIndex = currentGroupLevels.indexOf(this.currentLevel);
    if (currentIndex < currentGroupLevels.length - 1) {
      this.currentLevel++;
    } else {
      const groups = this.levelsService.getGroups();
      const currentGroupIndex = groups.findIndex(g => g.group === this.currentGroup);
      if (currentGroupIndex < groups.length - 1) {
        const nextGroup = groups[currentGroupIndex + 1];
        this.currentGroup = nextGroup.group;
        this.currentLevel = 1;
      }
    }
    this.saveLevelToStorage();
    this.loadLevel(this.currentLevel, this.currentGroup);
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

  private hasNumericNeighbors(x: number, y: number): boolean {
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
          return true;
        }
      }
    }
    return false;
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