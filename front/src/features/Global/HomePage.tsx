import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { GameDetail } from "../../config/global.config";

const HomePage = () => {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <div className="grid grid-rows-5 h-full w-full">
        {/* Compagny Logo */}
        <div className="row-span-2 w-full flex justify-center items-center">
          <img
            className="w-96"
            src={process.env.PUBLIC_URL + "/logo/logo_transparent.png"}
            alt="Logo 19/20"
          />
        </div>

        {/* Game preview --> iterate on HomePageGame in config/global.config.ts*/}
        <div className="row-span-2 w-full flex justify-center">
          {GameDetail.map((e) => (
            <div className="my-8 mx-16" key={e.gameName}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  className="media-card"
                  component="img"
                  image={process.env.PUBLIC_URL + e.imgPath}
                  alt="game image"
                />
                <CardContent className="flex flex-col justify-center items-center">
                  <Typography gutterBottom variant="h5" component="div">
                    {e.gameName}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center">
          <Link to="/game">
            <Button size="large" variant="contained">
              Play now!
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
