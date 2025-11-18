"""
TicTacToe - Pygbag Entry Point
Minimax Game AI for the web
"""

import asyncio
import sys
import os

# Add parent directories to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'TicTacToe'))

# Import original modules
import pygame
import runner

async def main():
    """Main entry point for Pygbag"""
    runner.main()

if __name__ == "__main__":
    asyncio.run(main())
