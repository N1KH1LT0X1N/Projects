"""
Nim API - Q-Learning Game AI
Real-time game with reinforcement learning AI
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Dict, Optional
import sys
import os
import json

# Import original nim module
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'nim'))
from nim import Nim, train, play

router = APIRouter()

# Global AI storage
trained_ais = {}

class TrainRequest(BaseModel):
    games: int = 10000
    ai_id: Optional[str] = "default"

class TrainResponse(BaseModel):
    ai_id: str
    games_trained: int
    q_table_size: int

class GameState(BaseModel):
    piles: List[int]
    current_player: int
    game_over: bool
    winner: Optional[int]

@router.post("/train", response_model=TrainResponse)
async def train_ai(request: TrainRequest):
    """Train a new AI with specified number of games"""
    from nim import NimAI

    # Train AI
    ai = train(request.games)

    # Store AI
    ai_id = request.ai_id
    trained_ais[ai_id] = ai

    return TrainResponse(
        ai_id=ai_id,
        games_trained=request.games,
        q_table_size=len(ai.q)
    )

@router.get("/ai/{ai_id}/qvalues")
async def get_q_values(ai_id: str):
    """Get Q-values for a trained AI"""
    if ai_id not in trained_ais:
        return {"error": f"AI '{ai_id}' not found"}

    ai = trained_ais[ai_id]

    # Convert Q-values to serializable format
    q_values = {}
    for (state, action), value in ai.q.items():
        state_str = str(state)
        action_str = str(action)
        if state_str not in q_values:
            q_values[state_str] = {}
        q_values[state_str][action_str] = value

    return {
        "ai_id": ai_id,
        "q_values": q_values,
        "total_entries": len(ai.q)
    }

@router.get("/ai/list")
async def list_ais():
    """List all trained AIs"""
    return {
        "ais": list(trained_ais.keys()),
        "count": len(trained_ais)
    }

@router.websocket("/ws/game")
async def websocket_game(websocket: WebSocket):
    """WebSocket endpoint for real-time Nim game"""
    await websocket.accept()

    # Initialize game
    game = Nim()

    # Train AI if not already trained
    if "default" not in trained_ais:
        ai = train(10000)
        trained_ais["default"] = ai
    else:
        ai = trained_ais["default"]

    try:
        # Send initial game state
        await websocket.send_json({
            "type": "game_state",
            "piles": game.piles,
            "player": game.player
        })

        while True:
            # Receive player move
            data = await websocket.receive_json()

            if data["type"] == "player_move":
                pile = data["pile"]
                count = data["count"]

                # Validate move
                if pile < 0 or pile >= len(game.piles):
                    await websocket.send_json({
                        "type": "error",
                        "message": "Invalid pile"
                    })
                    continue

                if count < 1 or count > game.piles[pile]:
                    await websocket.send_json({
                        "type": "error",
                        "message": "Invalid count"
                    })
                    continue

                # Make player move
                game.move((pile, count))

                # Check if game over
                if game.winner is not None:
                    await websocket.send_json({
                        "type": "game_over",
                        "winner": game.winner,
                        "piles": game.piles
                    })
                    break

                # AI's turn
                ai_action = ai.choose_action(game.piles, epsilon=False)
                game.move(ai_action)

                # Send updated state
                await websocket.send_json({
                    "type": "ai_move",
                    "pile": ai_action[0],
                    "count": ai_action[1],
                    "piles": game.piles
                })

                # Check if game over
                if game.winner is not None:
                    await websocket.send_json({
                        "type": "game_over",
                        "winner": game.winner,
                        "piles": game.piles
                    })
                    break

            elif data["type"] == "new_game":
                # Start new game
                game = Nim()
                await websocket.send_json({
                    "type": "game_state",
                    "piles": game.piles,
                    "player": game.player
                })

    except WebSocketDisconnect:
        pass
