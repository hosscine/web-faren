# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Start development server with live reload:
```bash
npm start
```

Install dependencies:
```bash
npm install
```

## Project Architecture

This is a JavaScript tactical strategy game (ファーレントゥーガ) built with CreateJS. The application uses a stage-based architecture where different game screens are managed as separate Stage classes.

### Core Architecture

- **Entry Point**: `index.html` loads all JavaScript modules and initializes the game
- **Asset System**: `PreloadAssets.js` handles loading game data from `assets/Default/Data/` directory
- **Stage Pattern**: Game screens inherit from `createjs.Stage`:
  - `SelectCharacterStage`: Character selection screen
  - `StrategyMapStage`: Main strategy/world map gameplay
  - `BattleMapStage`: Tactical battle encounters
  - `SidebarStage`: Persistent UI sidebar

### Key Directory Structure

- `js/reader/`: Data parsers for game files (AreaData, BattleMap, CharacterData, etc.)
- `js/bitmap/`: Image and map chip handling classes
- `js/gameObject/`: Core game entities (Unit, Area, MasterUnit)
- `js/stage/`: Game screen implementations organized by functionality
- `js/UI/`: Reusable UI components (Button, ScrollContainer, BBText)
- `js/scroller/`: Scrolling and animation utilities
- `assets/Default/`: Game data and assets (maps, characters, scripts)

### Data Flow

1. `PreloadAssets.js` loads binary and text data from `assets/Default/Data/`
2. Reader classes parse game data into JavaScript objects
3. Stage classes consume parsed data to build game screens
4. Game objects manage state and interactions

### Development Notes

- Uses CreateJS for canvas rendering and event handling
- Game data stored in custom binary and text formats
- Stage transitions managed through visibility and focus methods
- Asset loading uses CreateJS LoadQueue with custom binary handling
- Map data stored as numbered BMap files (BMap_No1 through BMap_No61)