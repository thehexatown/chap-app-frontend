import { styled } from "@stitches/react";

const Button = styled("button", {
  border: "none",
  borderRadius: "23px",

  width: "180px",
  height: "70px",

  backgroundColor: "#D3D3D3",
  color: "#fff",

  fontSize: "1.3em",

  transition: "background-color 200ms ease-in-out",

  cursor: "pointer",

  "&:hover": {
    backgroundColor: "#250606",
  },
});

function HitButton(props) {
  return (
    <Button disabled={props.disabled} onClick={props.onClick}>
      Hit
    </Button>
  );
}

export default HitButton;
