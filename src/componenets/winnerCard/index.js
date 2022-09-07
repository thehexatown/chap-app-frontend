import { keyframes, styled } from "@stitches/react";
import Chips from "../chips";

const moveFromRight = keyframes({
  "0%": { marginLeft: "130px", opacity: "0" },
  "100%": { marginLeft: "0", opacity: "1" },
});

const Card = styled("div", {
  width: "300px",
  height: "163px",

  borderRadius: "23px",

  background: "#be3662",

  zIndex: "20",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",

  animation: `${moveFromRight} 200ms forwards`,

  fontSize: "2em",
  fontFamily: "Carter One",
  fontWeight: "600",

  color: "#000",

  "& > div": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

function WinnerCard(props) {
  return <Card> You {props.winner}</Card>;
}

export default WinnerCard;
