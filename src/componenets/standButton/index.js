import { styled } from "@stitches/react";
import standIcon from "./standIcon.svg";

const Button = styled("button", {
  border: "none",
  borderRadius: "50px",

  width: "70px",
  height: "70px",

  backgroundColor: "#FFEA7A",

  fontSize: "1.3em",

  transition: "background-color 200ms ease-in-out",

  cursor: "pointer",

  "&:hover": {
    backgroundColor: "#ffd07a",
  },

  "& > img": {
    width: "30px",
  },
});

function StandButton(props) {
  return (
    <Button disabled={props.disabled} onClick={props.onClick}>
      <img src={standIcon} alt="" />
    </Button>
  );
}

export default StandButton;
