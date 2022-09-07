import { useState, useContext, useEffect } from "react";
import {
  formatScore,
  generateCard,
  generateHand,
  generateLeftHand,
} from "../../../src/actions/generateHand";
import SocketContext from "../../context/socketContext";

import Card from "../card";
import Computer from "../computer";
import HitButton from "../hitButton";
import StandButton from "../standButton";
import Tutorial from "../tutorial";
import Wallet from "../wallet";
import WinnerCard from "../winnerCard";
import globalStyles from "../../../src/globalStyles";

globalStyles();

function BlackJack({ ids, room, loby }) {
  const socket = useContext(SocketContext);
  const currentSocket = ids[0];
  const otherSocket = ids[1];
  const [tutorial, openTutorial] = useState(false);

  const [leftControls, setLeftControls] = useState(true);
  const [rightControls, setRightControls] = useState(true);
  const [leftHit, setLeftHit] = useState(false);
  const [turn, setTurn] = useState(true);
  const [RightHit, setRightHit] = useState(false);
  const [player, setPlayer] = useState({
    name: "player",
    score: 0,
    deck: [],
  });
  const [leftPlayer, setleftPlayer] = useState({
    name: "LeftPlayer",
    score: 0,
    deck: [],
  });

  const [wallet, setWallet] = useState(200);

  const [pc, setPc] = useState({
    name: "dealer",
    score: 0,
    deck: [],
  });

  const [RightWinner, setRightWinner] = useState({
    winner: "",
    state: false,
  });
  const [LeftWinner, setLeftWinner] = useState({
    win: "",
    state: false,
  });

  useEffect(() => {
    socket.on("leftData", ({ player, turn }) => {
      setleftPlayer(player);
      setTurn(false);
    });
    socket.on("RightHit", ({ player, room, wallet, pc }) => {
      setPlayer(player);
      setPc(pc);
      setWallet(wallet);
    });
    socket.on("LeftWinner", ({ state, whowin }) => {
      setLeftWinner({
        win: whowin,
        state: state,
      });
    });
    for (let i = 0; i < room.length; i++) {
      if (i == 0) {
        setPlayer(room[i]);
      }
      if (i == 1) {
        setleftPlayer(room[i]);
      }
      if (i == 2) {
        setPc(room[i]);
      }
    }
  }, []);

  useEffect(() => {
    if (leftHit) {
      socket.emit("leftHit", {
        player: leftPlayer,
        room: loby,
        turn: false,
      });
    }
  }, [leftHit]);
  useEffect(() => {
    if (RightHit) {
      socket.emit("RightHit", {
        player: player,
        room: loby,
        wallet: wallet,
        pc: pc,
        state: LeftWinner?.state,
        whowin: LeftWinner?.winner,
      });
    }
  }, [RightHit]);

  useEffect(() => {
    if (LeftWinner.state) {
      socket.emit("LeftWinner", {
        state: LeftWinner?.state,
        whowin: LeftWinner?.win,
        room: loby,
      });
    }
  }, [LeftWinner]);
  const LeftHitButton = async () => {
    if (leftPlayer.deck.length == 2) {
      const prevPlayerDeck = leftPlayer.deck;
      const playerCard = generateCard();
      const newPlayerScore =
        leftPlayer.score + formatScore(Number(playerCard[1]));
      prevPlayerDeck.push(playerCard);
      setleftPlayer({
        ...leftPlayer,
        score: newPlayerScore,
      });
      setLeftHit(true);
      setLeftControls(false);
    }
  };

  const LeftStandbutton = async () => {
    setLeftHit(true);
    setLeftControls(false);
  };

  const calculateLeftScore = async (leftPlayer, newPcScore) => {
    let rightWon;
    if (leftPlayer.score == 21) {
      // setWallet(wallet + 10);
      rightWon = "Won";
    } else if (newPcScore == 21) {
      // setWallet(wallet - 10);

      rightWon = "lost";
    } else if (leftPlayer.score > 21) {
      // setWallet(wallet - 10);

      rightWon = "lost";
    } else if (newPcScore > 21 && leftPlayer.score < 21) {
      // setWallet(wallet + 10);
      rightWon = "Won";
    } else if (newPcScore > leftPlayer.score) {
      // setWallet(wallet - 10);
      rightWon = "lost";
    } else {
      // setWallet(wallet + 10);
      rightWon = "Won";
    }

    setLeftWinner({
      win: rightWon,
      state: true,
    });
  };

  const RightHitButton = async () => {
    if (player.deck.length == 2) {
      const prevPcDeck = pc.deck;
      const pcCard = generateCard();
      prevPcDeck.push(pcCard);
      const newPcScore = pc.score + formatScore(Number(pcCard[1]));
      setPc({ ...pc, deck: prevPcDeck, score: newPcScore });

      const prevPlayerDeck = player.deck;
      const playerCard = generateCard();

      const newPlayerScore = player.score + formatScore(Number(playerCard[1]));

      prevPlayerDeck.push(playerCard);
      setPlayer({
        ...player,
        deck: prevPlayerDeck,
        score: newPlayerScore,
      });
      setRightHit(true);

      let whoWin;

      if (newPlayerScore == 21) {
        whoWin = "Won";
      } else if (newPcScore == 21) {
        setWallet(wallet - 10);

        whoWin = "lost";
      } else if (newPlayerScore > 21) {
        setWallet(wallet - 10);

        whoWin = "lost";
      } else if (newPcScore > 21 && newPlayerScore < 21) {
        setWallet(wallet + 10);
        whoWin = "Won";
      } else if (newPcScore > newPlayerScore) {
        setWallet(wallet - 10);
        whoWin = "lost";
      } else {
        setWallet(wallet + 10);
        whoWin = "Won";
      }

      setRightWinner({
        winner: whoWin,
        state: true,
      });

      calculateLeftScore(leftPlayer, newPcScore);
      setRightControls(false);
    }
  };

  return (
    <>
      {tutorial ? <Tutorial state={openTutorial}></Tutorial> : null}
      <div className="container">
        {socket.id == currentSocket ? (
          <div>
            {LeftWinner.state ? (
              <div className="flex">
                <WinnerCard winner={LeftWinner.win}></WinnerCard>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {socket.id == otherSocket ? (
          <div>
            {RightWinner.state && (
              <WinnerCard winner={RightWinner.winner}></WinnerCard>
            )}
          </div>
        ) : (
          //turn message here
          ""
        )}
        <div className="deck">
          {pc.deck.map((card) => {
            let cardHidden = true;
            pc.deck.length == 3 ? (cardHidden = false) : (cardHidden = true);
            return <Card card={card} cardHidden={cardHidden}></Card>;
          })}
          <h1>
            {pc.deck.length == 2
              ? formatScore(Number(pc.deck[0][1]))
              : pc.score}
          </h1>
        </div>
        <div className="deck">
          {player.deck.map((card) => {
            return <Card card={card}></Card>;
          })}
          <h1>{player.score}</h1>
        </div>
        {rightControls &&
          (socket.id === otherSocket ? (
            <div className="flex">
              <HitButton
                disabled={turn}
                onClick={() => RightHitButton()}
              ></HitButton>
              <StandButton
                disabled={turn}
                onClick={() => {
                  if (player.deck.length == 2) {
                    const prevPcDeck = pc.deck;
                    const pcCard = generateCard();
                    prevPcDeck.push(pcCard);
                    const newPcScore =
                      pc.score + formatScore(Number(pcCard[1]));
                    setPc({ ...pc, deck: prevPcDeck, score: newPcScore });
                    let whoWin;
                    if (newPcScore == 21) {
                      whoWin = "lost";
                    } else if (newPcScore > 21) {
                      whoWin = "Win";
                    } else if (newPcScore > player.score) {
                      whoWin = "lost";
                    } else {
                      whoWin = "Win";
                    }

                    setRightWinner({
                      winner: whoWin,
                      state: true,
                    });

                    setRightHit(true);
                    calculateLeftScore(leftPlayer, newPcScore);
                    setRightControls(false);
                  }
                }}
              ></StandButton>
            </div>
          ) : (
            ""
          ))}
        <div className="leftPlayer">
          <div className="deck">
            {leftPlayer.deck.map((card) => {
              return <Card card={card}></Card>;
            })}
            <h1>{leftPlayer.score}</h1>
          </div>
          {leftControls &&
            (socket.id == currentSocket ? (
              <div className="flex">
                <HitButton
                  disabled={leftHit}
                  onClick={() => {
                    LeftHitButton();
                  }}
                ></HitButton>
                <StandButton
                  onClick={() => {
                    LeftStandbutton();
                  }}
                ></StandButton>
              </div>
            ) : (
              ""
            ))}
        </div>
      </div>
    </>
  );
}

export default BlackJack;
