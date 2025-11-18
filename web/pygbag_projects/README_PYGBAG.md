# Pygbag Build Instructions

## Building Pygame Projects for Web

Pygbag converts Pygame projects to WebAssembly for browser execution.

### Prerequisites

```bash
pip install pygbag
```

### Building TicTacToe

```bash
cd pygbag_projects/tictactoe_web
pygbag --build .
```

This creates a `build/web` directory with the compiled WebAssembly app.

### Building Minesweeper

```bash
cd pygbag_projects/minesweeper_web
pygbag --build .
```

### Serving Locally

```bash
pygbag --serve tictactoe_web
```

Then open http://localhost:8000

### Integration with Frontend

The built apps in `build/web` can be served as static files and embedded in the Next.js frontend using iframes.

### Notes

- Pygbag requires Python 3.11+
- Some Pygame features may not be fully supported in WebAssembly
- The original code is not modified - we just add a main.py entry point
- Symlinks to original files (tictactoe.py, runner.py, etc.) keep code in sync

### Symlinking Original Files

Instead of copying files, we create symlinks to the original projects:

```bash
# For TicTacToe
cd tictactoe_web
ln -s ../../../TicTacToe/tictactoe.py .
ln -s ../../../TicTacToe/runner.py .
ln -s ../../../TicTacToe/OpenSans-Regular.ttf .

# For Minesweeper
cd ../minesweeper_web
ln -s ../../../minesweeper/minesweeper.py .
ln -s ../../../minesweeper/runner.py .
ln -s ../../../minesweeper/assets assets
```

This ensures any updates to original code automatically reflect in the web version.
