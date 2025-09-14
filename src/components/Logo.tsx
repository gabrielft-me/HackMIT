import logo from "../assets/img/AIPlugLogo.png";

interface LogoProps {
  width?: string | number;
  height?: string | number;
}

export const Logo = ({ width = 60, height = 50 }: LogoProps) => {
  return (
    <img
      src={logo}
      className="img-fluid"
      alt="AIPlug Logo"
      style={{ width, height, objectFit: "contain" }}
    />
  );
};
